---
layout: post
title: "Native Win32 for fun and profit"
---

*\[Note: this is ported from my [old
blog](http://ben.straubnet.net/post/3074077580/native-win32-for-fun-and-profit),
and there's more discussion there.\]*

All the cool kids these days are playing with awesome dynamic languages, or on
cool frameworks.  I'm stuck with c++ at work, but every now and then I get to
do something cool with it.

![radial menu](/images/nativewin32/1.png)


That's the [Wacom radial
menu](http://graphicssoft.about.com/od/hardware/ig/Wacom-Intuos4/Intuos4-Radial-Menu.htm),
which is implemented as a fully alpha-blended window in native Win32. Something
like this is dead simple in WPF, but with native code it's a bit trickier.
I used WTL, GDI+, and a handy, little-known Windows feature to get it done, and
I'm going to share my secrets with you, dear reader.

## Dependencies
#### WTL

Windowing frameworks are thick on the ground, and I've been mostly dissatisfied
with the abilities of the Win32-wrapping category. However, they make something
like this reusable, so what the heck. 

You can grab WTL at [the project home on
SourceForge](http://wtl.sourceforge.net/). For this project, I'm just taking
the files in the `include` directory and putting them under `wtl` in my project
directory, so I don't get the Windows SDK versions instead.

I've found this to be the best way to include the WTL headers:

```c++
#define _SECURE_ATL 1
#define _WTL_NO_AUTOMATIC_NAMESPACE
#define _ATL_NO_AUTOMATIC_NAMESPACE

// These are required to be included first
#include "atlbase.h"
#include "atlwin.h"
#include "wtl/atlapp.h"

#include "wtl/atlgdi.h"   // For WTL::CDC
#include "wtl/atlframe.h" // For WTL::CFrameWindowImpl
```

Those defines specify that the ATL and WTL classes should stay safely ensconced
in their own namespaces. This means you have to reference them as
`WTL::CFrameWndImpl`, but it keeps the global namespace clean, which is a major
failing of `windows.h`.

#### GDI+

GDI+ is an immediate-mode drawing API that has shipped with Windows since XP,
so I can use it without needing to ship yet another redistributable installer.
Here's all you need to do:

```c++
#pragma comment(lib, "gdiplus.lib")
#include &lt;gdiplus.h>
```

While GDI+ is written in c++ and uses classes, it's initialization isn't
RAII-friendly, so I wrote a little wrapper class:

```c++
class ScopedGdiplusInitializer
{
public:
  ScopedGdiplusInitializer()
  {
    Gdiplus::GdiplusStartupInput gdisi;
    Gdiplus::GdiplusStartup(&mGdipToken, &gdisi, NULL);
  }
  ~ScopedGdiplusInitializer()
  {
    Gdiplus::GdiplusShutdown(mGdipToken);
  }
private:
  ULONG_PTR mGdipToken;
};
```

Now I can write my main function like this:

```c++
int main()
{
  ScopedGdiplusInitializer gdiplusinit;
  // ...
}
```

#### Boost

The production code for this feature uses boost (specifically `shared_ptr`),
but in the interest of simplicity I've left it out. If you use boost, or your
compiler supports the new `std::shared_ptr` introduced with TR1, I _highly_
recommend you use that instead of raw pointers whenever possible.

## A window class

Here's where it all comes together. Meet me after the code, and I'll explain
more fully.

```c++
class AlphaWindow
  : public WTL::CFrameWindowImpl<
      AlphaWindow, ATL::CWindow,
      ATL::CWinTraits< WS_POPUP, WS_EX_LAYERED > >
{
public:
  DECLARE_FRAME_WND_CLASS(_T("WTLAlphaWindow"), 0);

  virtual ~AlphaWindow()
  {
    if (IsWindow())
    {
      SendMessage(WM_CLOSE);
    }
  }

  void UpdateWithBitmap(Gdiplus::Bitmap *bmp_I,
                        POINT *windowLocation_I = NULL)
  {
    // Create a memory DC
    HDC screenDC = ::GetDC(NULL);
    WTL::CDC memDC;
    memDC.CreateCompatibleDC(screenDC);
    ::ReleaseDC(NULL, screenDC);

    // Copy the input bitmap and select it into the
    // memory DC
    WTL::CBitmap localBmp;
    {
      bmp_I->GetHBITMAP(Gdiplus::Color(0,0,0,0),
                        &localBmp.m_hBitmap);
    }
    HBITMAP oldBmp = memDC.SelectBitmap(localBmp);

    // Update the display
    POINT p = {0};
    SIZE s = {bmp_I->GetWidth(), bmp_I->GetHeight()};
    BLENDFUNCTION bf = {AC_SRC_OVER, 0,
                        255, AC_SRC_ALPHA};
    {
      ::UpdateLayeredWindow(m_hWnd, NULL,
                            windowLocation_I,
                            &s, memDC, &p,
                            RGB(0,255,255),
                            &bf, ULW_ALPHA);
    }
    ShowWindow(SW_SHOWNORMAL);

    // Cleanup
    memDC.SelectBitmap(oldBmp);
  }
};
```

### Layered Windows

The magic ingredients for this class are the `WS_EX_*` styles and the
`UpdateLayeredWindow` call.

First, the styles. These are specified on line 3, as part of the base class.
That's just how you declare your window's styles in WTL. There are two:

* `WS_POPUP` means this is a square window with no decorations around the
  outside. No title bar, no close button, nothing.
* `WS_EX_LAYERED` tells Windows that [this window is
  different](http://msdn.microsoft.com/en-us/library/ms997507.aspx), and that
  it can do per-pixel alpha blending with other windows. This was available in
  Windows 2000, but starting with Vista the window's face could be cached and
  composited by the GPU, which made it much more useful.

The call to `UpdateLayeredWindow` on line 35 is what tells Windows what the
contents of the display are. There's some clunky interop code here, since the
GDI+ `Bitmap` object can't be used directly with the GDI-oriented layered
window API. I'm sure there's a better way, but in my case the overhead of
copying my smallish `Bitmap` into another smallish `HBITMAP` wasn't a problem.

WTL complains rather loudly if a window object is destroyed before the HWND
it's wrapping is closed, so the destructor on line 7 takes care of that.

### Pretty Pictures

That `UpdatedLayeredWindow` call is wrapped in a method that takes a GDI+
bitmap, so now all we need to do is provide it with one. GDI+ makes this pretty
easy, especially when compared to GDI code:

```c++
using namespace Gdiplus;
// Create a bitmap buffer
Bitmap bmp(400,400);
// Context for drawing on the bitmap
Graphics g(&bmp);
g.Clear(Color::Black);
// ...
```

## All together now
Here's the `main` function of my little test program.

```c++
int main()
{
  ScopedGdiplusInitializer init;

  {
    // Create the display window
    AlphaWindow wnd;
    wnd.Create();
    wnd.SetWindowPos(NULL, 200,200, 0,0,
                     SWP_NOSIZE | SWP_NOREPOSITION);

    // Create a backbuffer
    Gdiplus::Bitmap bmp(400,400);

    // Clear the background of the buffer to
    // translucent black
    Gdiplus::Graphics g(&bmp);
    g.Clear(Gdiplus::Color(100,0,0,0));

    // This tells GDI+ to anti-alias edges
    g.SetSmoothingMode(
       Gdiplus::SmoothingModeAntiAlias);

    // Draw two semi-transparent ellipses
    Gdiplus::Pen redPen(Gdiplus::Color(100,255,0,0),
                        10.);
    Gdiplus::Pen bluePen(Gdiplus::Color(100,0,0,255),
                         10.);
    g.DrawEllipse(&redPen, 50,50, 200,300);
    g.DrawLine(&bluePen, 175,10, 175,390);
    g.DrawEllipse(&redPen, 100,50, 200,300);

    // Update the window's display
    wnd.UpdateWithBitmap(&bmp);

    // Wait to exit
    getchar();
  }
}
```

I know, programmer demos of this are always ugly. Maybe one day I'll write
about how to store a PNG as a resource, and load it in for use with this. For
now, you get an ugly screenshot:

![ugly test image](/images/nativewin32/2.png)


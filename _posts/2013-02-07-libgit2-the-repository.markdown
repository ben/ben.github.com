---
layout: post-no-feature
title: "libgit2: The Repository"
date: 2013-03-05 12:00
comments: true
categories: libgit2
---

In [libgit2](http://libgit2.github.com/), the `git_repository` object is the gateway to getting interesting stuff out of git.
There are several ways to get your hands on one.

## Clone

If your repository exists on a remote but not on the local machine, you can get it using [`git_clone`](http://libgit2.github.com/libgit2/#HEAD/group/repository/git_clone), and once it's done with all the network stuff, it spits out a repository object.
Check out [my post on cloning](/2013/02/01/stupid-libgit2-tricks-cloning/) for more on that.

## Discover

If you know a particular directory is a git repository, you can just hand the path to [`git_repository_open`](http://libgit2.github.com/libgit2/#HEAD/group/repository/git_repository_open).
The path can be to a bare repository, a `.git` folder, or a working directory.

{% highlight c %}
git_repository *repo;
int error = git_repository_open(
  &repo,
  "/path/to/repository/on/disk");
{% endhighlight %}

In classic C fashion, libgit2 APIs generally return 0 on success, and a negative error code on failure.
Occasionally the API documentation will mention the specific error codes that will come back, but you can always check the [error header](https://github.com/libgit2/libgit2/blob/HEAD/include/git2/errors.h#files) for the values.

If all you have is a path that you *think* is controlled by git, you can let libgit2 walk the directory structure to find it's owning repository (if there is one).
This approach works well if your application is dealing primarily with documents, like a text editor.

{% highlight c %}
char path[1024];
if (0 == git_repository_discover(
  path, 1024,                       // buffer & size
  "/path/to/a/controlled/file.md",  // where to start
  true,                             // across filesystems?
  "/path"))                         // where to stop
{
  git_repository *repo;
  error = git_repository_open(&repo, path);
}
{% endhighlight %}

## Initialize

If you want to create a new repository, [`git_repository_init`](http://libgit2.github.com/libgit2/#HEAD/group/repository/git_repository_init) is the call for you.

{% highlight c %}
git_repository *repo;
int error = git_repository_init(
  &repo,                // output
  "path/to/new/repo",   // path
  false);               // bare?
{% endhighlight %}

This is kind of like running `git init` from the command line.
If you need more control, you'll use [`git_repository_init_ext`](http://libgit2.github.com/libgit2/#HEAD/group/repository/git_repository_init_ext):

{% highlight c %}
git_repository *repo;
git_repository_init_options options =
  GIT_REPOSITORY_INIT_OPTIONS_INIT;
// ... (configure options)
int error = git_repository_init_ext(
  &repo,                // output
  "/path/to/new/repo",  // path
  &options);            // options
{% endhighlight %}

The signature itself looks similar to the simpler version, but that options structure exposes **lots** of behavior.
Things like:

* separating your `.git` directory from the workdir
* adding a description or using a template
* setting the initial branch name

Unfortunately, as of this writing the documentation parser doesn't output structure-field comment-docs, but the [header](https://github.com/libgit2/libgit2/blob/HEAD/include/git2/repository.h#files) is pretty helpful.

{% include libgit2_footer.md %}

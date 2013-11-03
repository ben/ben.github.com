---
layout: post-no-feature
title: "libgit2: Checkout"
date: 2013-04-02 10:43
comments: true
categories: libgit2
---

So you've got this [git repository](/2013/03/05/libgit2-the-repository), and it's got a bunch of stuff in it – refs, trees, blobs, commits – and you want to work with that stuff.
One way to think about that stuff is by thinking about how it's organized into [three trees](http://git-scm.com/2011/07/11/reset.html), and moving stuff between those trees.
In libgit2, the way you get stuff from a commit into the index and the working tree is by using the checkout API.

## This isn't "`git checkout`"

The first thing to realize is that libgit2 isn't just a reimplementation of the git command line tool.
That means that some terminology is reused, but doesn't necessarily work the same way.
In libgit2, checkout is all about modifying the index and/or working directory, based on content from the index or a tree in the object database.

Libgit2's checkout API has (as of this writing) three modes:

* `git_checkout_head` updates the index and working tree to match the content of the tree pointed to by `HEAD`.
* `git_checkout_index` updates the working directory to match the content of the index.
* `git_checkout_tree` updates the working directory to the content of a specified tree.

None of those deal with actually moving `HEAD` around, which is most of what I use `git checkout` for, but hey.
If you want to move refs around, try the refs API.

## Wholesale

The general form for calling a checkout API is this:

```c
git_repository *repo;
git_checkout_opts opts = GIT_CHECKOUT_OPTS_INIT;
// customize options...
int error = git_checkout_head(repo, &opts);
```

That `opts` structure is where all the good stuff happens.
The default mode of operation is to

1. Check every file in the tree that's being read for differences with the index and/or working directory, and
1. do absolutely nothing to the working directory.

By design, you have to be very explicit when you're writing stuff to the working directory.
To specify what strategy you want the checkout to use, you modify `opts.checkout_strategy`, usually to one of these values:

* `GIT_CHECKOUT_SAFE` will update files that match what's in the index (files that haven't been changed), but won't create missing files.
* `GIT_CHECKOUT_SAFE_CREATE` does the above plus creating missing files. This is what [`git_clone`](/2013/02/01/stupid-libgit2-tricks-cloning) uses by default.
* `GIT_CHECKOUT_FORCE` does the above, plus overwriting uncommitted changes.
  This is the most like `git checkout -f`.

There are some other behavior flags you can include in this field as well:

* `GIT_CHECKOUT_ALLOW_CONFLICTS` allows the checkout to proceed even if there are unresolved merge conflicts (the default is to return an error if any are present).
* `GIT_CHECKOUT_REMOVE_UNTRACKED` removes files that aren't being tracked by git (but doesn't touch ignored files).
* `GIT_CHECKOUT_REMOVE_IGNORED` removes ignored files that aren't in the index (but doesn't touch non-ignored files that are untracked).

That's just a sampling; the [header comments](https://github.com/libgit2/libgit2/blob/HEAD/include/git2/checkout.h#files), are pretty helpful for using the rest.

## Progress and notification callbacks

The `git_checkout_*` calls are blocking.
If you want to know how things are going, or display progress to the user, you have to register callbacks.
There are two types.

### Progress

The progress callback notifies you as checkout actually writes files to the working directory.
Here's how one might look:

```c
static void checkout_progress(
  const char *path,
  size_t current,
  size_t total,
  void *payload)
{
  printf("checkout: %3d%% - %s\n",
    100*current/total,
    path);
}

// ...
git_checkout_opts opts = GIT_CHECKOUT_OPTS_INIT;
opts.progress_cb = checkout_progress;
int error = git_checkout_head(repo, &opts);
```

The output looks something like this:

```text
checkout:   0% - (null)
checkout:  12% - a/a1
checkout:  25% - a/a1.txt
checkout:  37% - a/a2.txt
checkout:  50% - b/b1.txt
checkout:  62% - b/b2.txt
checkout:  75% - c/c1.txt
checkout:  87% - c/c2.txt
checkout: 100% - master.txt
```

### "Notifications"
The other callback you can specify is more specific about what's going on with the files in the working directory.
Checkout actually uses diff to do its work, so it doesn't always overwrite every file in the working directory.
If the contents match, no work is done at all.
That little bit of understanding might make it easier to see this callback in action:

```c
static int checkout_notify_cb(
  git_checkout_notify_t why,
  const char *path,
  const git_diff_file *baseline,
  const git_diff_file *target,
  const git_diff_file *workdir,
  void *payload)
{
  printf("path '%s' - ", path);
  switch (why) {
  case GIT_CHECKOUT_NOTIFY_CONFLICT:
    printf("conflict\n");
    break;
  case GIT_CHECKOUT_NOTIFY_DIRTY:
    printf("dirty\n");
    break;
  case GIT_CHECKOUT_NOTIFY_UPDATED:
    printf("updated\n");
    break;
  case GIT_CHECKOUT_NOTIFY_UNTRACKED:
    printf("untracked\n");
    break;
  case GIT_CHECKOUT_NOTIFY_IGNORED:
    printf("ignored\n");
    break;
  default:
  break;
  }

  return 0;
}

// ...
git_checkout_opts opts = GIT_CHECKOUT_OPTS_INIT;
opts.checkout_strategy = GIT_CHECKOUT_SAFE;
opts.notify_flags =
  GIT_CHECKOUT_NOTIFY_CONFLICT |
  GIT_CHECKOUT_NOTIFY_DIRTY |
  GIT_CHECKOUT_NOTIFY_UPDATED |
  GIT_CHECKOUT_NOTIFY_UNTRACKED |
  GIT_CHECKOUT_NOTIFY_IGNORED;
opts.notify_cb = checkout_notify_cb;
git_checkout_head(repo, &opts);
```

Here's some example output.
I've created the `.gitignore` file so that `foo` will be ignored, and changed the contents of `master.txt`.

```text
path '.gitignore' - untracked
path 'a/a1.txt' - dirty
path 'foo' - ignored
checkout:   0% - (null)
```

I've left the progress callback as-is, so you can see how these two features interact -- notifications happen as checkout is *determining what to do*, and progress callbacks happen as checkout is *doing the things*.

That's when the checkout strategy is set to `GIT_CHECKOUT_SAFE_CREATE`.
Watch what happens when I change it to this:

```c
opts.checkout_strategy =
  GIT_CHECKOUT_FORCE |
  GIT_CHECKOUT_REMOVE_UNTRACKED;
```

```text
path '.gitignore' - untracked
path 'a/a1.txt' - dirty
path 'a/a1.txt' - updated
path 'foo' - ignored
checkout:   0% - (null)
checkout:  50% - .gitignore
checkout: 100% - a/a1.txt
```

You can see that `a/a1.txt` was updated in the index, and if we had specified a progress callback, you'd see it being written in the working directory.

We also asked checkout to remove untracked files (but not ignored ones), so it deleted the `.gitignore` file, leaving `foo` as untracked instead of ignored.
If we run it again:

```text
path 'foo' - untracked
checkout:   0% - (null)
checkout: 100% - foo

```

... it removes the `foo` file as well.

One other capability that the notification callback gives you is *the ability to cancel the checkout* before any changes have been written to disk.
Just return something other than `0`, and the process will simply be aborted.

## One file at a time

What if you don't want to check out the entire working directory?
What if you just want to discard the changes made to one file?
The options structure has a field for you -- it's named `paths`, and it's of type `git_strarray`.

Despite the name, it's actually an array of fnmatch-patterns, like `"foo/*"` -- the same format as you'd use in a `.gitignore` file.
Continuing our earlier example, if I wanted to limit the files checkout is looking at to just the files in the `a` directory, I could do this:

```c
char *paths[] = { "a/*" };
opts.paths.strings = paths;
opts.paths.count = 1;
```

And the output would look something like this:

```text
path 'a/a1.txt' - dirty
path 'a/a1.txt' - updated
checkout:   0% - (null)
checkout: 100% - a/a1.txt
```

Note there's no mention of `.gitignore` or `foo`; they're filtered out by path matching before any of the diff logic is even applied.

## Not `HEAD`

All of the examples we've seen so far use `git_checkout_head`.
What if you want to pull out content that isn't from `HEAD`?
We saw in the beginning that you can easily pull content out of the index by doing this:

```c
git_checkout_index(repo, NULL, &opts);
```

This gets content from the index and writes it to the working directory.
It's similar to doing `git checkout [file]` without specifying a branch or revision.
That `NULL` parameter could also refer to a separate index, which is a bit beyond the scope of this post.

You can also pull content from elsewhere in the history.
For instance, to replicate something like `git checkout HEAD~~ master.txt`, you could do this:

```c
char *paths[] = {"master.txt"};
opts.paths.strings = paths;
opts.paths.count = 1;

// Get "HEAD~~"
git_commit *commit;
git_revparse_single((git_object*)&commit, repo, "HEAD~~");

// Do the checkout
git_checkout_tree(repo, commit, &opts);

// Clean up
git_commit_free(commit);
```

## That's about it
**NOTE: You should do error checking.**
You should also check out the documentations comments in the [`git2/checkout.h`](https://github.com/libgit2/libgit2/blob/HEAD/include/git2/checkout.h#files) header -- they're really well-written, and they cover more than what I've got here.


{% include libgit2_footer.md %}

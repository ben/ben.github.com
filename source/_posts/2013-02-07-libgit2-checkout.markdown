---
layout: post
title: "libgit2: Checkout"
date: 2013-02-07 10:43
comments: true
published: false
categories: libgit2
---

What's the first thing you do once you've cloned a repository?  That's right, you switch branches.  Or find a point in the history that has *awful* source code, and make a blog post about how terrible it is.

Well, the way git pronounces "move around in history" is `checkout`.

## This isn't "`git checkout`"

The first thing to realize is that libgit2 isn't just a reimplementation of the git command line tool. That means that some terminology is reused, but doesn't necessarily work the same way. In libgit2, checkout is all about modifying the index and/or working directory, based on content from the index or a tree in the .

Libgit2's checkout API has (as of this writing) three modes:

* `git_checkout_head` updates the index and working tree to match the content of the commit-tree pointed to by `HEAD`.
* `git_checkout_index` updates the working directory to match the content of the index.
* `git_checkout_tree` updates the working directory to the content of a specified tree.

None of those deal with actually moving `HEAD` around, which is half of what I use `git checkout` for, but hey. If you want to move refs around, try the refs API.

## Wholesale

The general form for calling a checkout API is this:

```c
git_repository *repo;
git_checkout_opts opts = GIT_CHECKOUT_OPTS_INIT;
// customize options...
int error = git_checkout_head(repo, &opts);
```

That `opts` structure is where all the good stuff happens. The default mode of operation is to

## Progress and notification callbacks

How do you know what checkout is up to?

## One file at a time

strarray and you

## Checkout from not-`HEAD`

finding the right tree


{% include libgit2_footer.md %}
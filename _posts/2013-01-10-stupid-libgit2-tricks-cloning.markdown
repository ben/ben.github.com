---
layout: post
title: "libgit2: Cloning"
date: 2013-02-01 10:00
comments: true
published: true
categories: libgit2
---

[Libgit2](http://libgit2.github.com) aims to make it easy to do interesting things
with git.  What's the first thing you always do when learning git?  That's
right, you clone something from GitHub.  Let's get started, shall we? Let's get
some of the boilerplate out of the way:

```c
#include "git2.h"
#include <stdio.h>

int main(int argc, char **argv)
{
	const char *url, *path;

	if (argc < 3) {
		printf("USAGE: clone <url> <path>\n");
		return -1;
	}

	url = argv[1];
	path = argv[2];
	return do_clone(url, path);
}
```


What does the do_clone method look like?  Let's start simple:

```c
static int do_clone(const char *url, const char *path)
{
	git_repository *repo = NULL;
	int ret = git_clone(&repo, url, path, NULL);
	git_repository_free(repo);
	return ret;
}
```

`git_clone` takes some information, and fills in a pointer for us with
a `git_repository` object we can use to do *all manner of unholy things*.  For
now, let's ignore the repository itself, except to be good citizens and release
the memory associated with it.

That `NULL` parameter?  That's for a `git_clone_options` structure, which
defaults to some sensible stuff.  The way our code is written right now, these
two commands will have the same results:

```sh
./clone http://github.com/libgit2/libgit2 ./libgit2
git clone http://github.com/libgit2/libgit2
```

... except that `git` tells you what it's doing.  Let's fix that.

One of the things you can do with `git_clone_options` is have libgit2 call
a function when there is progress to report.  A typical callback looks like
this:

```c
static void fetch_progress(
		const git_transfer_progress *stats,
		void *payload)
{
	int fetch_percent =
		(100 * stats->received_objects) /
		stats->total_objects;
	int index_percent =
		(100 * stats->indexed_objects) /
		stats->total_objects;
	int kbytes = stats->received_bytes / 1024;

	printf("network %3d%% (%4d kb, %5d/%5d)  /"
			"  index %3d%% (%5d/%5d)\n",
			fetch_percent, kbytes,
			stats->received_objects, stats->total_objects,
			index_percent,
			stats->indexed_objects, stats->total_objects);
}
```

That `stats` object gives you lots of useful stuff:

* The number of objects transferred over the network
* The number of objects that the indexer has processed
* The total number of objects expected
* The number of bytes transferred

So let's rewrite our `do_clone` function to plug that in:


```c
static int do_clone(const char *url, const char *path)
{
	git_repository *repo = NULL;
	git_clone_options opts = GIT_CLONE_OPTIONS_INIT;
	int ret;

	opts.fetch_progress_cb = fetch_progress;
	ret = git_clone(&repo, url, path, &opts);
	git_repository_free(repo);
	return ret;
}
```

If you run this now, the program will tell you what it's doing!  You can watch
the network transfer happening, and notice that the indexer is doing its job
*at the same time*.

```text
[...]
network  73% (   7 kb,    51/   69)  /  index  71% (   49/   69)
network  75% (   7 kb,    52/   69)  /  index  72% (   50/   69)
network  76% (   7 kb,    53/   69)  /  index  73% (   51/   69)
network  78% (   7 kb,    54/   69)  /  index  75% (   52/   69)
[...]
```

If you try this with a large repository, you'll notice a significant pause at
the end.  All the data has been moved, what's going on?  It turns out that
doing a checkout can take a non-trivial amount of time.  It also turns out that
libgit2 will let you report that progress as well!

But that's part of checkout, which warrants its own blog post.  In the
meantime, check out the [clone
header](https://github.com/libgit2/libgit2/blob/development/include/git2/clone.h)
to see what `git_clone` can do.  If you want to, you could even use the [code
from this post](https://gist.github.com/4693571) as a starting point for your
own experiments.

{% include libgit2_footer.md %}

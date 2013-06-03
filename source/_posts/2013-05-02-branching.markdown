---
layout: post
title: "libgit2: Branching and Refs"
date: 2013-05-02 12:21
comments: true
published: false
categories: draft libgit2
---

Blah blah blah.


## Refs

There are several ways of getting to the refs.
If you just want a single one:

```c
git_reference *ref;
git_reference_lookup(&ref, repo, "HEAD");
```

The string argument is the full name of the ref; for a named branch, this would look like `refs/heads/master`.
There's also a shortcut to use a more humane ref name:

```c
git_reference_dwim(&ref, repo, "master");
```

That one applies the [standard git precedence rules](https://github.com/libgit2/libgit2/blob/development/src/refs.c#L193-L198) to figure out which ref you mean.

There's also a way of getting to *all* of the refs in a repository:

```c
int each_ref(git_reference *ref, void *payload)
{
  printf("  %s\n", git_reference_name(ref));
  return 0;
}

git_reference_foreach(repo, each_ref, NULL);
```

Once you have a `git_reference*`, what can you do with it? Well, you can check to see if it's symbolic (like `HEAD` usually is) or direct (like `master` usually is):

```c
switch(git_reference_type(ref)) {
  case GIT_REF_OID:
  {
    char oidstr[41] = {0};
    git_oid_fmt(oidstr, git_reference_target(ref));
    printf("It's a direct reference to %s\n", oidstr);
    break;
  }
  case GIT_REF_SYMBOLIC:
  {
    printf("It's a symbolic reference to '%s'\n",
      git_reference_symbolic_target(ref));
    break;
  }
}
```

You can change its target, which in combination with [`git_checkout_head`](/2013/04/02/libgit2-checkout/) would get close to the branch-switching behavior of `git checkout`:

```c
git_reference *new_ref;
git_reference_symbolic_set_target(&new_ref, ref,
                                  "refs/heads/devel");
```

Note that a `git_reference` is conceptually immutable, so changing the target of one gives you a new instance rather than modifying the one you already have.

You can also create new references. This is a good start towards `git checkout -b`:

```c
git_object *obj;
git_revparse_single(&obj, repo, "master");
git_reference_create(&new_ref, repo, "refs/heads/feature1",
                     git_object_id(obj), 1);
git_object_free(obj);
```

## Tags

Git tags come in two flavors: [lightweight and annotated](http://git-scm.com/book/en/Git-Basics-Tagging).
Lightweight tags are just regular references, so you can handle them with the refs API.
But annotated tags have structured data stored in the object database.
This is represented in libgit2 as a `git_tag` structure.

Again, there are several ways to get your hands on a tag annotation.
You can do a direct lookup if you know the hash of the annotation:

```c
git_oid oid;
git_oid_fromstr(&oid, "bbea158ddb36042aa47ce1e4d0188684b20157d3");
git_tag *tag;
git_tag_lookup(&tag, repo, &oid);
```

If all you know is the tag's name, it takes a couple of steps:

```c
git_reference *ref;
git_reference_lookup(&ref, repo, "refs/tags/annotated");
git_tag *tag;
git_reference_peel((git_object**)&tag, ref, GIT_OBJ_TAG);
```

What can you do with one of these guys?
Mostly they're for inspecting properties:

```c
// Get the full name of the tag
const char *name = git_tag_name(tag);
// Get the targeted object's ID
git_oid *target = git_tag_target_id(tag);
// TODO: more
```

How do you create tags?
As I mentioned above, lightweight tags are just references, so you'd use `git_reference_create`, and give it a name like `refs/tags/foo`.
Annotated tags have their own creation call:

```c
// TODO
```

{% include libgit2_footer.md %}

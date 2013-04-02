#include "../../../libgit2/include/git2.h"
#include <stdio.h>

static void checkout_progress(
  const char *path,
  size_t current,
  size_t total,
  void *payload)
{
  int percent = total > 0
    ? 100 * current / total
    : 0;
  printf("checkout: %3d%% - %s\n",
    percent,
    path);
}
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
    printf("???\n");
    break;
  }

  return 0;
}


int main(void)
{
  git_repository *repo;
  if (git_repository_open(&repo, ".") < 0) {
    printf("Try this again at the root of a git repo.\n");
    return -1;
  }

  git_checkout_opts opts = GIT_CHECKOUT_OPTS_INIT;
  opts.checkout_strategy =
    GIT_CHECKOUT_FORCE |
    GIT_CHECKOUT_REMOVE_UNTRACKED;
  opts.checkout_strategy = GIT_CHECKOUT_SAFE;

  char *paths[] = {"master.txt"};
  opts.paths.strings = paths;
  opts.paths.count = 1;

  // Get "HEAD~~"
  git_commit *commit;
  git_revparse_single((git_object*)&commit, repo, "58be465~");

  // Do the checkout
  git_checkout_tree(repo, commit, &opts);

  // Clean up
  git_commit_free(commit);

  opts.progress_cb = checkout_progress;
  opts.notify_flags =
    GIT_CHECKOUT_NOTIFY_CONFLICT |
    GIT_CHECKOUT_NOTIFY_DIRTY |
    GIT_CHECKOUT_NOTIFY_UPDATED |
    GIT_CHECKOUT_NOTIFY_UNTRACKED |
    GIT_CHECKOUT_NOTIFY_IGNORED;
  opts.notify_cb = checkout_notify_cb;
  return git_checkout_head(repo, &opts);
}




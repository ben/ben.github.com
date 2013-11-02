#include "../../../libgit2/include/git2.h"
#include <stdio.h>

int each_ref(git_reference *ref, void *payload)
{
  printf("  %s\n", git_reference_name(ref));
  return 0;
}

int main(int argc, char **argv)
{
  char *refname = argv[1];
  if (argc < 2) refname = "HEAD";

  int error;
  git_repository *repo;
  if ((error = git_repository_open(&repo, ".")) < 0) {
    printf("Try this again at the root of a git repo.\n");
    return -1;
  }

  git_reference *ref;
  if ((error = git_reference_lookup(&ref, repo, refname)) < 0) {
    printf("Error %d resolving %s\n", error, refname);
    return error;
  }
  printf("Opened %s\n", refname);

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
      printf("It's a symbolic reference to '%s'\n", git_reference_symbolic_target(ref));
      break;
    }
    default: break;
  }

  git_reference_foreach(repo, each_ref, NULL);


  git_reference *new_ref;
  if ((error = git_reference_symbolic_set_target(&new_ref, ref, "refs/heads/devel")) < 0) {
    printf("Set target failed: %s\n", giterr_last()->message);
  } else {
    printf("%s now points to %s\n", git_reference_name(new_ref), git_reference_symbolic_target(new_ref));
  }
  printf("Old ref still points to %s\n", git_reference_symbolic_target(ref));

  git_object *obj;
  git_revparse_single(&obj, repo, "master");
  git_reference_create(&new_ref, repo, "refs/heads/feature1", git_object_id(obj), 1);
  git_object_free(obj);

  git_reference_free(ref);


  /////////////////////////////////////
  git_oid oid;
  git_oid_fromstr(&oid, "bbea158ddb36042aa47ce1e4d0188684b20157d3");
  git_tag *tag;
  git_tag_lookup(&tag, repo, &oid);
  printf("%s\n", git_tag_message(tag));
  git_tag_free(tag);

  git_reference_lookup(&ref, repo, "refs/tags/annotated");
  git_reference_peel((git_object**)&tag, ref, GIT_OBJ_TAG);
  printf("%s\n", git_tag_message(tag));
  git_tag_free(tag);

  git_signature *sig;
  git_signature_now(&sig, "Mr. Tagger", "mr@tagger.com");
  git_oid annotation_id;
  git_tag_create(
    &annotation_id,      // newly-created object's id
    repo,                // repository
    "new_annotated_tag", // tag name
    obj,                 // tag target
    sig,                 // signature
    "A message",         // message
    1);                  // force if name collides

  git_repository_free(repo);
  return 0;
}

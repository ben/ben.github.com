#include "../../../libgit2/include/git2.h"
#include <stdio.h>

void visit(git_commit *c)
{
	size_t i, num_parents = git_commit_parentcount(c);

	/* Print some stuff about this commit */

	for (i=0; i<num_parents; i++) {
		/* Do the same for the parents */
		git_commit *p;
		if (!git_commit_parent(&p, c, i))
			visit(p);
	}
}

int main(void)
{
	git_repository *repo;
	if (git_repository_open(&repo, ".") < 0) {
		printf("Try this again at the root of a git repo.\n");
		return -1;
	}

	git_commit *c;
	if (git_revparse_single((git_object**)&c, repo, "HEAD^{commit}") < 0)
		return -1;

	/*visit(c);*/

	git_revwalk *walk;
	if (git_revwalk_new(&walk, repo) < 0)
	{ /* ERROR */ }

	git_revwalk_sorting(walk, GIT_SORT_TOPOLOGICAL | GIT_SORT_TIME);
	git_revwalk_push_head(walk);
	git_revwalk_hide_glob(walk, "tags/*");

	git_object *obj;
	git_revparse_single(&obj, repo, "HEAD~10");
	git_revwalk_hide(walk, git_object_id(obj));
	git_object_free(obj);

	git_oid oid;
	while (git_revwalk_next(&oid, walk) == 0) {
		git_commit *c;
		char oidstr[10] = {0};
		git_commit_lookup(&c, repo, &oid);
		git_oid_tostr(oidstr, 9, &oid);
		printf("%s\n%s\n\n", oidstr,
				git_commit_message(c));
		git_commit_free(c);
	}

	git_commit_free(c);
	git_revwalk_free(walk);
	git_repository_free(repo);
}

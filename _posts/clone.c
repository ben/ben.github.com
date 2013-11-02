#include "../../../libgit2/include/git2.h"
#include <stdio.h>

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




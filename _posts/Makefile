.PHONY: all

LIBGIT2 = ../../../libgit2

CC = gcc
CFLAGS = -g -I$(LIBGIT2)/include -Wall -Wextra -Wmissing-prototypes -Wno-missing-field-initializers
LFLAGS = -L$(LIBGIT2)/build -lgit2
APPS = clone checkout refs revwalk

all: $(APPS)

% : %.c
	$(CC) -o $@ $(CFLAGS) $< $(LFLAGS)

clean:
	$(RM) $(APPS)
	$(RM) -rf *.dSYM
	$(RM) -f *.o

#!/usr/bin/env bash

# Thin wrapper for compatibility with older naming.
# Delegates to make_200_commits.sh in the same directory.

set -u
cd "$(dirname "$0")" || exit 1

if [[ ! -x "./make_200_commits.sh" ]]; then
  echo "make_200_commits.sh not found or not executable."
  exit 1
fi

exec "./make_200_commits.sh" "$@"


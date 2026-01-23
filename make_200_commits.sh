#!/usr/bin/env bash

# make_200_commits.sh
# - Commits current working tree changes (file-by-file)
# - Pads up to the target commit count using tools/commit-markers.md (tracked)
#
# Usage:
#   chmod +x make_200_commits.sh
#   ./make_200_commits.sh [target_commits]
#
# Examples:
#   ./make_200_commits.sh
#   ./make_200_commits.sh 100
#   ./make_200_commits.sh 200
#   ./make_200_commits.sh 300

set -u
cd "$(dirname "$0")" || exit 1

TARGET_COMMITS="${1:-100}"
if ! [[ "$TARGET_COMMITS" =~ ^[0-9]+$ ]] || (( TARGET_COMMITS < 1 )); then
  TARGET_COMMITS=100
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a git repository."
  exit 1
fi

if ! git diff --cached --quiet >/dev/null 2>&1; then
  echo "Index has staged changes. Please run 'git restore --staged .' first."
  exit 1
fi

MARKER_FILE="tools/commit-markers.md"

print_status_count() {
  local count
  count="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
  echo "Found $count paths to commit."
}

echo "Starting commits (commit all changes first, then pad to $TARGET_COMMITS)..."
print_status_count

commit_from_status_line() {
  local status_line="$1"
  local status="${status_line:0:2}"
  local path="${status_line:3}"
  local message_path="$path"

  case "$status" in
    UU|AA|DD|AU|UD|UA|DU)
      echo "Merge conflict detected at: $path"
      return 2
      ;;
  esac

  if [[ "$path" == *" -> "* ]]; then
    local old_path="${path%% -> *}"
    local new_path="${path##* -> }"
    message_path="$new_path"
    git add -A -- "$old_path" "$new_path" >/dev/null 2>&1 || true
  else
    git add -A -- "$path" >/dev/null 2>&1 || true
  fi

  if git diff --cached --quiet >/dev/null 2>&1; then
    return 1
  fi

  local scope="repo"
  case "$message_path" in
    contracts/contracts/*) scope="contracts" ;;
    contracts/tests/*) scope="contracts-tests" ;;
    frontend/src/components/*) scope="components" ;;
    frontend/src/utils/*) scope="utils" ;;
    frontend/src/services/*) scope="services" ;;
    frontend/*) scope="frontend" ;;
  esac

  if git commit --no-gpg-sign --no-verify -m "chore(${scope}): update ${message_path}" >/dev/null 2>&1; then
    echo "  committed: $message_path"
    return 0
  fi

  return 1
}

commit_snapshot_remaining() {
  git add -A >/dev/null 2>&1 || true
  if git diff --cached --quiet >/dev/null 2>&1; then
    return 1
  fi
  git commit --no-gpg-sign --no-verify -m "chore(repo): snapshot remaining changes" >/dev/null 2>&1
}

ensure_marker_file() {
  if [[ ! -f "$MARKER_FILE" ]]; then
    mkdir -p "$(dirname "$MARKER_FILE")"
    cat >"$MARKER_FILE" <<'EOF'
# Commit markers

This file is used by the commit-generator scripts to create harmless padding commits without modifying production code.
EOF
    git add -A -- "$MARKER_FILE" >/dev/null 2>&1 || true
    git commit --no-gpg-sign --no-verify -m "chore(repo): add commit marker file" >/dev/null 2>&1 || true
  fi
}

append_marker_line() {
  local label="$1"
  mkdir -p "$(dirname "$MARKER_FILE")"
  printf '\n- %s (%s)\n' "$label" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" >>"$MARKER_FILE"
}

made=0
while :; do
  if (( made >= TARGET_COMMITS )); then
    break
  fi

  status_line="$(git status --porcelain 2>/dev/null | head -n 1)"
  [[ -z "$status_line" ]] && break

  commit_from_status_line "$status_line"
  result=$?
  if (( result == 0 )); then
    made=$((made + 1))
  elif (( result == 2 )); then
    exit 1
  else
    if commit_snapshot_remaining; then
      echo "  committed: remaining changes"
      made=$((made + 1))
    else
      break
    fi
  fi

  if (( made > 0 && made % 25 == 0 )); then
    echo "  Completed ${made} commits..."
  fi
done

if (( made >= TARGET_COMMITS )); then
  if git status --porcelain 2>/dev/null | grep -q .; then
    echo "Reached target ($TARGET_COMMITS). Leaving remaining changes uncommitted."
    print_status_count
  fi
fi

remaining=$((TARGET_COMMITS - made))
if (( remaining > 0 )); then
  echo "Padding $remaining commits using $MARKER_FILE..."
  ensure_marker_file

  for ((n = 1; n <= remaining; n++)); do
    append_marker_line "padding marker ${n}/${remaining}"
    git add -A -- "$MARKER_FILE" >/dev/null 2>&1 || true

    if git commit --no-gpg-sign --no-verify -m "chore(padding): marker ${n}/${remaining}" >/dev/null 2>&1; then
      made=$((made + 1))
    fi

    if (( made > 0 && made % 25 == 0 )); then
      echo "  Completed ${made}/${TARGET_COMMITS} commits..."
    fi
  done
fi

echo ""
echo "=========================================="
echo "DONE. Created: $made commits"
echo "=========================================="
echo ""
echo "Run 'git log --oneline -${TARGET_COMMITS}' to see the newest commits"

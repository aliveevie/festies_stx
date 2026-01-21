#!/usr/bin/env bash

# Professional Commits Generator for Festies STX
# - Commits current working tree changes (file-by-file)
# - Pads remaining commits with safe marker commits
#
# Run with:
#   chmod +x make_200_commits.sh
#   ./make_200_commits.sh [target_commits]
#
# Example (300 commits):
#   ./make_200_commits.sh 300

cd "$(dirname "$0")" || exit 1

TARGET_COMMITS="${1:-200}"
if ! [[ "$TARGET_COMMITS" =~ ^[0-9]+$ ]] || (( TARGET_COMMITS < 1 )); then
  TARGET_COMMITS=200
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a git repository."
  exit 1
fi

echo "Starting $TARGET_COMMITS commits (consumes git status first, then pads)..."

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
    contracts/*) scope="contracts" ;;
    frontend/*) scope="frontend" ;;
  esac

  if git commit --no-gpg-sign --no-verify -m "chore(${scope}): update ${message_path}" >/dev/null 2>&1; then
    echo "  committed: $message_path"
    return 0
  fi

  return 1
}

append_padding_marker() {
  local file="$1"
  local n="$2"
  local total="$3"

  case "$file" in
    *.clar) printf '\n;; Commit padding marker %s/%s\n' "$n" "$total" >>"$file" ;;
    *.md) printf '\n<!-- Commit padding marker %s/%s -->\n' "$n" "$total" >>"$file" ;;
    *.sh|*.txt) printf '\n# Commit padding marker %s/%s\n' "$n" "$total" >>"$file" ;;
    *) printf '\n// Commit padding marker %s/%s\n' "$n" "$total" >>"$file" ;;
  esac
}

made=0
while (( made < TARGET_COMMITS )); do
  status_line="$(git status --porcelain 2>/dev/null | head -n 1)"
  [[ -z "$status_line" ]] && break

  if commit_from_status_line "$status_line"; then
    made=$((made + 1))
  else
    git add -A >/dev/null 2>&1 || true
    if git diff --cached --quiet >/dev/null 2>&1; then
      break
    fi
    if git commit --no-gpg-sign --no-verify -m "chore(repo): snapshot remaining changes" >/dev/null 2>&1; then
      echo "  committed: remaining changes"
      made=$((made + 1))
    else
      break
    fi
  fi

  if (( made % 25 == 0 )); then
    echo "  Completed ${made}/${TARGET_COMMITS} commits..."
  fi
done

remaining=$((TARGET_COMMITS - made))
if (( remaining > 0 )); then
  echo "Padding $remaining commits with safe markers..."

  MARKER_FILE=".commit-markers.txt"
  touch "$MARKER_FILE"

  SAFE_FILES=(
    "$MARKER_FILE"
    "frontend/src/App.jsx"
    "frontend/src/components/Header.jsx"
    "frontend/src/components/GreetingCard.jsx"
    "frontend/src/utils/environment.js"
    "frontend/src/utils/blockchain.js"
    "contracts/contracts/festies.clar"
    "contracts/contracts/quest-system.clar"
    "README.md"
  )

  for ((n = 1; n <= remaining; n++)); do
    file="${SAFE_FILES[$(( (n - 1) % ${#SAFE_FILES[@]} ))]}"
    if [[ ! -f "$file" ]]; then
      file="$MARKER_FILE"
    fi

    append_padding_marker "$file" "$n" "$remaining"
    git add -A -- "$file" >/dev/null 2>&1 || true

    if git commit --no-gpg-sign --no-verify -m "chore(padding): marker ${n}/${remaining}" >/dev/null 2>&1; then
      made=$((made + 1))
    fi

    if (( made % 25 == 0 )); then
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

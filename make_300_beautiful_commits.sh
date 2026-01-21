#!/bin/zsh

# Beautiful 300 Commits Generator for Festies STX
# - Commits current working tree changes file-by-file (best effort)
# - Pads remaining commits with safe comment markers
#
# Run with: chmod +x make_300_beautiful_commits.sh && ./make_300_beautiful_commits.sh [target_commits]

cd "$(dirname "$0")"

TARGET_COMMITS="${1:-300}"
if [[ -z "$TARGET_COMMITS" || "$TARGET_COMMITS" -lt 1 ]]; then
  TARGET_COMMITS=300
fi

start_count="$(git rev-list --count HEAD 2>/dev/null)"
echo "Starting up to $TARGET_COMMITS beautiful commits..."

commit_number=0

commit_one_path() {
  local status_line="$1"
  local path="${status_line:3}"
  local message_path="$path"

  if [[ "$path" == *" -> "* ]]; then
    local old_path="${path%% -> *}"
    local new_path="${path##* -> }"
    message_path="$new_path"
    git add -A -- "$old_path" "$new_path" 2>/dev/null
  else
    git add -A -- "$path" 2>/dev/null
  fi

  if git diff --cached --quiet 2>/dev/null; then
    return 1
  fi

  git commit -m "chore(repo): commit ${message_path}" 2>/dev/null || true
  return 0
}

while [[ "$commit_number" -lt "$TARGET_COMMITS" ]]; do
  status_line="$(git status --porcelain 2>/dev/null | head -n 1)"

  if [[ -z "$status_line" ]]; then
    break
  fi

  if ! commit_one_path "$status_line"; then
    git add -A 2>/dev/null
    if git diff --cached --quiet 2>/dev/null; then
      break
    fi
    git commit -m "chore(repo): commit remaining changes" 2>/dev/null || true
  fi

  commit_number=$((commit_number + 1))
  if (( commit_number % 25 == 0 )); then
    echo "  Completed ${commit_number}/${TARGET_COMMITS} commits..."
  fi
done

end_count="$(git rev-list --count HEAD 2>/dev/null)"
if [[ -n "$start_count" && -n "$end_count" ]]; then
  created_count=$((end_count - start_count))
else
  created_count=0
fi

if [[ "$created_count" -lt "$TARGET_COMMITS" ]]; then
  remaining=$((TARGET_COMMITS - created_count))
  echo "Padding $remaining commits with safe markers..."

  SAFE_FILES=(
    "frontend/src/App.jsx"
    "frontend/src/components/Header.jsx"
    "frontend/src/components/GreetingCard.jsx"
    "frontend/src/utils/environment.js"
    "frontend/src/utils/blockchain.js"
    "contracts/contracts/festies.clar"
    "contracts/contracts/quest-system.clar"
  )

  for n in $(seq 1 "$remaining"); do
    idx=$(( (n - 1) % ${#SAFE_FILES[@]} + 1 ))
    file="${SAFE_FILES[$idx]}"

    [[ -f "$file" ]] || continue

    case "$file" in
      *.clar) echo ";; Beautiful padding marker ${n}/${remaining}" >> "$file" ;;
      *.md) echo "<!-- Beautiful padding marker ${n}/${remaining} -->" >> "$file" ;;
      *) echo "// Beautiful padding marker ${n}/${remaining}" >> "$file" ;;
    esac

    git add -A -- "$file" 2>/dev/null
    git commit -m "chore(padding): marker ${n}/${remaining}" 2>/dev/null || true
  done
fi

echo ""
echo "=========================================="
echo "DONE. Target: $TARGET_COMMITS commits"
echo "=========================================="
echo ""
echo "Run 'git log --oneline -$TARGET_COMMITS' to see the newest commits"


#!/usr/bin/env bash

# Runs `npm audit fix` (never --force, so no breaking upgrades). When the
# min-release-age cooldown in .npmrc holds back a fix, npm names the packages
# in a warning. Turn that into the exact command to take the fix early.

yellow='\033[0;33m'
NC='\033[0m'

output_file=$(mktemp)
trap 'rm -f "$output_file"' EXIT

npm audit fix "$@" 2>&1 | tee "$output_file"
exit_status=${PIPESTATUS[0]}

# npm: "N package(s) left at a vulnerable version because a fix is newer than
# the release-age cutoff: a, b."
blocked=$(grep -o 'release-age cutoff: .*' "$output_file" | head -1 | sed 's/^release-age cutoff: //; s/\.$//')
if [ -n "$blocked" ]; then
  echo ""
  echo -e "${yellow}The 7 day cooldown held back these fixes. Review each advisory, then to take the fix now run:${NC}"
  IFS=',' read -r -a packages <<< "$blocked"
  for package in "${packages[@]}"; do
    echo "  ./npm.sh audit fix --min-release-age-exclude=${package// /}"
  done
fi

exit "$exit_status"

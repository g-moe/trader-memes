#!/usr/bin/env bash

set -euo pipefail

require_corepack() {
	if ! command -v corepack >/dev/null 2>&1; then
		echo "corepack is not available in this Node installation."
		echo "Install Corepack, then retry setup."
		exit 1
	fi
}

activate_corepack() {
	local repo_root=${1:-$(pwd)}
	local required_package_manager
	required_package_manager="$(awk -F'"' '/"packageManager"[[:space:]]*:/ { print $4; exit }' "$repo_root/package.json")"

	if [ -z "$required_package_manager" ]; then
		echo "Could not read packageManager from package.json."
		exit 1
	fi

	if [[ "$required_package_manager" != pnpm@* ]]; then
		echo "Expected packageManager to begin with pnpm@."
		echo "Found: $required_package_manager"
		exit 1
	fi

	require_corepack

	corepack enable
	corepack install --global "$required_package_manager"
}

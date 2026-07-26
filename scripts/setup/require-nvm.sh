#!/usr/bin/env bash

set -euo pipefail

require_nvm() {
	local repo_root=${1:-$(pwd)}

	if [ ! -f "$repo_root/.nvmrc" ]; then
		echo "Missing .nvmrc. Cannot determine required Node version."
		exit 1
	fi

	local required_node_version
	required_node_version="$(tr -d '[:space:]' < "$repo_root/.nvmrc")"

	if [ -z "$required_node_version" ]; then
		echo "Could not read Node version from .nvmrc."
		exit 1
	fi

	local nvm_found=false

	if [ -n "${NVM_DIR:-}" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
		. "$NVM_DIR/nvm.sh"
		nvm_found=true
	fi

	if [ "$nvm_found" = false ] && [ -s "$HOME/.nvm/nvm.sh" ]; then
		. "$HOME/.nvm/nvm.sh"
		if command -v nvm >/dev/null 2>&1; then
			nvm_found=true
		fi
	fi

	if [ "$nvm_found" = false ]; then
		echo "nvm is required for local setup but was not found."
		echo "Install nvm and rerun this script:"
		echo "  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash"
		echo "  source ~/.nvm/nvm.sh"
		exit 1
	fi

	local current_node_version
	current_node_version="$(node -p 'process.versions.node')"
	if [ "$current_node_version" != "$required_node_version" ]; then
		echo "The current shell is not using the required Node version."
		echo "Current: $current_node_version, Required: $required_node_version"
		echo "Run 'nvm install' and 'nvm use' in this shell, then retry setup."
		exit 1
	fi

	echo "Using Node $current_node_version"
}

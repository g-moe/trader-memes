import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const REQUIRED_SCRIPTS = ['build', 'coverage', 'test', 'typecheck'];
const ALLOWED_TEST_SUFFIXES = [
	'.e2e.test.ts',
	'.integration.test.ts',
	'.jsdom.test.ts',
	'.node.test.ts'
];
const IGNORED_DIRECTORIES = new Set([
	'.git',
	'.playwright',
	'.tmp',
	'coverage',
	'dist',
	'node_modules',
	'playwright-report',
	'test-results'
]);
const TEST_FILE_PATTERN = /\.(?:spec|test)\.[cm]?[jt]sx?$/;
const WORKSPACE_ROOTS = ['apps', 'packages'];

const getFiles = (directory) =>
	readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = join(directory, entry.name);

		if (entry.isDirectory()) {
			return IGNORED_DIRECTORIES.has(entry.name) ? [] : getFiles(entryPath);
		}

		return entry.isFile() ? [entryPath] : [];
	});

const getWorkspaceManifests = () =>
	WORKSPACE_ROOTS.flatMap((workspaceRoot) =>
		readdirSync(workspaceRoot, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => join(workspaceRoot, entry.name, 'package.json'))
			.filter(existsSync)
	);

const getMissingScripts = (manifestPath) => {
	const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
	const scripts = manifest.scripts ?? {};

	return REQUIRED_SCRIPTS.filter((script) => !scripts[script]);
};

const workspaceFailures = getWorkspaceManifests().flatMap((manifestPath) => {
	const missingScripts = getMissingScripts(manifestPath);

	return missingScripts.length === 0
		? []
		: [`${manifestPath}: missing required scripts: ${missingScripts.join(', ')}`];
});

const testFileFailures = getFiles('.').flatMap((filePath) => {
	if (!TEST_FILE_PATTERN.test(filePath)) {
		return [];
	}

	return ALLOWED_TEST_SUFFIXES.some((suffix) => filePath.endsWith(suffix))
		? []
		: [`${filePath}: test file must end in ${ALLOWED_TEST_SUFFIXES.join(', ')}`];
});

const failures = [...workspaceFailures, ...testFileFailures];

if (failures.length > 0) {
	throw new Error(`Repository validation failed:\n${failures.join('\n')}`);
}

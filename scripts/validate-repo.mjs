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
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const hasOnlyProperties = (value, allowedProperties) =>
	Object.keys(value).every((property) => allowedProperties.includes(property));

const isRecordItem = (value) =>
	isObject(value) &&
	hasOnlyProperties(value, ['note', 'topic']) &&
	typeof value.note === 'string' &&
	value.note.length >= 5 &&
	typeof value.topic === 'string' &&
	value.topic.length >= 3;

const hasValidRecordHeader = (record) =>
	Number.isInteger(record.version) &&
	record.version >= 1 &&
	typeof record.updated === 'string' &&
	DATE_PATTERN.test(record.updated);

const validateAdrs = (record) =>
	isObject(record) &&
	hasOnlyProperties(record, ['$schema', 'decisions', 'technicalDebt', 'updated', 'version']) &&
	hasValidRecordHeader(record) &&
	Array.isArray(record.decisions) &&
	record.decisions.every(isRecordItem) &&
	Array.isArray(record.technicalDebt) &&
	record.technicalDebt.every(isRecordItem);

const validateChanges = (record) =>
	isObject(record) &&
	hasOnlyProperties(record, ['$schema', 'entries', 'updated', 'version']) &&
	hasValidRecordHeader(record) &&
	isObject(record.entries) &&
	Object.entries(record.entries).every(
		([branch, changes]) =>
			branch.length > 0 &&
			Array.isArray(changes) &&
			changes.length > 0 &&
			new Set(changes).size === changes.length &&
			changes.every((change) => typeof change === 'string' && change.length >= 5)
	);

const getRecordFailure = (recordPath, validator) => {
	const record = JSON.parse(readFileSync(recordPath, 'utf8'));

	return validator(record) ? [] : [`${recordPath}: does not match its repository schema`];
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

const recordFailures = [
	...getRecordFailure('repo-adrs.json', validateAdrs),
	...getRecordFailure('repo-changes.json', validateChanges)
];
const failures = [...workspaceFailures, ...testFileFailures, ...recordFailures];

if (failures.length > 0) {
	throw new Error(`Repository validation failed:\n${failures.join('\n')}`);
}

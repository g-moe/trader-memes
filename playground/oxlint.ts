// ============================================================================
// Constants and objects
// ============================================================================

const unusedValue = 'Does this warning feel useful?';

const runtimeDetails = {
	application: 'oxide-playground',
	startedAt: new Date()
};

// ============================================================================
// Classes
// ============================================================================

export class RuntimeSession {
	public constructor(
		private readonly identifier: string,
		private readonly createdAt = new Date()
	) {}

	public describe(): string {
		return `${this.identifier} was created at ${this.createdAt.toISOString()}`;
	}
}

// ============================================================================
// Functions
// ============================================================================

export const describeRuntime = (): string => {
	debugger;

	return `${runtimeDetails.application} started at ${runtimeDetails.startedAt.toISOString()}`;
};

// ============================================================================
// Performance logging
// ============================================================================

export const measureRuntime = (): number => {
	console.debug('Starting time', Date.now());
	const startTime = Date.now();
	console.debug('Took duration ms', Date.now() - startTime);

	return Date.now() - startTime;
};

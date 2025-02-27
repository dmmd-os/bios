// Defines event emitter class
/** Internal handler for events emitter */
export class EventEmitter {
	// Declares fields
	/** Event listeners */
	readonly listeners: { [ event: string ]: ((...parameters: unknown[]) => (Promise<void> | void))[] };

	// Constructs event emitter
	constructor() {
		// Initializes fields
		this.listeners = {};
	}

	/** Emits an event sequentially */
	async bubble(event: string, ...parameters: unknown[]): Promise<void> {
		// Handles empty event
		if(!(event in this.listeners)) return;

		// Evokes listeners
		const listeners = this.listeners[event];
		for(let i = 0; i < listeners.length; i++) await listeners[i](...parameters);
	}

	/** Emits an event */
	async emit(event: string, ...parameters: unknown[]): Promise<void> {
		// Handles empty event
		if(!(event in this.listeners)) return;

		// Evokes listeners
		const listeners = this.listeners[event];
		const tasks: (Promise<void> | void)[] = [];
		for(let i = 0; i < listeners.length; i++) tasks.push(listeners[i](...parameters));

		// Awaits listener
		await Promise.allSettled(tasks);
	}

	/** Removes all same-reference listeners */
	off(event: string, listener: (...parameters: unknown[]) => (Promise<void> | void)): void {
		// Handles empty event
		if(!(event in this.listeners)) return;

		// Removes listeners
		const listeners = this.listeners[event];
		for(let i = listeners.length; i >= 0; i--) {
			if(listeners[i] === listener) listeners.splice(i, 1);
		}

		// Deletes empty event
		if(listeners.length === 0) delete this.listeners[event];
	}

	/** Appends an listener */
	on(event: string, listener: (...parameters: unknown[]) => (Promise<void> | void)): void {
		// Creates new event
		if(!(event in this.listeners)) this.listeners[event] = [];
		
		// Appends listener
		this.listeners[event].push(listener);
	}

	/** Appends an one-time listener */
	once(event: string, listener: (...parameters: unknown[]) => (Promise<void> | void)): void {
		// Defines wrapper
		const wrapper = () => {
			listener();
			this.off(event, wrapper);
		};

		// Appends listener
		this.on(event, wrapper);
	}
}

// Exports
export default EventEmitter;

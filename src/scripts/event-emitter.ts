// Defines event emitter class
/** Non-blocking event emitter */
export class EventEmitter {
	// Declares fields
	private _listeners: { [ event: string ]: ((...parameters: unknown[]) => (Promise<void> | void))[] };

	// Constructs event emitter
	constructor() {
		// Initializes fields
		this._listeners = {};
	}

	/** Emits an event in sequence */
	async bubble(event: string, ...parameters: unknown[]): Promise<void> {
		// Handles empty event
		if(!(event in this._listeners)) return;

		// Evokes listeners
		const listeners = this._listeners[event];
		for(let i = 0; i < listeners.length; i++) await listeners[i](...parameters);
	}

	/** Emit an event in parallel */
	async broadcast(event: string, ...parameters: unknown[]): Promise<void> {
		// Handles empty event
		if(!(event in this._listeners)) return;

		// Evokes listeners
		const listeners = this._listeners[event];
		const tasks: (Promise<void> | void)[] = [];
		for(let i = 0; i < listeners.length; i++) tasks.push(listeners[i](...parameters));

		// Awaits listener
		await Promise.allSettled(tasks);
	}

	/** Emit an event without awaiting for completion */
	emit(event: string, ...parameters: unknown[]): void {
		// Handles empty event
		if(!(event in this._listeners)) return;

		// Evokes listeners
		const listeners = this._listeners[event];
		for(let i = 0; i < listeners.length; i++) listeners[i](...parameters);
	}

	/** Removes all same-reference listeners */
	off(event: string, listener: (...parameters: unknown[]) => (Promise<void> | void)): void {
		// Handles empty event
		if(!(event in this._listeners)) return;

		// Removes listeners
		const listeners = this._listeners[event];
		for(let i = listeners.length; i >= 0; i--) {
			if(listeners[i] === listener) listeners.splice(i, 1);
		}

		// Deletes empty event
		if(listeners.length === 0) delete this._listeners[event];
	}

	/** Appends an listener */
	on(event: string, listener: (...parameters: unknown[]) => (Promise<void> | void)): void {
		// Creates new event
		if(!(event in this._listeners)) this._listeners[event] = [];
		
		// Appends listener
		this._listeners[event].push(listener);
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

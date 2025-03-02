// Defines event emitter class
/** Non-blocking event emitter */
export class EventEmitter {
	// Declares fields
	private _listeners: Map<
		string,
		((...parameters: any[]) => (Promise<void> | void))[]
	>;

	// Constructs class
	constructor() {
		// Initializes fields
		this._listeners = new Map();
	}

	/** Emits an event in sequence */
	async bubble(event: string, ...parameters: any[]): Promise<void> {
		// Handles empty event
		const listeners = this._listeners.get(event);
		if(typeof listeners === "undefined") return;

		// Evokes listeners
		for(let i = 0; i < listeners.length; i++) await listeners[i](...parameters);
	}

	/** Emit an event in parallel */
	async broadcast(event: string, ...parameters: any[]): Promise<void> {
		// Handles empty event
		const listeners = this._listeners.get(event);
		if(typeof listeners === "undefined") return;

		// Evokes listeners
		const tasks: (Promise<void> | void)[] = [];
		for(let i = 0; i < listeners.length; i++) tasks.push(listeners[i](...parameters));

		// Awaits listener
		await Promise.allSettled(tasks);
	}

	/** Emit an event without awaiting for completion */
	emit(event: string, ...parameters: any[]): void {
		// Handles empty event
		const listeners = this._listeners.get(event);
		if(typeof listeners === "undefined") return;

		// Evokes listeners
		for(let i = 0; i < listeners.length; i++) listeners[i](...parameters);
	}

	/** Removes all same-reference listeners */
	off(
		event: string,
		listener: (...parameters: any[]) => (Promise<void> | void)
	): void {
		// Handles empty event
		const listeners = this._listeners.get(event);
		if(typeof listeners === "undefined") return;

		// Removes listeners
		for(let i = listeners.length; i >= 0; i--) {
			if(listeners[i] === listener) listeners.splice(i, 1);
		}

		// Deletes empty event
		if(listeners.length === 0) this._listeners.delete(event);
	}

	/** Appends an listener */
	on(
		event: string,
		listener: (...parameters: any[]) => (Promise<void> | void)
	): void {
		// Creates new event
		if(!this._listeners.has(event)) this._listeners.set(event, []);
		
		// Appends listener
		this._listeners.get(event)!.push(listener);
	}

	/** Appends an one-time listener */
	once(
		event: string,
		listener: (...parameters: any[]) => (Promise<void> | void)
	): void {
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

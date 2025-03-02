// Defines event emitter class
/** Non-blocking event emitter */
export class EventEmitter<TypeListeners extends Record<string, (...parameters: any[]) => any>> {
	// Declares fields
	private _listeners: Map<
		keyof TypeListeners,
		TypeListeners[keyof TypeListeners][]
	>;

	// Constructs class
	constructor() {
		// Initializes fields
		this._listeners = new Map();
	}

	/** Emits an event in sequence */
	async bubble<TypeEvent extends keyof TypeListeners>(
		event: TypeEvent,
		...parameters: Parameters<TypeListeners[TypeEvent]>
	): Promise<void> {
		// Handles empty event
		const listeners = this._listeners.get(event);
		if(typeof listeners === "undefined") return;

		// Evokes listeners
		for(let i = 0; i < listeners.length; i++) await listeners[i](...parameters);
	}

	/** Emit an event in parallel */
	async broadcast<TypeEvent extends keyof TypeListeners>(
		event: TypeEvent,
		...parameters: Parameters<TypeListeners[TypeEvent]>
	): Promise<void> {
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
	emit<TypeEvent extends keyof TypeListeners>(
		event: TypeEvent,
		...parameters: Parameters<TypeListeners[TypeEvent]>
	): void {
		// Handles empty event
		const listeners = this._listeners.get(event);
		if(typeof listeners === "undefined") return;

		// Evokes listeners
		for(let i = 0; i < listeners.length; i++) listeners[i](...parameters);
	}

	/** Removes all same-reference listeners */
	off<TypeEvent extends keyof TypeListeners>(
		event: TypeEvent,
		listener: TypeListeners[TypeEvent]
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
	on<TypeEvent extends keyof TypeListeners>(
		event: TypeEvent,
		listener: TypeListeners[TypeEvent]
	): void {
		// Creates new event
		if(!this._listeners.has(event)) this._listeners.set(event, []);
		
		// Appends listener
		this._listeners.get(event)!.push(listener);
	}

	/** Appends an one-time listener */
	once<TypeEvent extends keyof TypeListeners>(
		event: TypeEvent,
		listener: TypeListeners[TypeEvent]
	): void {
		// Defines wrapper
		const wrapper = ((...parameters: Parameters<TypeListeners[keyof TypeListeners]>) => {
			listener(...parameters);
			this.off(event, wrapper);
		}) as TypeListeners[keyof TypeListeners];

		// Appends listener
		this.on(event, wrapper);
	}
}

// Exports
export default EventEmitter;

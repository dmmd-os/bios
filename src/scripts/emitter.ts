// Defines emitter types
/** Emitter listener callback */
export type EmitterListener = (...parameters: any[]) => any;
/** Emitter table */
export type EmitterTable = Record<string, EmitterListener>;

// Defines emitter class
/** Event emitter */
export class Emitter<TypeTable extends EmitterTable> {
	// Declares fields
	private _listeners: Map<
		keyof TypeTable,
		TypeTable[keyof TypeTable][]
	>;

	// Constructs class
	constructor() {
		// Initializes fields
		this._listeners = new Map();
	}

	/** Emits an event sequentially */
	async bubble<TypeEvent extends keyof TypeTable>(
		event: TypeEvent,
		...parameters: Parameters<TypeTable[TypeEvent]>
	): Promise<void> {
		// Handles empty event
		const listeners = this._listeners.get(event);
		if(typeof listeners === "undefined") return;

		// Evokes listeners
		for(let i = 0; i < listeners.length; i++) await listeners[i](...parameters);
	}

	/** Emits a blocking event */
	async broadcast<TypeEvent extends keyof TypeTable>(
		event: TypeEvent,
		...parameters: Parameters<TypeTable[TypeEvent]>
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

	/** Emits a non-blocking event */
	emit<TypeEvent extends keyof TypeTable>(
		event: TypeEvent,
		...parameters: Parameters<TypeTable[TypeEvent]>
	): void {
		// Handles empty event
		const listeners = this._listeners.get(event);
		if(typeof listeners === "undefined") return;

		// Evokes listeners
		for(let i = 0; i < listeners.length; i++) listeners[i](...parameters);
	}

	/** Removes all same-reference listeners */
	off<TypeEvent extends keyof TypeTable>(
		event: TypeEvent,
		listener: TypeTable[TypeEvent]
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
	on<TypeEvent extends keyof TypeTable>(
		event: TypeEvent,
		listener: TypeTable[TypeEvent]
	): void {
		// Creates new event
		if(!this._listeners.has(event)) this._listeners.set(event, []);
		
		// Appends listener
		this._listeners.get(event)!.push(listener);
	}

	/** Appends an one-time listener */
	once<TypeEvent extends keyof TypeTable>(
		event: TypeEvent,
		listener: TypeTable[TypeEvent]
	): void {
		// Defines wrapper
		const wrapper = ((...parameters: Parameters<TypeTable[keyof TypeTable]>) => {
			listener(...parameters);
			this.off(event, wrapper);
		}) as TypeTable[keyof TypeTable];

		// Appends listener
		this.on(event, wrapper);
	}
}

// Exports
export default Emitter;

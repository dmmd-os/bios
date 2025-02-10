// Defines image events
export class ImageEvents {
	// Declares fields
	readonly listeners: { [ event: string ]: ((...parameters: unknown[]) => void)[] };

	// Constructs image events
	constructor() {
		// Initializes fields
		this.listeners = {};
	}

	// Emits an event
	emit(event: string, ...parameters: unknown[]): void {
		// Blocks empty event
		if(!(event in this.listeners)) return;

		// Evokes listeners
		const listeners = this.listeners[event];
		for(let i = 0; i < listeners.length; i++) listeners[i](...parameters);
	}

	// Removes all same-reference listeners
	off(event: string, listener: (...parameters: unknown[]) => void): void {
		// Blocks empty event
		if(!(event in this.listeners)) return;

		// Removes listeners
		const listeners = this.listeners[event];
		for(let i = listeners.length; i >= 0; i--) {
			if(listeners[i] === listener) listeners.splice(i, 1);
		}

		// Deletes empty event
		if(listeners.length === 0) delete this.listeners[event];
	}

	// Appends an listener
	on(event: string, listener: (...parameters: unknown[]) => void): void {
		// Creates new event
		if(!(event in this.listeners)) this.listeners[event] = [];
		
		// Appends listener
		this.listeners[event].push(listener);
	}

	// Appends an one-time listener
	once(event: string, listener: (...parameters: unknown[]) => void): void {
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
export default ImageEvents;

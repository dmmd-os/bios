// Imports

// Defines image database
export class ImageDatabase {
	// Defines fields
	readonly events: { [name: string]: ((...parameters: any[]) => void)[] } = {};
	readonly name: string;
	readonly request: IDBOpenDBRequest;
	readonly version: number;

	// Constructs image database
	constructor(name: string, version: number) {
		// Initializes fields
		this.name = name;
		this.request = globalThis.indexedDB.open(this.name, this.version);
		this.version = version;

		// Emits events
		this.request.onblocked = (event) => this.emit("blocked", event);
		this.request.onerror = (event) => this.emit("error", event);
		this.request.onsuccess = (event) => this.emit("success", event);
		this.request.onupgradeneeded = (event) => this.emit("upgradeneeded", event);
	}
	
	// Emits event
	emit(name: "blocked" | "error" | "success" | "upgradeneeded", event: Event): void;
	emit(name: string, ...parameters: any[]): void;
	emit(name: string, ...parameters: any[]): void {
		// Triggers event listeners
		if(!(name in this.events)) return;
		const events = this.events[name];
		for(let i = 0; i < events.length; i++) events[i](...parameters);
	}
	
	// Removes event listener
	off(name: "blocked" | "error" | "success" | "upgradeneeded", callback: (event: Event) => void): void;
	off(name: string, callback: (...parameters: any[]) => void): void;
	off(name: string, callback: (...parameters: any[]) => void): void {
		// Removes event listener
		if(!(name in this.events)) return;
		const events = this.events[name];
		for(let i = 0; i < events.length; i++) {
			if(events[i] === callback) events.splice(i, 1);
		}
		if(events.length === 0) delete events[name];
	}
	
	// Adds event listener
	on(name: "blocked" | "error" | "success" | "upgradeneeded", callback: (event: Event) => void): void;
	on(name: string, callback: (...parameters: any[]) => void): void;
	on(name: string, callback: (...parameters: any[]) => void): void {
		// Adds event listner
		if(!(name in this.events)) this.events[name] = [];
		this.events[name].push(callback);
	}
}

// Exports
export default ImageDatabase;

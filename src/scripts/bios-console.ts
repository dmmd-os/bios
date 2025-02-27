// Imports
import ArraySet from "./array-set";
import EventEmitter from "./event-emitter";

// Defines bios stdin class
export class BiosStdin {
	// Declares fields
	private _anchor: number;
	private _buffer: string;
	private _chrono: number;
	private _cursor: number;
	private _history: ArraySet<string>;
	readonly emitter: EventEmitter;

	// Constructs bios stdin
	constructor() {
		this._anchor = 0;
		this._buffer = "";
		this._chrono = 0;
		this._cursor = 0;
		this._history = new ArraySet();
		this.emitter = new EventEmitter();
	}

	get anchor() {
		return this._anchor;
	}

	get buffer() {
		return this._buffer;
	}

	get chrono() {
		return this._chrono;
	}

	clear(): void {
		this.travel(this._history.size());
	}

	get cursor() {
		return this._cursor;
	}

	move(cursor: number, shift: boolean = false): void {
		// Updates cursor and anchor
		this.range(cursor, shift ? this._anchor : cursor);
	}

	range(cursor: number, anchor: number = cursor): void {
		// Updates cursor and anchor
		const cachedCursor = this._cursor;
		const cachedAnchor = this._anchor;
		this._cursor = Math.min(Math.max(cursor, 0), this._buffer.length);
		this._anchor = Math.min(Math.max(anchor, 0), this._buffer.length);
		
		// Emits events
		if(cachedCursor != this._cursor) this.emitter.emit("cursorUpdate");
		if(cachedAnchor != this._anchor) this.emitter.emit("anchorUpdate");
	}

	travel(chrono: number): void {
		// Updates chrono
		const cachedChrono = this._chrono;
		this._chrono = Math.min(Math.max(chrono, 0), this._history.size());

		// Handles new chrono
		if(cachedChrono != this._chrono) {
			// Updates buffer
			this.clear();
			this.write(this._history.read(this._chrono) ?? "");

			// Emits event
			this.emitter.emit("chronoUpdate");
		}
	}

	write(buffer: string): void {
		
	}
}

// Defines bios stdout class
export class BiosStdout {

}

// Defines bios console class
/** Console interface for simulated BIOS */
export class BiosConsole {
	// Declares fields
	/** Internal event emitter */
	readonly emitter: EventEmitter;
	/** Standard input system */
	readonly stdin: BiosStdin;
	/** Standard output system */
	readonly stdout: BiosStdout;

	// Constructs bios console
	constructor() {
		// Initializes fields
		this.emitter = new EventEmitter();
		this.history = new ArraySet();
		this.stdin = new BiosStdin();
		this.stdout = new BiosStdout();
	}

	async copy(): Promise<void> {

	}

	async input(content: unknown): void {
		
	}

	async output(content: unknown): Promise<void> {

	}

	async paste(): Promise<void> {

	}
}

// Exports
export default BiosConsole;

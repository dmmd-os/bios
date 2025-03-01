// Imports
import ArraySet from "./array-set";
import EventEmitter from "./event-emitter";

// Defines bios stdin class
/** Standard input system for BIOS console */
export class BiosStdin {
	// Declares fields
	private _anchor: number;
	private _buffer: string;
	private _chrono: number;
	private _cursor: number;
	private _history: ArraySet<string>;
	/** Internal event emitter */
	readonly emitter: EventEmitter;

	// Constructs class
	constructor() {
		// Initializes fields
		this._anchor = 0;
		this._buffer = "";
		this._chrono = 0;
		this._cursor = 0;
		this._history = new ArraySet();
		this.emitter = new EventEmitter();
	}

	/** Anchor position */
	get anchor() {
		// Returns anchor
		return this._anchor;
	}

	private set anchor(anchor: number) {
		// Updates anchor
		const cache = this._anchor;
		this._anchor = Math.min(Math.max(anchor, 0), this._buffer.length);

		// Emits event
		if(cache != this._anchor) this.emitter.emit("updateAnchor");
	}

	// Buffer content
	get buffer() {
		// Returns buffer
		return this._buffer;
	}
	
	private set buffer(buffer: string) {
		// Updates buffer
		const cache = this._buffer;
		this._buffer = buffer;

		// Emits event
		if(cache != this._buffer) this.emitter.emit("updateBuffer");
	}

	/** Chrono index */
	get chrono() {
		// Returns chrono
		return this._chrono;
	}

	private set chrono(chrono: number) {
		// Updates chrono
		const cache = this._chrono;
		this._chrono = Math.min(Math.max(chrono, 0), this._history.size);

		// Emits event
		if(cache != this._chrono) this.emitter.emit("updateChrono");
	}

	/** Clears standard input system */
	clear(): void {
		// Updates buffer
		this.write("", "replace");
	}

	/** Cursor position */
	get cursor() {
		// Returns cursor
		return this._cursor;
	}

	private set cursor(cursor: number) {
		// Updates cursor
		const cache = this._cursor;
		this._cursor = Math.min(Math.max(cursor, 0), this._buffer.length);

		// Emits event
		if(cache != this._cursor) this.emitter.emit("updateCursor");
	}

	/** Moves cursor to specified position */
	move(cursor: number, shift: boolean = false): void {
		// Updates cursor
		this.cursor = cursor;

		// Updates anchor
		if(!shift) this.anchor = cursor;
	}

	/** Moves cursor and anchor to specified range */
	range(cursor: number, anchor: number = cursor): void {
		// Updates cursor
		this.cursor = cursor;

		// Updates anchor
		this.anchor = anchor;
	}

	/** Reads from standard input system */
	read(): string | null {
		// Finds index
		const index = this._buffer.indexOf("\n");
		if(index === -1) return null;

		// Initializes read
		const line = this._buffer.slice(0, index + 1);
		const rest = this._buffer.slice(index + 1);

		// Reads buffer
		this._history.write(line, true);
		this.buffer = rest;
		this.chrono = this._history.size;
		this.move(this._cursor - line.length);

		// Returns line
		return line;
	}

	/** Moves chrono to specified index */
	travel(chrono: number): void {
		// Updates chrono
		const cache = this._chrono;
		this.chrono = chrono;

		// Updates buffer
		if(cache != this._chrono) this.write(this._history.read(this._chrono) ?? "", "update");
	}

	/** Writes to standard input system */
	write(
		buffer: string,
		mode: "insert" | "overtype" | "replace" | "update" = "insert"
	): void {
		// Initializes buffer
		const front = Math.min(this._cursor, this._anchor);
		const back = Math.max(this._cursor, this._anchor);

		// Writes buffer
		switch(mode) {
			case "insert": {
				const before = this._buffer.slice(0, front);
				const after = this._buffer.slice(back);
				const index = buffer.indexOf("\n");
				this.buffer = index === -1 ?
					before + buffer + after :
					before + buffer.slice(0, index + 1) + after + buffer.slice(index + 1);
				this.chrono = this._history.size;
				this.move(front + buffer.length);
				break;
			}
			case "overtype": {
				const before = this._buffer.slice(0, front);
				const after = this._buffer.slice(Math.max(back, buffer.length));
				const index = buffer.indexOf("\n");
				this.buffer = index === -1 ?
					before + buffer + after :
					before + buffer.slice(0, index + 1) + after + buffer.slice(index + 1);
				this.chrono = this._history.size;
				this.move(front + buffer.length);
				break;
			}
			case "replace": {
				this.buffer = buffer;
				this.chrono = this._history.size;
				this.move(buffer.length);
				break;
			}
			case "update": {
				this._buffer = buffer;
				this.move(buffer.length);
				break;
			}
		}

		// Handles new lines
		let line: string | null = this.read();
		while(line !== null) this.emitter.emit("line", line);
	}
}

// Defines bios stdout class
/** Standard output system for BIOS console */
export class BiosStdout {
	// Declares fields
	private _buffer: string;
	// Internal event emitter
	readonly emitter: EventEmitter;
	
	// Constructs class
	constructor() {
		// Initializes fields
		this._buffer = "";
		this.emitter = new EventEmitter();
	}

	get buffer() {
		return this._buffer;
	}

	private set buffer(buffer: string) {
		const cached = this._buffer;
		this._buffer = buffer;
		if(cached != this._buffer) this.emitter.emit("updateBuffer");
	}

	clear(): void {
		this.write("", "replace");
	}

	read(): string | null {
		const index = this._buffer.indexOf("\n");
		if(index === -1) return null;

		const line = this._buffer.slice(0, index + 1);
		const rest = this._buffer.slice(index + 1);
	}

	write(
		buffer: string,
		mode: "append" | "replace" = "append"
	): void {
		
	}
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

	// Constructs class
	constructor() {
		// Initializes fields
		this.emitter = new EventEmitter();
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

// Imports
import ArraySet from "./array-set";
import EventEmitter from "./event-emitter";

// Defines bios stdin class
/** Standard input system for bios console */
export class BiosStdin {
	// Declares fields
	private _anchor: number;
	private _buffer: string;
	private _chrono: number;
	private _cursor: number;
	private _history: ArraySet<string>;
	/** Event emitter */
	readonly emitter: EventEmitter<{
		feedLine: (line: string) => void,
		updateAnchor: () => void,
		updateBuffer: () => void,
		updateChrono: () => void,
		updateCursor: () => void
	}>;

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
		// Writes buffer
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

	/** Removes content in specified direction and length */
	delete(length: number): void {
		// Updates cursor
		if(this._anchor === this._cursor) this.cursor += length;
		
		// Updates buffer
		this.write("");
	}

	/** History of past inputs */
	get history(): readonly string[] {
		// Returns history array
		return this._history.array;
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
		const front = this._cursor;
		const line = this._buffer.slice(0, index);
		const rest = this._buffer.slice(index + 1);

		// Remembers line
		if(line.trim().length !== 0) this._history.write(line, true);
		
		// Reads buffer
		this.buffer = rest;
		this.chrono = this._history.size;
		this.cursor = front - line.length - 1;
		this.anchor = front - line.length - 1;

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
				const index = buffer.indexOf("\n");
				const line = index === -1 ? buffer : buffer.slice(0, index);
				const rest = index === -1 ? "" : buffer.slice(index);
				const before = this._buffer.slice(0, front);
				const after = this._buffer.slice(back);
				this.buffer = before + line + after + rest;
				this.chrono = this._history.size;
				this.cursor = front + line.length;
				this.anchor = front + line.length;
				break;
			}
			case "overtype": {
				const index = buffer.indexOf("\n");
				const line = index === -1 ? buffer : buffer.slice(0, index);
				const rest = index === -1 ? "" : buffer.slice(index);
				const before = this._buffer.slice(0, front);
				const after = this._buffer.slice(Math.max(back, front + line.length));
				this.buffer = before + line + after + rest;
				this.chrono = this._history.size;
				this.cursor = front + line.length;
				this.anchor = front + line.length;
				break;
			}
			case "replace": {
				this.buffer = buffer;
				this.chrono = this._history.size;
				this.cursor = buffer.length;
				this.anchor = buffer.length;
				break;
			}
			case "update": {
				this.buffer = buffer;
				this.cursor = buffer.length;
				this.anchor = buffer.length;
				break;
			}
		}

		// Handles new lines
		let line: string | null = this.read();
		while(line !== null) {
			this.emitter.emit("feedLine", line);
			line = this.read();
		}
	}
}

// Defines bios stdout class
/** Standard output system for bios console */
export class BiosStdout {
	// Declares fields
	private _buffer: string;
	// Event emitter
	readonly emitter: EventEmitter<{
		updateBuffer: () => void
	}>;
	
	// Constructs class
	constructor() {
		// Initializes fields
		this._buffer = "";
		this.emitter = new EventEmitter();
	}

	/** Buffer content */
	get buffer() {
		// Returns buffer
		return this._buffer;
	}

	private set buffer(buffer: string) {
		// Updates buffer
		const cached = this._buffer;
		this._buffer = buffer;

		// Emits event
		if(cached != this._buffer) this.emitter.emit("updateBuffer");
	}

	/** Clears standard output system */
	clear(): void {
		// Writes buffer
		this.write("", "replace");
	}

	/** Writes to standard output system */
	write(
		buffer: string,
		mode: "append" | "replace" = "append"
	): void {
		// Updates
		switch(mode) {
			case "append": {
				this.buffer += buffer;
				break;
			}
			case "replace": {
				this.buffer = buffer;
				break;
			}
		}
	}
}

// Defines bios console class
/** Console interface for bios */
export class BiosConsole {
	// Declares fields
	private _arrow: string;
	private _mode: "insert" | "overtype";
	/** Event emitter */
	readonly emitter: EventEmitter<{
		feedLine: (line: string) => void,
		updateArrow: () => void,
		updateMode: () => void,
		updateStdin: () => void,
		updateStdout: () => void
	}>;
	/** Standard input system */
	readonly stdin: BiosStdin;
	/** Standard output system */
	readonly stdout: BiosStdout;

	// Constructs class
	constructor() {
		// Initializes fields
		this._arrow = "> ";
		this._mode = "insert";
		this.emitter = new EventEmitter();
		this.stdin = new BiosStdin();
		this.stdout = new BiosStdout();

		// Handles standard input system events
		const emitUpdateStdin = () => this.emitter.emit("updateStdin");
		this.stdin.emitter.on("feedLine", (line: string) => this.emitter.emit("feedLine", line));
		this.stdin.emitter.on("updateAnchor", emitUpdateStdin);
		this.stdin.emitter.on("updateBuffer", emitUpdateStdin);
		this.stdin.emitter.on("updateChrono", emitUpdateStdin);
		this.stdin.emitter.on("updateCursor", emitUpdateStdin);
		this.emitter.on("updateArrow", emitUpdateStdin);
		this.emitter.on("updateMode", emitUpdateStdin);
		
		// Handles standard output system events
		const emitUpdateStdout = () => this.emitter.emit("updateStdout");
		this.stdout.emitter.on("updateBuffer", emitUpdateStdout);
	}

	/** Anchor position */
	get anchor() {
		// Returns anchor
		return this.stdin.anchor;
	}

	/** Input arrow */
	get arrow() {
		// Returns arrow
		return this._arrow;
	}

	set arrow(arrow: string) {
		// Updates arrow
		const cache = this._arrow;
		this._arrow = BiosConsole.purify(arrow);

		// Emits event
		if(cache !== this._arrow) this.emitter.emit("updateArrow");
	}
	
	/** Buffer content */
	get buffer() {
		// Returns buffer
		return this.stdin.buffer;
	}

	/** Chrono index */
	get chrono() {
		// Returns chrono
		return this.stdin.chrono;
	}

	/** Clears console */
	clear(): void {
		// Clears content
		this.stdout.clear();	
	}

	/** Cursor position */
	get cursor() {
		// Returns cursor
		return this.stdin.cursor;
	}
	
	/** Copies selection to clipboard */
	async copy(): Promise<void> {
		// Copies selection
		const selection = document.getSelection();
		await navigator.clipboard.writeText(selection === null ? this.stdin.buffer : selection.toString());
	}

	/** Removes content in specified direction and length */
	delete(length: number): void {
		// Removes content
		this.stdin.delete(length);
	}

	/** Enters content to standard input system */
	enter(content: unknown): void {
		// Writes content
		this.input(BiosConsole.purify(content), this._mode);
	}

	/** Resets standard input system */
	escape(): void {
		// Clears
		this.stdin.clear();
	}

	/** History of past inputs */
	get history() {
		// Returns history array
		return this.stdin.history;
	}

	/** Writes raw content to standard input system */
	input(
		content: string,
		mode: "insert" | "overtype" | "replace" | "update" = "insert"
	): void {
		// Writes content
		this.stdin.write(content, mode);
	}

	/** Insertion mode */
	get mode() {
		// Returns mode
		return this._mode;
	}

	set mode(mode: "insert" | "overtype") {
		// Updates mode
		const cache = this._mode;
		this._mode = mode;

		// Emits event
		if(cache !== this._mode) this.emitter.emit("updateMode");
	}

	/** Moves cursor to specified position */
	move(cursor: number, shift: boolean = false): void {
		// Moves cursor
		this.stdin.move(cursor, shift);
	}

	/** Writes raw content to standard output system */
	output(
		content: string,
		mode: "append" | "replace" = "append"
	): void {
		// Writes content
		this.stdout.write(content, mode);
	}

	/** Pastes selection to standard input system */
	async paste(): Promise<void> {
		// Writes content
		this.enter(await navigator.clipboard.readText());
	}

	/** Purifies content into displayable characters */
	static purify(content: unknown): string {
		// Returns purified content
		return String(content).replace(/[^\na-zA-Z0-9()[\]{}<>'"`!?@#$%^&~_+\-*/=\\|;:,. ]/g, "");
	}

	/** Prints content to standard output system */
	print(content: unknown = "", end: string = "\n") {
		// Writes content
		this.output(BiosConsole.purify(String(content) + end));
	}

	/** Moves cursor and anchor to specified range */
	range(cursor: number, anchor: number = cursor): void {
		// Moves cursor
		this.stdin.range(cursor, anchor);
	}

	/** Moves chrono to specified index */
	travel(chrono: number): void {
		// Moves chrono
		this.stdin.travel(chrono);
	}
}

// Exports
export default BiosConsole;

// Imports
import ImageCommand from "./image_command";
import ImageStdio from "./image_stdio";

// Defines image terminal
export class ImageTerminal {
	// Declares fields
	private _anchor: number;
	private _chrono: number;
	private _complex: boolean;
	private _cursor: number;
	private _history: Set<string>;
	private _timeline: readonly string[] | null;
	readonly commands: Set<ImageCommand>;
	readonly frame: {
		readonly cursor: HTMLDivElement;
		readonly highlight: HTMLDivElement;
		readonly stdin: HTMLDivElement;
		readonly stdio: HTMLDivElement;
		readonly stdout: HTMLDivElement;
		readonly text: HTMLDivElement;
	};
	readonly stdin: ImageStdio;
	readonly stdout: ImageStdio;

	// Constructs image terminal
	constructor() {
		// Initializes fields
		this._anchor = 0;
		this._chrono = 0;
		this._complex = false;
		this._cursor = 0;
		this._history = new Set();
		this._timeline = [];
		this.commands = new Set();
		this.frame = {
			stdio: document.createElement("div"),
			cursor: document.createElement("div"),
			highlight: document.createElement("div"),
			stdin: document.createElement("div"),
			stdout: document.createElement("div"),
			text: document.createElement("div")
		};
		this.stdin = new ImageStdio();
		this.stdout = new ImageStdio();

		// Initializes frame
		this.frame.cursor.classList.add("image-terminal-cursor");
		this.frame.highlight.classList.add("image-terminal-highlight");
		this.frame.stdin.classList.add("image-terminal-stdin");
		this.frame.stdio.classList.add("image-terminal");
		this.frame.stdout.classList.add("image-terminal-stdout");
		this.frame.text.classList.add("image-terminal-text");	
		this.frame.stdin.appendChild(this.frame.text);
		this.frame.stdin.appendChild(this.frame.highlight);
		this.frame.stdin.appendChild(this.frame.cursor);
		this.frame.stdio.appendChild(this.frame.stdout);
		this.frame.stdio.appendChild(this.frame.stdin);

		// Renders
		this.render();
	}

	// Retrieves anchor
	get anchor() {
		// Returns anchor
		return this._anchor;
	}

	// Modifies anchor
	set anchor(anchor: number) {
		// Updates anchor
		this._anchor = Math.min(Math.max(anchor, 0), this.stdin.buffer.length);
	}

	// Retrieves chrono
	get chrono() {
		// Returns chrono
		return this._chrono;
	}

	// Modifies chrono
	set chrono(chrono: number) {
		// Updates chrono
		const updated = Math.min(Math.max(chrono, 0), this._history.size);
		if(this._chrono === updated) return;
		this._chrono = updated;

		// Updates stdin
		const timeline = this.timeline;
		this.stdin.buffer = this._chrono < timeline.length ? timeline[this._chrono] : "";
		
		// Updates cursor
		this._cursor = this.stdin.buffer.length;
		this._anchor = this._cursor;
	}

	// Retrieves complex status
	get complex() {
		// Returns complex status
		return this._complex;
	}

	// Modifies complex status
	set complex(complex: boolean) {
		// Updates complex status
		this._complex = complex;

		// Resets stdin
		this.escape();
	}

	// Copies selection to user clipboard
	async copy(): Promise<void> {
		// Copies selection
		const selection = document.getSelection();
		await navigator.clipboard.writeText(selection === null ? this.stdin.buffer : selection.toString());
	}

	// Retrieves cursor
	get cursor() {
		// Returns cursor
		return this._cursor;
	}

	// Modifies cursor
	set cursor(cursor: number) {
		// Updates cursor
		this._cursor = Math.min(Math.max(cursor, 0), this.stdin.buffer.length);
	}

	// Resets stdin
	escape(): void {
		// Updates stdin
		this.stdin.clear();

		// Updates cursor
		this._cursor = 0;
		this._anchor = this._cursor;

		// Updates chrono
		this._chrono = this._history.size;

		// Renders
		this.render();
	}

	// Enters content into stdin
	async enter(content: string): Promise<void> {
		// Purifies content
		const purified = ImageStdio.purify(content);

		// Puts each character into stdin
		for(let i = 0; i < purified.length; i++) await this._put(purified[i]);
		if(purified.length === 0) await this._put("");
		
		// Renders
		this.render();
	}

	// Executes command
	// @incomplete
	async execute(content: string): Promise<void> {
	}

	// Handles key press
	async key(key: KeyboardEvent): Promise<void> {
		// Handles alt or meta keys
		if(key.altKey || key.metaKey) return;

		// Handles escape key
		if(key.key === "Escape") this.escape();

		// Handles backspace keys
		else if(key.key === "Backspace" || key.key === "Delete") {
			if(this._anchor === this._cursor) this.moveCursor(this._cursor + key.key === "Backspace" ? -1 : 1, true);
			await this.enter("");
		}

		// Handles enter key
		else if(key.key === "Enter") {
			this._anchor = this._cursor;
			await this.enter("\n");
		}

		// Handles arrow keys
		else if(key.key === "ArrowLeft" || key.key === "ArrowRight") this.moveCursor(this._cursor + key.key === "ArrowLeft" ? -1 : 1, key.shiftKey);
		else if(key.key === "ArrowUp" || key.key === "ArrowDown") this.moveChrono(this._chrono + key.key === "ArrowUp" ? -1 : 1);

		// Handles control keys
		else if(key.ctrlKey) {
			if(key.key === "a" || key.key === "A") this.rangeCursor(this.stdin.buffer.length);
			else if(key.key === "C") await this.copy();
			else if(key.key === "V") await this.paste();
		}

		// Handles key
		else if(key.key.length === 1) await this.enter(key.key);
	}
	
	// Moves anchor
	moveAnchor(anchor: number): void {
		// Updates anchor
		this.anchor = anchor;

		// Renders
		this.render();
	}
	
	// Moves chrono
	moveChrono(chrono: number): void {
		// Updates chrono
		this.chrono = chrono;

		// Renders
		this.render();
	}

	// Moves cursor
	moveCursor(cursor: number, shift: boolean = false): void {
		// Updates cursor
		this.cursor = cursor;
		if(!shift) this._anchor = this._cursor;
		
		// Renders
		this.render();
	}

	// Pastes content from user clipboard
	async paste(): Promise<void> {
		// Enters content
		this.enter(await navigator.clipboard.readText());
	}

	// Prints content to stdout
	print(content: unknown, end: string = "\n"): void {
		// Updates stdout
		this.stdout.write(String(content) + end);

		// Renders
		this.render();
	}

	// Puts a character into stdin
	// @incomplete
	private async _put(character: string): Promise<void> {
		// Updates stdin
		this.stdin.write(character, this._cursor, this._anchor);

		// Updates cursor
		this._cursor = Math.min(this._cursor, this._anchor) + character.length;
		this._anchor = this._cursor;

		// Checks for incomplete pairs
		let complete = true;
		if(this._complex) {
			// TODO: CHECK FOR INCOMPLETE PAIRS
		}
		
		// Handles new lines
		if(character === "\n" && complete) {
			this.print(this.stdin.buffer);
			this.escape();
		}
	}

	// Creates a range
	rangeCursor(cursor: number, anchor: number = 0): void {
		// Updates cursor
		this.cursor = cursor;
		this.anchor = anchor;

		// Renders
		this.render();
	}

	// Renders frame
	render(): void {
		// Updates frame
		const filler = this.stdin.buffer.replace(/[^\n]/g, " ");
		const base = Math.min(this._cursor, this._anchor);
		const range = Math.abs(this._cursor - this._anchor);
		this.frame.cursor.innerText = "  " + filler.slice(0, this._cursor) + "_";
		this.frame.highlight.innerText = "  " + filler.slice(0, base);
		this.frame.highlight.setAttribute("data-highlight", filler.slice(base, base + range));
		this.frame.text.innerText = "> " + this.stdin.buffer;
		this.frame.stdout.innerText = this.stdout.buffer;
	}

	// Retrieves timeline
	get timeline() {
		// Caches timeline
		if(this._timeline === null) this._timeline = Array.from(this._history);
		
		// Returns timeline
		return this._timeline;
	}
}

// Exports
export default ImageTerminal;

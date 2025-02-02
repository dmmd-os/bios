// Imports
// @ts-ignore
import "../styles/image_terminal.css";

// Defines type
export type ImageTerminalCommand = {
	command: string;
	flags: { [ flag: string ]: string; };
	parameters: string[];
};

// Defines image terminal
export class ImageTerminal {
	// Defines fields
	private _anchor: number;
	private _chrono: number;
	private _cursor: number;
	private _field: HTMLDivElement;
	private _highlight: HTMLDivElement;
	private _history: Set<string>;
	private _input: string;
	// @ts-ignore
	private _states: Map<string, any>;
	private _tasks: Set<Promise<any>>;
	private _textbox: HTMLDivElement;
	private _timeline: string[] | null;
	readonly frame: HTMLDivElement;

	// Constructs terminal
	constructor() {
		// Initializes fields
		this._anchor = 0;
		this._chrono = 0;
		this._cursor = 0;
		this._field = document.createElement("div");
		this._highlight = document.createElement("div");
		this._history = new Set();
		this._input = "";
		this._states = new Map();
		this._tasks = new Set();
		this._textbox = document.createElement("div");
		this._timeline = [];
		this.frame = document.createElement("div");

		// Initializes highlight
		this._highlight.classList.add("highlight");
		
		// Initializes textbox
		this._textbox.classList.add("textbox");
		
		// Initializes field
		this._field.classList.add("field");
		this._field.appendChild(this._highlight);
		this._field.appendChild(this._textbox);

		// Initializes frame
		this.frame.classList.add("terminal");
		this.frame.appendChild(this._field);

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
		const updated = Math.min(Math.max(anchor, 0), this._input.length);
		if(this._anchor === updated) return;
		this._anchor = updated;

		// Renders
		this.render();
		this.bump();
	}

	// Bumps terminal to bottom
	bump() {
		// Updates scroll
		this.frame.scrollTop = this.frame.scrollHeight;
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

		// Synchronizes timeline
		if(this._timeline === null) this._timeline = Array.from(this._history);

		// Updates input
		this._input = this._chrono < this._timeline.length ? this._timeline[this._chrono] : "";

		// Updates indexes
		this._cursor = this._input.length;
		this._anchor = this._cursor;

		// Renders
		this.render();
		this.bump();
	}

	// Clears terminal
	clear(): void {
		// Removes all logs
		this.frame.replaceChildren(this._field);

		// Renders
		this.bump();
	}

	// Retrieves cursor
	get cursor() {
		// Returns cursor
		return this._cursor;
	}

	// Modifies cursor
	set cursor(cursor: number) {
		// Updates cursor
		const updated = Math.min(Math.max(cursor, 0), this._input.length);
		if(this._cursor === updated) return;
		this._cursor = updated;

		// Renders
		this.render();
		this.bump();
	}

	// Handles keypress
	async key(key: KeyboardEvent): Promise<void> {
		// Guards against meta and alt keys
		if(key.metaKey || key.altKey) return;
		key.preventDefault();

		// Defines utility keys
		if(key.key === "Enter") this.insert("\n");
		else if(key.key === "Backspace" || key.key === "Delete") {
			if(this.anchor === this.cursor) this.cursor += key.key === "Backspace" ? -1 : 1;
			this.insert("");
		}
		else if(key.key === "Escape") this.write("");

		// Defines ctrl keys
		else if(key.ctrlKey && (key.key === "a" || key.key === "A")) {
			this.anchor = 0;
			this.cursor = this.input.length;
		}
		else if(key.ctrlKey && key.key === "C") {
			const selection = document.getSelection();
			if(selection === null) return;
			await navigator.clipboard.writeText(selection.toString());
		}
		else if(key.ctrlKey && key.key === "V") this.insert(await navigator.clipboard.readText());

		// Defines arrow keys
		else if(key.key === "ArrowLeft" || key.key === "ArrowRight") {
			this.cursor += key.key === "ArrowLeft" ? -1 : 1;
			if(!key.shiftKey) this.anchor = this.cursor;
		}
		else if(key.key === "ArrowUp" || key.key === "ArrowDown") this.chrono += key.key === "ArrowUp" ? -1 : 1;

		// Defines input keys
		else if(key.key.length === 1) this.insert(key.key);
	}

	// Retrieves input
	get input() {
		// Returns input
		return this._input;
	}

	// Inserts input
	insert(insertion: string): void {
		// Splits insertion
		const split = insertion.indexOf("\n");
		const before = this._input.slice(0, Math.min(this._anchor, this._cursor));
		const inserted = split === -1 ? insertion : insertion.slice(0, split);
		const after = this._input.slice(Math.max(this._anchor, this._cursor));
		const appended = split === -1 ? "" : insertion.slice(split);

		// Writes insertion
		this.write(before + inserted + after + appended, before.length + inserted.length);
	}

	// Parses command
	// @ts-ignore
	static parse(input: string): ImageTerminalCommand {
		return {
			command: "",
			flags: {},
			parameters: []
		}
	}

	// Prints content to terminal
	print(content: any): void {
		// Initializes log
		const log = document.createElement("div");
		log.classList.add("log");
		log.innerText = String(content);
		
		// Renders
		this.frame.insertBefore(log, this._field);
		this.bump();
	}

	// Renders terminal
	render(): void {
		this._textbox.innerText = "> " + (this.anchor === this.cursor ? this.input.slice(0, this.cursor) + "|" + this.input.slice(this.cursor) :
			this.input.slice(0, Math.min(this.anchor, this.cursor)) + "[" + this.input.slice(Math.min(this.anchor, this.cursor), Math.max(this.anchor, this.cursor)) + "]" + this.input.slice(Math.max(this.anchor, this.cursor)));
		// console.log(this);
	}

	// Runs command
	// @ts-ignore
	run(command: ImageTerminalCommand): Promise<void> {
		const task = (async () => {})();
		this._tasks.add(task);
		task.then(() => this._tasks.delete(task));
		return task;
	}

	// Writes input
	write(input: string, position: number = this._input.length): void {
		// Updates input
		const updated = input.replace(/[^\na-zA-Z0-9()[\]{}<>'"`!?@#$%^&~_+\-*/=\\|;:,. ]/g, "");
		if(this._input === updated) return;
		const lines = updated.split("\n");
		this._input = lines[0];

		// Updates indexes
		this._chrono = this._history.size;
		this._cursor = position;
		this._anchor = this._cursor;
		
		// Handles multi-lined input
		for(let i = 1; i < lines.length; i++) {
			// Prints input
			this.print("> " + this._input);

			// Updates history
			this._history.delete(this._input);
			this._history.add(this._input);
			this._timeline = null;
			
			// Runs command
			this.run(ImageTerminal.parse(this._input));

			// Updates input
			this._input = lines[i];

			// Updates indexes
			this._chrono = this._history.size;
			this._cursor = this._input.length;
			this._anchor = this._cursor;
		}
		
		// Renders
		this.render();
		this.bump();
	}
}

// Exports
export default ImageTerminal;

// Imports
// @ts-ignore
import "../styles/image_terminal.css";

// Defines image terminal command
export type ImageTerminalCommand = {
	command: string;
	flags: { [ flag: string ]: string[]; };
	parameters: string[];
	parts: string[];
};

// Defines image terminal error
export class ImageTerminalError extends Error {}

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
	private _pause: boolean;
	private _tasks: Set<Promise<void>>;
	private _textbox: HTMLDivElement;
	private _timeline: string[] | null;
	private _underline: HTMLDivElement;
	readonly commands: Map<string, (command: ImageTerminalCommand) => Promise<void>>;
	readonly frame: HTMLDivElement;
	readonly version: string;
	key: (key: KeyboardEvent) => Promise<void>;

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
		this._pause = false;
		this._tasks = new Set();
		this._textbox = document.createElement("div");
		this._timeline = [];
		this._underline = document.createElement("div");
		this.commands = new Map();
		this.frame = document.createElement("div");
		this.key = this.listener;
		this.version = "1.0.0";

		// Initializes commands
		const commands: { alias: string[], executable: (command: ImageTerminalCommand) => Promise<void> }[] = [
			// Clears terminal
			{
				alias: [ "clear", "cls" ],
				executable: async () => {
					this.clear();
				}
			},

			// Displays help menu
			{
				alias: [ "cmds", "commands", "h", "help" ],
				executable: async () => {
					this.print("Available commands:");
					const keys = Array.from(this.commands.keys());
					this.print(keys.join(", "));
					this.print("\nFor more instructions, please reference documentation at [insert url]");
				}
			},

			// Prints content to terminal
			{
				alias: [ "echo", "print" ],
				executable: async (command) => {
					this.print(command.parameters.join(" "));
				}
			},

			// Reloads window
			{
				alias: [ "r", "reboot" ],
				executable: async () => {
					location.reload();
				}
			},

			// Prints version
			{
				alias: [ "v", "version" ],
				executable: async () => {
					this.print(this.version);
				}
			}
		];
		for(let i = 0; i < commands.length; i++) {
			for(let j = 0; j < commands[i].alias.length; j++) this.commands.set(commands[i].alias[j], commands[i].executable);
		}

		// Initializes highlight
		this._highlight.classList.add("highlight");

		// Initializes underline
		this._underline.classList.add("underline");
		
		// Initializes textbox
		this._textbox.classList.add("textbox");
		
		// Initializes field
		this._field.classList.add("field");
		this._field.appendChild(this._highlight);
		this._field.appendChild(this._underline);
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
		this._anchor = Math.min(Math.max(anchor, 0), this._input.length);

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
		this._chrono = Math.min(Math.max(chrono, 0), this._history.size);

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
		this._cursor = Math.min(Math.max(cursor, 0), this._input.length);

		// Renders
		this.render();
		this.bump();
	}

	// Retrieves input
	get input() {
		// Returns input
		return this._input;
	}

	// Inserts input at cursor selection
	async insert(insertion: string): Promise<void> {
		// Splits insertion
		const split = insertion.indexOf("\n");
		const before = this.input.slice(0, Math.min(this.anchor, this.cursor));
		const inserted = split === -1 ? insertion : insertion.slice(0, split);
		const after = this.input.slice(Math.max(this.anchor, this.cursor));
		const appended = split === -1 ? "" : insertion.slice(split);

		// Writes insertion
		await this.write(before + inserted + after + appended, before.length + inserted.length);
	}

	// Handles keypress
	async listener(key: KeyboardEvent): Promise<void> {
		// Defines guards
		if(this.pause) return;
		if(key.metaKey || key.altKey) return;

		// Defines utility keys
		if(key.key === "Enter") await this.write(this.input + "\n");
		else if(key.key === "Backspace" || key.key === "Delete") {
			if(this.anchor === this.cursor) this.cursor += key.key === "Backspace" ? -1 : 1;
			await this.insert("");
		}
		else if(key.key === "Escape") await this.write("");

		// Defines control keys
		else if(key.ctrlKey && (key.key === "a" || key.key === "A")) {
			this.anchor = 0;
			this.cursor = this.input.length;
		}
		else if(key.ctrlKey && key.key === "C") {
			const selection = document.getSelection();
			if(selection === null) return;
			await navigator.clipboard.writeText(selection.toString());
		}
		else if(key.ctrlKey && key.key === "V") await this.insert(await navigator.clipboard.readText());

		// Defines arrow keys
		else if(key.key === "ArrowLeft" || key.key === "ArrowRight") {
			this.cursor += key.key === "ArrowLeft" ? -1 : 1;
			if(!key.shiftKey) this.anchor = this.cursor;
		}
		else if(key.key === "ArrowUp" || key.key === "ArrowDown") this.chrono += key.key === "ArrowUp" ? -1 : 1;

		// Defines input keys
		else if(key.key.length === 1) await this.insert(key.key);

		// Prevents bubble
		key.preventDefault();
		key.stopImmediatePropagation();
	}

	// Executes command
	static parse(input: string): ImageTerminalCommand {
		// Initializes parser
		const raw = ImageTerminal.purify(input).trimStart();
		const flags: { [ flags: string ]: string[] } = {};
		const parameters: string[] = [];
		const parts: string[] = [];
		let bucket: string[] = parameters;
		let pointer = 0;

		// Parses command
		while(pointer < raw.length) {
			const ahead = raw.slice(pointer);
			
			// Matches spaces
			const matchSpace = ahead.match(/^\s+/);
			if(matchSpace !== null) {
				// Increments
				pointer += matchSpace[0].length;
				continue;
			}
			
			// Matches part
			const matchPart = ahead.match(/^(?:"(?:\\.|[^\\"])*"|(?:\\.|[^\\" ])+)+(?=$|\s)/);
			if(matchPart !== null) {
				// Retrieves part
				const part = matchPart[0].replace(/(?<!\\)"/g, "").replace(/\\(.)/g, "$1");

				// Appends flag
				if(part[0] === "-") {
					if(part in flags) throw new ImageTerminalError("Duplicate flag at " + pointer);
					flags[part] = [];
					bucket = flags[part];
				}
				
				// Appends paramter
				else bucket.push(part);

				// Appends part
				parts.push(part);

				// Increments
				pointer += matchPart[0].length;
				continue;
			}

			// Throws error
			console.log(ahead);
			throw new ImageTerminalError("Invalid syntax at " + pointer);
		}

		// Returns command
		return {
			command: parameters.length === 0 ? "" : parameters[0].toLowerCase(),
			flags: flags,
			parameters: parameters.slice(1),
			parts: parts,
		} satisfies ImageTerminalCommand;
	}

	// Retrieves pause
	get pause() {
		// Returns pause
		return this._pause;
	}

	// Modifies pause
	set pause(pause: boolean) {
		// Updates pause
		if(pause === this._pause) return;
		this._pause = pause;
		
		// Renders
		this._field.style.display = this._pause ? "none" : "block";
	}

	// Prints content to terminal
	print(content: any): void {
		// Prints lines
		const lines = String(content).split("\n");
		for(let i = 0; i < lines.length; i++) {
			const log = document.createElement("div");
			log.classList.add("log");
			log.innerText = lines[i];
			this.frame.insertBefore(log, this._field);
		}
		
		// Renders
		this.bump();
	}

	// Purifies content into displayable characters
	static purify(content: string): string {
		// Returns purified content
		return content.replace(/[^\na-zA-Z0-9()[\]{}<>'"`!?@#$%^&~_+\-*/=\\|;:,. ]/g, "");
	}

	// Renders terminal
	render(): void {

		// Renders highlight
		this._highlight.innerText = " ".repeat(Math.min(this.anchor, this.cursor) + 2);
		this._highlight.setAttribute("data-highlight", " ".repeat(Math.abs(this.anchor - this.cursor)));

		// Renders underline
		this._underline.innerHTML = " ".repeat(this.cursor + 2) + "_";
		
		// Renders textbox
		this._textbox.innerText = "> " + this.input;
	}

	// Runs command
	run(command: ImageTerminalCommand): Promise<void> {
		// Runs task
		if(!this.commands.has(command.command)) throw new ImageTerminalError("Command \"" + command.command + "\" does not exist");
		const task = this.commands.get(command.command)!(command);

		// Tracks task
		this._tasks.add(task);
		task.then(() => this._tasks.delete(task));

		// Returns task
		return task;
	}

	// Writes input
	async write(input: string, position: number = input.length): Promise<void> {
		// Updates input
		const lines = ImageTerminal.purify(input).split("\n");
		this._input = lines[0];

		// Updates indexes
		this._chrono = this._history.size;
		this._cursor = Math.min(Math.max(position, 0), input.length);
		this._anchor = this._cursor;
		
		// Handles multi-lined input
		for(let i = 1; i < lines.length; i++) {
			// Prints input
			this.print("> " + this._input);

			// Analyzes input
			if(this._input.trim().length != 0) {
				// Updates history
				this._history.delete(this._input);
				this._history.add(this._input);
				this._timeline = null;

				// Runs command
				try {
					await this.run(ImageTerminal.parse(this._input));
				}
				catch(error) {
					if(error instanceof ImageTerminalError) this.print(error.message);
					else throw error;
				}
			}

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

// Imports
import ImageStdio from "./image_stdio";

// Defines interface
interface ImageTerminalFrame {
	readonly container: HTMLDivElement;
	readonly overlay: HTMLDivElement;
	readonly stdin: HTMLDivElement;
	readonly stdout: HTMLDivElement;
}

// Defines image console
export class ImageTerminal {
	// Declares fields
	private _anchor: number;
	private _chrono: number;
	private _cursor: number;
	private _history: Set<string>;
	private _timeline: readonly string[] | null;
	readonly frame: ImageTerminalFrame;
	readonly stdin: ImageStdio;
	readonly stdout: ImageStdio;

	// Constructs image console
	constructor() {
		// Initializes fields
		this._anchor = 0;
		this._chrono = 0;
		this._cursor = 0;
		this._history = new Set();
		this._timeline = [];
		this.frame = {
			container: document.createElement("div"),
			overlay: document.createElement("div"),
			stdin: document.createElement("div"),
			stdout: document.createElement("div")
		};
		this.stdin = new ImageStdio();
		this.stdout = new ImageStdio();

		// Initializes frame
		this.frame.container.classList.add("image-terminal");
		this.frame.overlay.classList.add("image-terminal-overlay");
		this.frame.stdin.classList.add("image-terminal-stdin");
		this.frame.stdout.classList.add("image-terminal-stdout");
		this.frame.container.appendChild(this.frame.stdout);
		this.frame.container.appendChild(this.frame.stdin);
		this.frame.container.appendChild(this.frame.overlay);
	}

	get anchor() {
		return this._anchor;
	}

	set anchor(anchor: number) {
		this._anchor = Math.min(Math.max(anchor, 0), this.stdin.buffer.length);
	}

	get chrono() {
		return this._chrono;
	}

	set chrono(chrono: number) {
		this._chrono = Math.min(Math.max(chrono, 0), this._history.size);
		this.stdin.clear();
		const timeline = this.timeline;
		if(this._chrono < this.timeline.length) this.stdin.write(this.timeline[this._chrono]);
	}

	clear(): void {
		this.stdout.clear();
	}

	get cursor() {
		return this._cursor;
	}

	set cursor(cursor: number) {
		this._cursor = Math.min(Math.max(cursor, 0), this.stdin.buffer.length);
	}

	enter(message: unknown): string[] {
		const output: string[] = [ ...this.stdin.readBulk("\n") ];
		const content = String(message);
		const lines = content.split("\n");
		
		this.write(lines[0]);
		for(let i = 1; i < content.length; i++) {
			this.write("\n");
			const line = this.read();
			output.push(line);
			this._cursor = this.stdin.buffer.length;
			this._anchor = this._cursor;
			this.stdin.write(lines[i]);
		}
		return output;
	}

	async key(key: KeyboardEvent): Promise<void> {
		
	}

	read(): string {
		const chunk = this.stdin.read("\n");
		this._cursor = Math.max(this._cursor - chunk.length, 0);
		this._anchor = this._cursor;
		return chunk;
	}

	get timeline() {
		if(this._timeline === null) this._timeline = Array.from(this._history);
		return this._timeline;
	}

	print(content: unknown, end: string = "\n"): void {
		this.stdout.write(String(content) + end);
	}

	render(): void {
		this.frame.stdin.innerHTML = this.stdin.buffer;
		this.frame.stdout.innerText = this.stdout.buffer;
	}

	write(content: unknown): void {
		const chunk = String(content);
		this.stdin.write(chunk, this._cursor, this._anchor);
		this._cursor = Math.min(this._cursor, this._anchor) + chunk.length;
		this._anchor = this._cursor;
	}
}
// Imports
import EventEmitter from "../event-emitter";
import ImageStdio from "./image-stdio";
import ImageStream from "./image-stream";

// Defines image console
/** Internal handler for console interface */
export class ImageConsole {
	// Declares fields
	/** Event listeners */
	readonly events: EventEmitter;
	/** Standard input system */
	readonly stdin: ImageStdio;
	/** Standard output system */
	readonly stdout: ImageStdio;

	// Constructs image console
	constructor() {
		// Initializes fields
		this.events = new EventEmitter();
		this.stdin = new ImageStdio();
		this.stdout = new ImageStdio();
	}

	/** Anchor position */
	get anchor() {
		// Returns anchor
		return this.stdin.anchor;
	}

	set anchor(anchor: number) {
		// Updates anchor
		this.stdin.anchor = anchor;

		// Emits event
		this.events.emit("updateStdin");
		this.events.emit("update");
	}

	/** Internal buffer */
	get buffer() {
		// Returns buffer
		return this.stdin.buffer;
	}
	
	/** Cursor position */
	get cursor() {
		// Returns cursor
		return this.stdin.cursor;
	}
	
	set cursor(cursor: number) {
		// Updates cursor
		this.stdin.cursor = cursor;

		// Emits event
		this.events.emit("updateStdin");
		this.events.emit("update");
	}

	/** Clears stdout */
	clear(): void {
		// Updates stdout
		this.stdout.clear();

		// Emits event
		this.events.emit("updateStdout");
		this.events.emit("update");
	}

	/** Enters content to stdin */
	enter(content: string): void {
		// Enters and handles input
		const chunk = ImageStream.purify(content);
		for(let i = 0; i < chunk.length; i++) {
			const character = chunk[i];
			this.stdin.write(character, false);
			if(character === "\n") {
				const line = this.stdin.read("\n");
				this.print(line, "");
				this.events.emit("line", line);
			}
		}

		// Emits event
		this.events.emit("updateStdin");
		this.events.emit("update");
	}

	/** Moves cursor at specified location */
	move(cursor: number, shift: boolean = false) {
		// Updates stdin
		this.stdin.move(cursor, shift);

		// Emits event
		this.events.emit("updateStdin");
		this.events.emit("update");
	}
	
	/** Prints content to stdout */
	print(content: unknown, end: string = "\n"): void {
		// Updates stdout
		this.stdout.write(String(content) + end);

		// Emits event
		this.events.emit("updateStdout");
		this.events.emit("update");
	}

	/** Selects a range */
	select(anchor: number, cursor: number) {
		// Updates stdin
		this.stdin.select(anchor, cursor);

		// Emits event
		this.events.emit("updateStdin");
		this.events.emit("update");
	}
}

// Exports
export default ImageConsole;

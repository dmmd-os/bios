import ImageEvents from "./image_events";

// Defines image stdio
export class ImageStdio {
	// Declares fields
	private _buffer: string;
	readonly events: ImageEvents;

	// Constructs image stdio
	constructor() {
		// Initializes fields
		this._buffer = "";
		this.events = new ImageEvents();
	}

	// Retrieves buffer
	get buffer() {
		// Returns buffer
		return this._buffer;
	}

	// Modifies buffer
	set buffer(buffer: string) {
		// Updates buffer
		this._buffer = ImageStdio.purify(buffer);
	}

	// Clears buffer
	clear(): void {
		// Clears buffer
		this._buffer = "";
	}

	// Purifies content into displayable characters
	static purify(content: string): string {
		// Returns purified content
		return content.replace(/[^\na-zA-Z0-9()[\]{}<>'"`!?@#$%^&~_+\-*/=\\|;:,. ]/g, "");
	}

	// Reads and flushes buffer based on delimiter
	read(delimiter: string | null = null): string {
		// Returns full buffer for null delimiter
		if(delimiter === null) {
			const buffer = this._buffer;
			this._buffer = "";
			return buffer;
		}

		// Finds first delimiter
		const index = this._buffer.indexOf(delimiter);
		if(index === -1) return "";

		// Returns chunk
		const chunk = this._buffer.slice(0, index + delimiter.length);
		this._buffer = this._buffer.slice(index + delimiter.length);
		return chunk;
	}

	// Reads and flushes all lines in buffer
	readBulk(delimiter: string, length: number = Infinity): string[] {
		// Initializes lines
		const lines: string[] = [];

		// Reads lines
		for(let i = 0; i < length; i++) {
			let line = this.read(delimiter);
			if(line.length === 0) break;
			lines.push(line);
		}

		// Returns lines
		return lines;
	}

	// Inserts content to buffer at specified location
	write(content: string, cursor: number = this._buffer.length, anchor: number = cursor): void {
		// Initializes buffer
		const before = this._buffer.slice(0, Math.min(cursor, anchor));
		const chunk = ImageStdio.purify(content);
		const after = this._buffer.slice(Math.max(cursor, anchor));

		// Updates buffer
		this._buffer = before + chunk + after;
	}
}

// Exports
export default ImageStdio;

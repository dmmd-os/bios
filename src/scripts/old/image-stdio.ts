// Imports
import ImageStream from "./image-stream";

// Defines image stdio
/** Internal handler for standard input / output system */
export class ImageStdio {
	// Declares fields
	private _anchor: number;
	private _cursor: number;
	private _stream: ImageStream;

	// Constructs image stdio
	constructor() {
		// Initializes fields
		this._anchor = 0;
		this._cursor = 0;
		this._stream = new ImageStream();
	}

	/** Anchor position */
	get anchor() {
		// Returns anchor
		return this._anchor;
	}

	set anchor(anchor: number) {
		// Updates anchor
		this._anchor = Math.min(Math.max(anchor, 0), this._stream.buffer.length);
	}

	/** Internal buffer */
	get buffer() {
		// Returns buffer
		return this._stream.buffer;
	}

	set buffer(buffer: string) {
		// Updates buffer
		this._stream.buffer = buffer;

		// Updates cursor and anchor
		this._cursor = this._stream.buffer.length;
		this._anchor = this._cursor;
	}

	/** Clears buffer */
	clear(): void {
		// Updates buffer
		this._stream.clear();

		// Updates cursor and anchor
		this._cursor = 0;
		this._anchor = 0;
	}

	/** Cursor position */
	get cursor() {
		// Returns cursor
		return this._cursor;
	}

	set cursor(cursor) {
		// Updates cursor
		this._cursor = Math.min(Math.max(cursor, 0), this._stream.buffer.length);
	}

	/** Moves cursor to speicified position */
	move(cursor: number, shift: boolean) {
		// Updates cursor and anchor
		this._cursor = Math.min(Math.max(cursor, 0), this._stream.buffer.length);
		if(!shift) this._anchor = this._cursor;
	}

	/** Overwrites content */
	overwrite(content: string, safe: boolean = true): void {
		// Initializes chunk
		const chunk = safe ? ImageStream.purify(content) : content;

		// Overwrites chunk
		this._stream.overwriteUnsafe(chunk, this._cursor, this._anchor);

		// Updates cursor and anchor
		this._cursor = Math.min(this._cursor, this._anchor) + chunk.length;
		this._anchor = this._cursor;
	}

	/** Reads content */
	read(delimiter: string | null, maximum?: null): string;
	read(delimiter: string | null, maximum: number): string[];
	read(delimiter: string | null, maximum: number | null = null): string | string[] {
		return maximum === null ? this._stream.read(delimiter) : this._stream.readBulk(delimiter, maximum);
	}

	/** Replaces content */
	replace(content: string, safe: boolean = true): void {
		// Initializes chunk
		const chunk = safe ? ImageStream.purify(content) : content;

		// Replaces chunk
		this._stream.replaceUnsafe(chunk);

		// Updates cursor and anchor
		this._cursor = chunk.length;
		this._anchor = this._cursor;
	}

	/** Selects a range */
	select(anchor: number, cursor: number) {
		// Updates cursor and anchor
		this._anchor = Math.min(Math.max(anchor, 0), this._stream.buffer.length);
		this._cursor = Math.min(Math.max(cursor, 0), this._stream.buffer.length);
	}

	/** Writes content */
	write(content: string, safe: boolean = true): void {
		// Initializes chunk
		const chunk = safe ? ImageStream.purify(content) : content;

		// Writes chunk
		this._stream.writeUnsafe(chunk, this._cursor, this._anchor);

		// Updates cursor and anchor
		this._cursor = Math.min(this._cursor, this._anchor) + chunk.length;
		this._anchor = this._cursor;
	}
}

// Exports
export default ImageStdio;

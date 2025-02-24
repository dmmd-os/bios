// Defines image stream
/** Internal handler for string stream */
export class ImageStream {
	// Declares fields
	private _buffer: string;

	// Constructs image stream
	constructor() {
		// Initializes fields
		this._buffer = "";
	}

	/** Internal buffer */
	get buffer() {
		// Returns buffer
		return this._buffer;
	}

	set buffer(buffer: string) {
		// Updates buffer
		this._buffer = ImageStream.purify(buffer);
	}

	/** Clears buffer */
	clear(): void {
		// Clears buffer
		this._buffer = "";
	}

	/** Overwrites buffer at specified position */
	overwrite(content: string, cursor: number, anchor: number = cursor): void { 
		// Updates buffer
		this.overwriteUnsafe(ImageStream.purify(content), cursor, anchor);
	}

	/** Overwrites buffer at specified position without purification */
	overwriteUnsafe(content: string, cursor: number, anchor: number = cursor): void {
		// Initializes buffer
		const before = this._buffer.slice(0, Math.min(cursor, anchor));
		const after = this._buffer.slice(Math.max(cursor, anchor, Math.min(cursor, anchor) + content.length));

		// Updates buffer
		this._buffer = before + content + after;
	}

	/** Purifies content into displayable characters */
	static purify(content: string): string {
		// Returns purified content
		return content.replace(/[^\na-zA-Z0-9()[\]{}<>'"`!?@#$%^&~_+\-*/=\\|;:,. ]/g, "");
	}

	/** Reads and flushes chunk based on delimiter */
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

	/** Reads and flushes multiple chunks in buffer based on delimiter */
	readBulk(delimiter: string | null = null, maximum: number = Infinity): string[] {
		// Initializes chunks
		const chunks: string[] = [];

		// Reads and flushes chunks
		for(let i = 0; i < maximum; i++) {
			const chunk = this.read(delimiter);
			if(chunk.length === 0) break;
			chunks.push(chunk);
		}

		// Returns chunks
		return chunks;
	}
	
	/** Replaces buffer */
	replace(content: string): void {
		// Updates buffer
		this.replaceUnsafe(ImageStream.purify(content));
	}

	/** Replaces buffer without purification */
	replaceUnsafe(content: string): void {
		// Updates buffer
		this._buffer = content;
	}

	/** Writes content to buffer at specified position */
	write(content: string, cursor: number = this._buffer.length, anchor: number = cursor): void {
		// Updates buffer
		this.writeUnsafe(ImageStream.purify(content), cursor, anchor);
	}

	/** Writes content to buffer at specified position without purification */
	writeUnsafe(content: string, cursor: number = this._buffer.length, anchor: number = cursor): void {
		// Initializes buffer
		const before = this._buffer.slice(0, Math.min(cursor, anchor));
		const after = this._buffer.slice(Math.max(cursor, anchor));

		// Updates buffer
		this._buffer = before + content + after;
	}
}

// Exports
export default ImageStream;

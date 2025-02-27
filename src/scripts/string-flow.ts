import Emitter from "./emitter";

export class StringFlow {
	private _buffer: string;
	readonly emitter: Emitter;

	constructor() {
		this._buffer = "";
		this.emitter = new Emitter();
	}

	get buffer() {
		return this._buffer;
	}

	clear(): void {
		this._buffer = "";
	}

	read(delimiter): string {
		
	}

	insert(content: string, index: number = this._buffer.length): void {
		this._buffer = this._buffer.slice(0, index) + content + this._buffer.slice(index + content.length);
		this.emitter.emit("update");
	}
}
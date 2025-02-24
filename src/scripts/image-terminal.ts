// Imports
import ImageConsole from "./image-console";

// Defines image terminal
export class ImageTerminal {
	// Declares fields
	private _cursorOverlay: HTMLDivElement;
	private _highlightOverlay: HTMLDivElement;
	private _stdinFrame: HTMLDivElement;
	private _stdoutFrame: HTMLDivElement;
	private _textOverlay: HTMLDivElement;
	/** Console interface */
	readonly console: ImageConsole;
	/** Display frame */
	readonly frame: HTMLDivElement;

	// Constructs image terminal
	constructor() {
		// Initializes fields
		this._cursorOverlay = document.createElement("div");
		this._highlightOverlay = document.createElement("div");
		this._stdinFrame = document.createElement("div");
		this._stdoutFrame = document.createElement("div");
		this._textOverlay = document.createElement("div");
		this.console = new ImageConsole();
		this.frame = document.createElement("div");

		// Appends class names
		this._cursorOverlay.classList.add("image-terminal-cursor");
		this._highlightOverlay.classList.add("image-terminal-highlight");
		this._stdinFrame.classList.add("image-terminal-stdin");
		this._stdoutFrame.classList.add("image-terminal-stdout");
		this._textOverlay.classList.add("image-terminal-text");	
		this.frame.classList.add("image-terminal");

		// Populates stdin frame
		this._stdinFrame.appendChild(this._textOverlay);
		this._stdinFrame.appendChild(this._highlightOverlay);
		this._stdinFrame.appendChild(this._cursorOverlay);

		// Populates frame
		this.frame.appendChild(this._stdoutFrame);
		this.frame.appendChild(this._stdinFrame);

		// Initializes console
		this.console.events.on("updateForce", () => this.render());
		this.console.events.on("updateStdin", () => this.renderStdin());
		this.console.events.on("updateStdout", () => this.renderStdout());

		// Performs initial render
		this.render();
	}

	/** Renders frame */
	render(): void {
		// Updates frame
		this.renderStdin();
		this.renderStdout();
	}

	/** Renders stdin */
	renderStdin(): void {
		// Initializes render
		const anchor = this.console.anchor;
		const buffer = this.console.stdin.buffer;
		const cursor = this.console.cursor;
		const base = Math.min(cursor, anchor);
		const filler = buffer.replace(/[^\n]/g, " ");
		const range = Math.abs(cursor - anchor);

		// Updates frame
		this._cursorOverlay.innerText = "  " + filler.slice(0, cursor) + "_";
		this._highlightOverlay.innerText = "  " + filler.slice(0, base);
		this._highlightOverlay.setAttribute("data-highlight", filler.slice(base, base + range));
		this._textOverlay.innerText = "> " + buffer;
	}

	/** Renders stdout */
	renderStdout(): void {
		// Updates frame
		this._stdoutFrame.innerText = this.console.stdout.buffer;
	}
}

// Exports
export default ImageTerminal;

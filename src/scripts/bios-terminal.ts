// Imports
import BiosConsole from "./bios-console";

// Defines bios terminal class
/** Console display for BIOS */
export class BiosTerminal {
	// Declares fields
	private _cursorOverlay: HTMLDivElement;
	private _highlightOverlay: HTMLDivElement;
	private _stdinFrame: HTMLDivElement;
	private _stdoutFrame: HTMLDivElement;
	private _textOverlay: HTMLDivElement;
	/** Bios console */
	readonly console: BiosConsole;
	/** Display frame */
	readonly frame: HTMLDivElement;

	// Creates class
	constructor(console: BiosConsole) {
		// Initializes fields
		this._cursorOverlay = document.createElement("div");
		this._highlightOverlay = document.createElement("div");
		this._stdinFrame = document.createElement("div");
		this._stdoutFrame = document.createElement("div");
		this._textOverlay = document.createElement("div");
		this.console = console;
		this.frame = document.createElement("div");

		// Initializes standard input system frame
		this._stdinFrame.classList.add("bios-terminal-stdin");
		this._cursorOverlay.classList.add("bios-terminal-cursor");
		this._stdinFrame.appendChild(this._cursorOverlay);
		this._highlightOverlay.classList.add("bios-terminal-highlight");
		this._stdinFrame.appendChild(this._highlightOverlay);
		this._textOverlay.classList.add("bios-terminal-text");	
		this._stdinFrame.appendChild(this._textOverlay);
		
		// Initializes standard output system frame
		this._stdoutFrame.classList.add("bios-terminal-stdout");
		
		// Initializes display frame
		this.frame.classList.add("bios-terminal");
		this.frame.appendChild(this._stdoutFrame);
		this.frame.appendChild(this._stdinFrame);

		// Binds console
		this.console.emitter.on("updateStdin", () => this.renderStdin());
		this.console.emitter.on("updateStdout", () => this.renderStdout());

		// Performs initial render
		this.render();
	}

	/** Renders frame */
	render(): void {
		// Updates frame
		this.renderStdin();
		this.renderStdout();
	}

	/** Renders standard input system frame */
	renderStdin(): void {
		// Initializes render
		const anchor = this.console.anchor;
		const buffer = this.console.buffer;
		const cursor = this.console.cursor;
		const front = Math.min(cursor, anchor);
		const range = Math.abs(cursor - anchor);

		// Updates frame
		this._cursorOverlay.innerText = this.console.mode === "insert" ? (" ".repeat(cursor + 2) + "_") : "";
		this._highlightOverlay.innerText = " ".repeat(front + 2);
		this._highlightOverlay.setAttribute("data-highlight", " ".repeat(Math.max(range, this.console.mode === "insert" ? 0 : 1)));
		this._textOverlay.innerText = "> " + buffer;
	}

	/** Renders standard output system frame */
	renderStdout(): void {
		// Updates frame
		this._stdoutFrame.innerText = this.console.stdout.buffer;
	}
}

// Exports
export default BiosTerminal;

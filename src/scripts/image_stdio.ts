// @ts-nocheck
// Imports
import ImageEvents from "./image_events";

// Defines image stdio
export class ImageStdio {
	// Declares fields
	private _stdin: string;
	private _stdout: string;
	readonly events: ImageEvents;

	// Constructs image stdio
	constructor() {
		// Initializes fields
		this._stdin = "";
		this._stdout = "";
		this.events = new ImageEvents();
	}
}

// Exports
export default ImageStdio;

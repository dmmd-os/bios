// Imports
import ImageDrive from "../image-drive";
import ImageOs from "./image_os";
import ImageTerminal from "./image_terminal";

// Defines image bios
export class ImageBios {
	// Declares fields
	private _os: ImageOs | null;
	readonly drive: ImageDrive;
	readonly reference: string;
	readonly terminal: ImageTerminal;

	// Constructs image bios
	constructor(reference: string, drive: ImageDrive) {
		// Initializes fields
		this._os = null;
		this.drive = drive;
		this.reference = reference;
		this.terminal = new ImageTerminal();

		// Initializes terminal
		document.addEventListener("keydown", (key) => {
			key.preventDefault();
			key.stopImmediatePropagation();
			this.terminal.key(key);
			console.log("hello");
		});
		this.terminal.print("terminal work in progress... new line doesnt work rn");
	}

	// Retrieves os
	get os() {
		// Returns os
		return this._os;
	}

	// Modifies os
	set os(os: ImageOs | null) {
		// for now ig
		this.os = os;
	}

	// Requests image bios
	static async request(): Promise<ImageBios> {
		// Initializes image bios
		const reference = "@os:__bios__";
		const drive = await ImageDrive.request(reference);

		// Returns image bios
		return new ImageBios(reference, drive);
	}
}

// Exports
export default ImageBios;

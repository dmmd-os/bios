// Imports
import ImageDrive from "./image_drive";
import ImageOs from "./image_os";
import ImageStdio from "./image_stdio";

// Defines image bios
export class ImageBios {
	// Declares fields
	private _os: ImageOs | null;
	readonly drive: ImageDrive;
	readonly reference: string;
	readonly stdio: ImageStdio;

	// Constructs image bios
	constructor(reference: string, drive: ImageDrive) {
		// Initializes fields
		this._os = null;
		this.drive = drive;
		this.reference = reference;
		this.stdio = new ImageStdio();
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
		const reference = "__bios__";
		const drive = await ImageDrive.request(reference);

		// Returns image bios
		return new ImageBios(reference, drive);
	}
}

// Exports
export default ImageBios;

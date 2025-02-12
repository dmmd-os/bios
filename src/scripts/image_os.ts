// Imports
import ImageDrive from "./image_drive";

// Defines image os
export class ImageOs {
	// Declares fields
	readonly drive: ImageDrive;
	readonly frame: HTMLIFrameElement;
	readonly reference: string;
	readonly source: string;

	// Constructs image os
	constructor(reference: string, source: string, drive: ImageDrive) {
		// Initializes fields
		this.drive = drive;
		this.frame = document.createElement("iframe");
		this.reference = reference;
		this.source = source;

		// Initializes frame
		this.frame.classList.add("image-os");
		this.frame.srcdoc = source;
	}

	// Requests image os
	static async request(reference: string, source: string): Promise<ImageOs> {
		// Initializes image os
		const drive = await ImageDrive.request(reference);

		// Returns image os
		return new ImageOs(reference, source, drive);
	}
}

// Exports
export default ImageOs;

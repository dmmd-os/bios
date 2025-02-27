// Imports
import PersistentStorage from "../persistent-storage";

// Defines image os
export class ImageOs {
	// Declares fields
	readonly drive: PersistentStorage;
	readonly frame: HTMLIFrameElement;
	readonly reference: string;
	readonly source: string;

	// Constructs image os
	constructor(reference: string, source: string, drive: PersistentStorage) {
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
		const drive = await PersistentStorage.request(reference);

		// Returns image os
		return new ImageOs(reference, source, drive);
	}
}

// Exports
export default ImageOs;

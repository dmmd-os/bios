// Imports
import ImageDrive from "./image_drive";
import ImageEvents from "./image_events";
import ImageOs from "./image_os";
import ImageStdio from "./image_stdio";

// Defines image bios
export class ImageBios {
	// Declares fields
	private _os: ImageOs | null;
	readonly drive: ImageDrive;
	readonly events: ImageEvents;
	readonly stdio: ImageStdio;

		

	
}

// Exports
export default ImageBios;

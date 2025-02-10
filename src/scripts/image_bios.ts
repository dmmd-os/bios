// Imports
import ImageDrive from "./image_drive";
import ImageEvents from "./image_events";
import ImageStdio from "./image_stdio";

// Defines image bios
export class ImageBios {
	// Declares fields
	readonly drive: ImageDrive;
	readonly events: ImageEvents;
	readonly stdio: ImageStdio;
	
	// Fetches source through remote proxy
	static async remoteFetch(url: string): Promise<string> {
		// Fetches source
		return (await fetch("https://remote.iipython.dev/" + url)).text();
	}
}

// Exports
export default ImageBios;

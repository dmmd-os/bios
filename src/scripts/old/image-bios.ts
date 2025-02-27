// Imports
import PersistentStorage from "../persistent-storage";
import EventEmitter from "../event-emitter";
import ImageTerminal from "./image-terminal";

// Defines image bios
/** Internal handler for booter */
export class ImageBios {
	// Declares fields
	/** Booter drive */
	readonly drive: PersistentStorage;
	/** Event listeners */
	readonly events: EventEmitter;
	/** Booter terminal */
	readonly terminal: ImageTerminal;

	// Constructs image bios
	constructor(drive: PersistentStorage) {
		// Initializes fields
		this.drive = drive;
		this.events = new EventEmitter();
		this.terminal = new ImageTerminal();

		// Handles keypress
		document.addEventListener("keydown", (key: KeyboardEvent) => {
			if(key.key === "ArrowLeft" || key.key === "ArrowRight")
				this.terminal.console.move(this.terminal.console.cursor + (key.key === "ArrowLeft" ? -1 : 1), key.shiftKey);
			else this.terminal.console.enter(key.key);
		});
	}

	/** Requests image bios */
	static async request(): Promise<ImageBios> {
		// Initializes image drive
		const drive = await PersistentStorage.request("@os.dmmd:__bios__");

		// Returns image bios
		return new ImageBios(drive);
	}
}

// Exports
export default ImageBios;

// Imports
import BiosConsole from "./bios-console";
import EventEmitter from "./event-emitter";
import PersistentStorage from "./persistent-storage";

// Defines bios interface class
export class BiosInterface {
	private _os: OsInterface | null;
	readonly console: BiosConsole;
	readonly emitter: EventEmitter;
	readonly storage: PersistentStorage;


	private constructor(storage: PersistentStorage) {
		this.console = new BiosConsole();
		this.emitter = new EventEmitter();
		this.storage = storage;
	}

	static async instantiate(): Promise<BiosInterface> {
		const storage = await PersistentStorage.instantiate("@os.dmmd:__bios__");
		return new BiosInterface(storage);
	}

	get os(): OsInterface | null {
		return this._os;
	}
}

// Exports
export default BiosInterface;

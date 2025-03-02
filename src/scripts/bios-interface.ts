// Imports
import BiosConsole from "./bios-console";
import BiosTerminal from "./bios-terminal";
import EventEmitter from "./event-emitter";
import PersistentStorage from "./persistent-storage";
import ShiftQueue from "./shift-queue";

// Defines bios interface class
/** Central logic for BIOS */
export class BiosInterface {
	// Declares fields
	private _busy: Promise<void> | null;
	private _chores: ShiftQueue<() => Promise<void>>;
	private _os: null;
	/** Bios console */
	readonly console: BiosConsole;
	/** Event emitter */
	readonly emitter: EventEmitter;
	/** Bios storage */
	readonly storage: PersistentStorage;
	/** Bios terminal */
	readonly terminal: BiosTerminal;

	// Creates class
	private constructor(storage: PersistentStorage) {
		// Initializes fields
		this._busy = null;
		this._chores = new ShiftQueue();
		this._os = null;
		this.console = new BiosConsole();
		this.emitter = new EventEmitter();
		this.storage = storage;
		this.terminal = new BiosTerminal(this.console);

		// Initializes keyboard
		const handleKey: (key: KeyboardEvent) => Promise<boolean> = async (key: KeyboardEvent) => {
			// Handles alt or meta keys
			if(key.altKey || key.metaKey) return false;
	
			// Handles control keys
			if(key.ctrlKey) {
				switch(key.key) {
					case "a":
					case "A": {
						this.console.range(0, this.console.buffer.length);
						return true;
					}
					case "C": {
						await this.console.copy();
						return true;
					}
					case "I": {
						return false;
					}
					case "r":
					case "R": {
						return false;
					}
					case "V": {
						await this.console.paste();
						return true;
					}
				}
			}

			// Handles functional keys
			switch(key.key) {
				case "Escape": {
					this.console.escape();
					return true;
				}
				case "Backspace": {
					this.console.delete(-1);
					return true;
				}
				case "Delete": {
					this.console.delete(1);
					return true;
				}
				case "Enter": {
					this.console.move(this.console.buffer.length);
					this.console.enter("\n");
					return true;
				}
				case "ArrowLeft": {
					this.console.move(this.console.cursor - 1, key.shiftKey);
					return true;
				}
				case "ArrowRight": {
					this.console.move(this.console.cursor + 1, key.shiftKey);
					return true;
				}
				case "ArrowUp": {
					this.console.travel(this.console.chrono - 1);
					return true;
				}
				case "ArrowDown": {
					this.console.travel(this.console.chrono + 1);
					return true;
				}
				case "Insert": {
					this.console.mode = this.console.mode === "insert" ? "overtype" : "insert";
					return true;
				}
			}
	
			// Handles character keys
			if(key.key.length === 1) {
				this.console.enter(key.key);
				return true;
			}

			// Handles unknown key
			return false;
		};
		document.addEventListener("keydown", async (key: KeyboardEvent) => {
			// Handles key
			const action = await handleKey(key);
			
			// Prevents default
			if(action) {
				key.preventDefault();
				key.stopPropagation();
			}
		});
	}

	/** Creates a new chore */
	chore(chores: ((reference: number) => Promise<void>)[]): void {
		// Writes chore
		const reference = this._chores.index + this._chores.size;
		const chore: () => Promise<void> = async () => {
			// Runs current chore
			this.emitter.emit("startChore", reference);
			const calls: Promise<any>[] = [];
			for(let i = 0; i < chores.length; i++) chores[i](reference);
			const results = await Promise.allSettled(calls);
			
			// Fetches chore
			this.emitter.emit("endChore", reference, results);
			const next = this._chores.read();
			this._busy = next !== null ? next() : null;
		};
		this._chores.write(chore);
		
		// Fetches chore
		if(this._busy === null) this._busy = this._chores.read()!();
	}

	/** Instantiates bios interface asynchronously */
	static async instantiate(): Promise<BiosInterface> {
		// Initializes storage
		const storage = await PersistentStorage.instantiate("@os.dmmd:__bios__");

		// Initializes bios interface
		return new BiosInterface(storage);
	}

	/** Active operating system */
	get os() {
		return this._os;
	}

	private set os(os: null) {
		this._os = os;
	}

	shell(content: string): void {

	}
}

// Exports
export default BiosInterface;

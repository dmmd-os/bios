// Imports

import EventEmitter from "./event-emitter";
import ArraySet from "./array-set";

// Defines anscs regex
const anscs = /a/;

// Defines purify function
function purify(content: unknown): string {
	String(content).replace(new RegExp(anscs, "g"))
}

// Defines bios stdin class
export class BiosStdin {
	private _anchor: number;
	private _chrono: number;
	private _content: string;
	private _cursor: number;
	private _history: ArraySet<string>;
}

// Defines bios stdout class
export class BiosStdout {

}

// Defines bios console class
export class BiosConsole {
	readonly emitter: EventEmitter;
	readonly stdin: BiosStdin;
	readonly stdout: BiosStdout;

	async copy(): Promise<void> {

	}

	async input(content: unknown): void {
		
	}

	async output(content: unknown): Promise<void> {

	}

	async paste(): Promise<void> {

	}
}

// Exports
export default BiosConsole;

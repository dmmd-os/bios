// Imports
import BiosInterface from "../scripts/bios-interface";
import commands from "./commands";
import * as texts from "./texts";

// Defines bios
export const bios = await BiosInterface.instantiate();

// Handles bios events
bios.emitter.on("startChore", async (reference: number) => {
	// Fetches debug status
	const debug = await bios.storage.read("debug") as boolean;

	// Prints debug message
	if(!debug) return;
	const message = texts.debug.START_CHORE.replace(/%REFERENCE%/g, String(reference));
	console.log(message);
	bios.console.print(message);
});
bios.emitter.on("endChore", async (reference: number, results: any[]) => {
	// Fetches debug status
	const debug = await bios.storage.read("debug") as boolean;

	// Prints debug message
	if(!debug) return;
	const message = texts.debug.END_CHORE.replace(/%REFERENCE%/g, String(reference));
	console.log(message);
	console.log(results);
	bios.console.print(message);
});


// Initializes bios
if(await bios.storage.probe("arrow")) bios.console.arrow = await bios.storage.read("arrow") as string;

// Registers commands
for(let alias in commands) bios.register(commands[alias as keyof typeof commands]);

// Prints copyright
bios.console.print(texts.shell.COPYRIGHT);

// Exports
export default bios;

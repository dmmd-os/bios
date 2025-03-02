// Imports
import BiosInterface from "../scripts/bios-interface";
import commands from "./commands";
import * as texts from "./texts";

// Defines bios
export const bios = await BiosInterface.instantiate();

// Handles bios events
bios.emitter.on("startChore", (reference: number) => {
	console.log(texts.debug.START_CHORE.replace(/%REFERENCE%/g, String(reference)));
});
bios.emitter.on("endChore", (reference: number, results: any[]) => {
	console.log(texts.debug.END_CHORE.replace(/%REFERENCE%/g, String(reference)));
	console.log(results);
});


// Initializes bios
if(await bios.storage.probe("arrow")) bios.console.arrow = await bios.storage.read("arrow") as string;

// Registers commands
for(let alias in commands) bios.register(commands[alias as keyof typeof commands]);

// Prints copyright
bios.console.print(texts.shell.COPYRIGHT);

// Exports
export default bios;

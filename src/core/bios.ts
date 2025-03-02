// Imports
import BiosInterface from "../scripts/bios-interface";
import commands from "./commands";
import * as texts from "./texts";

// Defines bios
export const bios = await BiosInterface.instantiate();

// Handles bios events
bios.emitter.on("startChore", (reference) => {
	console.log(texts.debug.START_CHORE.replace(/%REFERENCE%/g, reference));
});
bios.emitter.on("endChore", (reference, results) => {
	console.log(texts.debug.END_CHORE.replace(/%REFERENCE%/g, reference));
	console.log(results);
});

// Initializes bios
if(await bios.storage.probe("arrow")) bios.console.arrow = await bios.storage.read("arrow") as string;

// Registers commands
for(let alias in commands) bios.register(commands[alias as keyof typeof commands]);

// Exports
export default bios;

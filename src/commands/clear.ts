// Imports
import bios from "../core/bios";
import * as texts from "../core/texts";
import BiosCommand from "../scripts/bios-command";

// Defines clear command
export const clear = new BiosCommand(
	[ "clear", "cls" ],
	texts.commands.CLEAR.DESCRIPTION, texts.commands.CLEAR.DETAILS,
	async () => {
		// Clears console
		bios.console.clear();
	}
);

// Exports
export default clear;

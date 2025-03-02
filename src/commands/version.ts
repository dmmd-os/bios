// Imports
import bios from "../core/bios";
import * as texts from "../core/texts";
import BiosCommand from "../scripts/bios-command";

// Defines version command
export const version = new BiosCommand(
	[ "version", "v" ],
	texts.commands.VERSION.DESCRIPTION, texts.commands.VERSION.DETAILS,
	async () => {
		// Clears console
		bios.console.print(texts.commands.VERSION.DISPLAY_HASH.replace(/%VERSION%/g, bios.version));
	}
);

// Exports
export default version;

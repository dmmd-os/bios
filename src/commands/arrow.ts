// Imports
import bios from "../core/bios";
import * as texts from "../core/texts";
import BiosCommand from "../scripts/bios-command";

// Defines arrow command
export const arrow = new BiosCommand(
	[ "arrow" ],
	texts.commands.ARROW.DESCRIPTION, texts.commands.ARROW.DETAILS,
	async (flags: Map<string, string[]>) => {
		// Fetches parameters
		const parameters = flags.get("")!;

		// Handles empty parameters
		if(parameters.length === 0 && !flags.has("-default")) {
			bios.console.print(texts.commands.ARROW.NO_ARROW);
			return;
		}

		// Updates arrow
		bios.console.arrow = flags.has("--default") ? "> " : (parameters[0] + " ");
		await bios.storage.write("arrow", bios.console.arrow);
		bios.console.print();
	}
);

// Exports
export default arrow;

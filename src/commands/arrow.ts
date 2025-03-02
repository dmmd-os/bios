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

		// Handles reset flag
		if(flags.has("--reset")) {
			bios.console.arrow = "> ";
			await bios.storage.delete("arrow");
			bios.console.print(texts.commands.ARROW.SUCCESS);
			return;
		}

		// Handles custom arrow
		if(parameters.length !== 0) {
			const arrow = parameters[0] + " ";
			bios.console.arrow = arrow;
			await bios.storage.write("arrow", arrow);
			bios.console.print(texts.commands.ARROW.SUCCESS);
			return;
		}
		
		// Handles invalid input
		bios.console.print(texts.commands.ARROW.NO_ARROW);
	}
);

// Exports
export default arrow;

// Imports
import bios from "../core/bios";
import * as texts from "../core/texts";
import BiosCommand from "../scripts/bios-command";

// Defines help command
export const help = new BiosCommand(
	[ "help" ],
	texts.commands.HELP.DESCRIPTION, texts.commands.HELP.DETAILS,
	async (flags: Map<string, string[]>) => {
		// Fetches parameters
		const parameters = flags.get("")!;
		
		// Displays commmand list
		if(parameters.length === 0) {
			bios.console.print(texts.commands.HELP.COMMAND_LIST);
			bios.console.print(bios.registry.map((command: BiosCommand) => command.aliases.join(", ")).join("\n"));
			return;
		}

		// Displays details
		const alias = parameters[0];
		const command = bios.commands.get(alias)!;
		bios.console.print(
			typeof command === "undefined" ?
			texts.commands.HELP.COMMAND_NOT_FOUND.replace(/%ALIAS%/g, alias) :
				command.details
		);
	}
);

// Exports
export default help;

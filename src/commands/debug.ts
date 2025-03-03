// Imports
import bios from "../core/bios";
import * as texts from "../core/texts";
import BiosCommand from "../scripts/bios-command";

// Defines debug command
export const debug = new BiosCommand(
	[ "debug" ],
	texts.commands.DEBUG.DESCRIPTION, texts.commands.DEBUG.DETAILS,
	async (flags: Map<string, string[]>) => {
		// Fetches parameters
		const parameters = flags.get("")!;
		
		// Parses action
		switch(parameters[0]) {
			case "enable":
			case "true": {
				await bios.storage.write("debug", true);
				bios.console.print(texts.commands.DEBUG.ENABLED);
				break;
			}
			case "disable":
			case "false": {
				await bios.storage.write("debug", false);
				bios.console.print(texts.commands.DEBUG.DISABLED);
				break;
			}
			case void 0: {
				const debug = (await bios.storage.read("debug") as boolean | null) ?? false;
				bios.console.print(texts.commands.DEBUG.STATUS.replace(/%DEBUG%/g, String(debug)));
				break;
			}
			default: {
				bios.console.print(texts.commands.DEBUG.UNKNOWN_ACTION.replace(/%ACTION%/g, String(parameters[0])));
				break;
			}
		}
	}
);

// Exports
export default debug;

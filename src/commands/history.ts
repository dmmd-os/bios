// Imports
import bios from "../core/bios";
import * as texts from "../core/texts";
import BiosCommand from "../scripts/bios-command";

// Defines history command
export const history = new BiosCommand(
	[ "history" ],
	texts.commands.HISTORY.DESCRIPTION, texts.commands.HISTORY.DETAILS,
	async () => {
		// Displays history list
		bios.console.print(texts.commands.HISTORY.HISTORY_LIST);
		bios.console.print(bios.console.history.join("\n"));
	}
);

// Exports
export default history;

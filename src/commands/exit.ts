// Imports
import * as texts from "../core/texts";
import BiosCommand from "../scripts/bios-command";

// Defines exit command
export const exit = new BiosCommand(
	[ "exit" ],
	texts.commands.EXIT.DESCRIPTION, texts.commands.EXIT.DETAILS,
	async () => {
		// Reloads window
		window.location.reload();
	}
);

// Exports
export default exit;

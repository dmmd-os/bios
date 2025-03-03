// Imports
import bios from "../core/bios";
import * as texts from "../core/texts";
import BiosCommand from "../scripts/bios-command";

// Defines wait command
export const wait = new BiosCommand(
	[ "wait" ],
	texts.commands.HELP.DESCRIPTION, texts.commands.HELP.DETAILS,
	async (flags: Map<string, string[]>) => {
		const throttle: Promise<void> = new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 5000);
		});
		bios.console.print("waiting");
		await throttle;
		bios.console.print("waited");
	}
);

// Exports
export default wait;

// Imports
import { commandTexts, debugTexts } from "../core/client-constants";
import BiosCommand from "./scripts/bios-command";
import BiosInterface from "./scripts/bios-interface";
// @ts-ignore
import "./styles/bios-terminal.css";

(async () => {
	// Initializes bios
	const bios = await BiosInterface.instantiate();

	// Registers commands
	const commands: { [ alias: string ]: BiosCommand } = {
		clear: new BiosCommand(
			[ "clear", "cls" ],
			commandTexts.CLEAR.DESCRIPTION, commandTexts.CLEAR.DETAILS,
			async () => {
				// Clears console
				bios.console.clear();
			}
		),
		help: new BiosCommand(
			[ "help" ],
			commandTexts.HELP.DESCRIPTION, commandTexts.HELP.DETAILS,
			async (flags: Map<string, string[]>) => {
				// Fetches parameters
				const parameters = flags.get("")!;
				
				// Displays commmand list
				if(parameters.length === 0) {
					bios.console.print(commandTexts.HELP.COMMAND_LIST);
					bios.console.print(Object.keys(commands).join("\n"));
					return;
				}

				// Displays details
				const alias = parameters[0];
				if(!bios.commands.has(alias)) {
					bios.console.print(commandTexts.HELP.COMMAND_NOT_FOUND.replace(/%ALIAS%/g, alias));
					return;
				}
				const command = bios.commands.get(alias)!;
				bios.console.print(command.details);
			}
		)
	};
	for(let alias in commands) bios.register(commands[alias]);

	// Handles bios events
	bios.emitter.on("startChore", (reference) => {
		console.log(debugTexts.START_CHORE.replace(/%REFERENCE%/g, reference));
	});
	bios.emitter.on("endChore", (reference, results) => {
		console.log(debugTexts.END_CHORE.replace(/%REFERENCE%/g, reference));
		console.log(results);
	});

	// Renders terminal
	document.getElementById("app")?.appendChild(bios.terminal.frame);

	// Exposes bios
	// @ts-ignore
	window.bios = bios;
})();
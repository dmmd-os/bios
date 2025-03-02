// Defines constants
export const commands = {
	"ARROW": {
		"DESCRIPTION": "Customizes input arrow",
		"DETAILS": `--- Usage ---
arrow <arrow>
arrow <--default>
"Sets the input arrow to a specified arrow. This customization is carried over sessions."

--- Parameters ---
<arrow>
"Specified input arrow."

--- Flags ---
<--default>
"Sets the input arrow back to its default value."

--- Examples ---
clear`,
		"NO_ARROW": "Arrow cannot be empty"
	},
	"CLEAR": {
		"DESCRIPTION": "Clears the terminal",
		"DETAILS": `--- Usage ---
clear
"Sets buffer in the standard output system to an empty string."

--- Parameters ---

--- Flags ---

--- Examples ---
clear`
	},
	"EXIT": {
		"DESCRIPTION": "Exits process",
		"DETAILS": `--- Usage ---
exit
"Reloads window."

--- Parameters ---

--- Flags ---

--- Example ---
exit`
	},
	"HELP": {
		"COMMAND_LIST": "--- Available Commands ---",
		"COMMAND_NOT_FOUND": "Command not found: '%ALIAS%'",
		"DESCRIPTION": "Displays this message",
		"DETAILS": `--- Usage ---
help [command]
"Shows more information regarding a specific command or displays a list of available commands if no command is specified."

--- Parameters ---
[command]
"Specific command to inspect."

--- Flags ---

--- Example ---
help
help clear`
	},
	"HISTORY": {
		"DESCRIPTION": "Displays all past inputs",
		"DETAILS": `--- Usage ---
history
"Shows a complete list of all past inputs."

--- Parameters ---

--- Flags ---

--- Example ---
history`,
		"HISTORY_LIST": "--- History ---",
	},
};
export const debug = {
	"END_CHORE": "debug: Chore ended: '%REFERENCE%'",
	"START_CHORE": "debug: Chore started: '%REFERENCE%'"
}
export const shell = {
	"COMMAND_NOT_FOUND": "dsh: Command not found: '%ALIAS%'"
};

// Exports
export default {
	commands,
	debug,
	shell
};

// Defines constants
export const commandTexts = {
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
	"HELP": {
		"COMMAND_LIST": "--- Available Commands ---",
		"COMMAND_NOT_FOUND": "Command not found: '%ALIAS%'",
		"DESCRIPTION": "Displays this message",
		"DETAILS": `--- Usage ---
help [command]
"Shows more information regarding a specific command or displays a list of available commands if no command is specified."

--- Parameters
[command]
"Specific command to inspect."

--- Flags ---

--- Example ---
help
help clear`
	}
};
export const debugTexts = {
	"END_CHORE": "debug: Chore ended: '%REFERENCE%'",
	"START_CHORE": "debug: Chore started: '%REFERENCE%'"
}
export const shellTexts = {
	"COMMAND_NOT_FOUND": "dsh: Command not found: '%ALIAS%'"
};


// Imports
import version from "./version";

// Defines constants
export const commands = {
	ARROW: {
		DESCRIPTION: "Customizes input arrow",
		DETAILS: `--- Usage ---
arrow <arrow>
arrow <--reset>
"Sets the input arrow to a specified arrow. This customization is carried over sessions."

--- Parameters ---
<arrow>
"Specified input arrow."

--- Flags ---
<--reset>
"Resets the input arrow back to its default value."

--- Examples ---
arrow dsh:
arrow --reset`,
		NO_ARROW: "Specify a custom arrow to customize",
		SUCCESS: "Successfully updated arrow"
	},
	CLEAR: {
		DESCRIPTION: "Clears the terminal",
		DETAILS: `--- Usage ---
clear
"Sets buffer in the standard output system to an empty string."

--- Parameters ---

--- Flags ---

--- Examples ---
clear`
	},
	DEBUG: {
		DESCRIPTION: "Toggles debug mode",
		DETAILS: `--- Usage ---
debug [disable|enable]
"Toggles internal debug mode. Prints debug status when no status is given."

--- Parameters ---
[disable]
disable, false
"Disables debug mode."

[enable]
enable, true
"Enable debug mode."

--- Flags ---

--- Examples ---
debug
debug disable
debug enable`,
		DISABLED: "Debug mode disabled",
		ENABLED: "Debug mode enabled",
		STATUS: "Debug mode status: '%DEBUG%'",
		UNKNOWN_ACTION: "Unknown action: '%ACTION%'"
	},
	EXIT: {
		DESCRIPTION: "Exits process",
		DETAILS: `--- Usage ---
exit
"Reloads window."

--- Parameters ---

--- Flags ---

--- Examples ---
exit`
	},
	HELP: {
		COMMAND_LIST: "--- Available Commands ---",
		COMMAND_NOT_FOUND: "Command not found: '%ALIAS%'",
		DESCRIPTION: "Displays this message",
		DETAILS: `--- Usage ---
help [command]
"Shows more information regarding a specific command or displays a list of available commands if no command is specified."

--- Parameters ---
[command]
{command}
"Specific command to inspect."

--- Flags ---

--- Examples ---
help
help clear`
	},
	HISTORY: {
		DESCRIPTION: "Displays all past inputs",
		DETAILS: `--- Usage ---
history
"Shows a complete list of all past inputs."

--- Parameters ---

--- Flags ---

--- Examples ---
history`,
		HISTORY_LIST: "--- History ---"
	},
	VERSION: {
		DESCRIPTION: "Displays BIOS version",
		DETAILS: `--- Usage ---
version
"Shows current BIOS build hash."

--- Parameters ---

--- Flags ---

--- Examples ---
version`,
		DISPLAY_HASH: "Build hash: %VERSION%"
	}
};
export const debug = {
	END_CHORE: "debug: Chore ended: '%REFERENCE%'; Results printed to console",
	START_CHORE: "debug: Chore started: '%REFERENCE%'",
}
export const shell = {
	COMMAND_NOT_FOUND: "dsh: Command not found: '%ALIAS%'",
	COPYRIGHT: `--- Welcome to DmmD BIOS ---
dsh - The DmmD Shell - DmmD @ 2025 - 2025
Type 'help' for a list of commands.

Build hash: ${version}`
};

// Exports
export default {
	commands,
	debug,
	shell
};

// Defines bios command class
/** Command interface for bios */
export class BiosCommand {
	// Declares fields
	/** Command aliases */
	readonly aliases: readonly string[];
	/** Command callback */
	readonly callback: (
		flags: Map<string, string[]>,
		vector: string[],
		raw: string,
		reference: number
	) => Promise<void>;
	/** Command short description */
	readonly description: string;
	/** Command long description */
	readonly details: string;

	// Constructs class
	constructor(
		aliases: string[],
		description: string,
		details: string,
		callback: (
			flags: Map<string, string[]>,
			vector: string[],
			raw: string,
			reference: number
		) => Promise<void>
	) {
		// Initializes fields
		this.aliases = aliases;
		this.callback = callback;
		this.description = description;
		this.details = details;
	}
}

// Exports
export default BiosCommand;

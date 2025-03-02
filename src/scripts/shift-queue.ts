// Definse shift queue class
/** Linear queue */
export class ShiftQueue<Type> {
	// Declares fields
	private _index: number;
	private _queue: Map<number, Type>;

	// Constructs class
	constructor() {
		// Initializes fields
		this._index = 0;
		this._queue = new Map();
	}

	/** Clears queue */
	clear() {
		// Clears queue
		this._index += this._queue.size;
		this._queue.clear();
	}

	/** Current queue index */
	get index() {
		// Returns index
		return this._index;
	}

	/** Internal queue */
	get queue(): ReadonlyMap<number, Type> {
		// Returns queue
		return this._queue;
	}

	/** Reads and advances queue */
	read(): Type | null {
		// Reads element
		if(this._queue.size === 0) return null;
		const element = this._queue.get(this._index)!;
		
		// Advances queue
		this._queue.delete(this._index);
		this._index++;

		// Returns element
		return element;
	}

	/** Queue size */
	get size() {
		// Returns size
		return this._queue.size;
	}

	/** Writes and appends queue */
	write(element: Type): void {
		// Writes queue
		const index = this._index + this._queue.size;
		this._queue.set(index, element);
	}
}

// Exports
export default ShiftQueue;

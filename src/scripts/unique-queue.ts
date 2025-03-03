// Definse unique queue class
/** Queue with unique references */
export class UniqueQueue<TypeElement> {
	// Declares fields
	private _index: number;
	private _map: Map<number, TypeElement>;

	// Constructs class
	constructor() {
		// Initializes fields
		this._index = 0;
		this._map = new Map();
	}

	/** Clears queue */
	clear() {
		// Updates queue
		this._index += this._map.size;
		this._map.clear();
	}

	/** Current queue index */
	get index() {
		// Returns index
		return this._index;
	}

	/** Internal map */
	get map(): ReadonlyMap<number, TypeElement> {
		// Returns map
		return this._map;
	}

	/** Pulls and advances queue */
	pull(): TypeElement | null {
		// Reads element
		if(this._map.size === 0) return null;
		const element = this._map.get(this._index)!;
		
		// Updates queue
		this._map.delete(this._index);
		this._index++;

		// Returns element
		return element;
	}

	/** Pushes element to queue */
	push(element: TypeElement): void {
		// Updates queue
		const reference = this.reference;
		this._map.set(reference, element);
	}

	/** Next empty index */
	get reference() {
		// Returns reference
		return this._index + this._map.size;
	}

	/** Queue size */
	get size() {
		// Returns size
		return this._map.size;
	}
}

// Exports
export default UniqueQueue;

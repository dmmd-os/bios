// Defines array set
/** Set with array conversion */
export class ArraySet<Type> {
	// Declares fields
	private _array: Type[] | null;
	private _set: Set<Type>;

	// Constructs class
	constructor() {
		// Initializes fields
		this._array = null;
		this._set = new Set<Type>();
	}

	/** Adds element to array set */
	add(element: Type, bump: boolean = false): void {
		// Updates set
		if(bump) this._set.delete(element);
		this._set.add(element);

		// Invalidates array
		this._array = null;
	}

	/** Array conversion of array set */
	get array(): readonly Type[] {
		// Creates cache
		if(this._array === null) this._array = Array.from(this._set.values());

		// Returns arary
		return this._array;
	}

	/** CLears array set */
	clear(): void {
		// Updates set
		this._set.clear();

		// Invalidates array
		this._array = null;
	}

	/** Retrieves element at specific index */
	index(index: number): Type | null {
		// Fetches array
		const array = this.array;

		// Returns element
		if(index >= array.length) return null;
		else if(index < 0) {
			const wrapped = array.length + index;
			return wrapped < 0 ? null : array[wrapped];
		}
		else return array[index];
	}

	/** Checks if array set contains element */
	probe(element: Type): boolean {
		// Returns probe status
		return this._set.has(element);
	}

	/** Set conversion of array set */
	get set(): ReadonlySet<Type> {
		// Returns set
		return this._set;
	}

	/** Array set size */
	get size() {
		// Returns size
		return this._set.size;
	}

	/** Removes element from array set */
	remove(element: Type): void {
		// Updates set
		this._set.delete(element);

		// Invalidates array
		this._array = null;
	}
}

// Exports
export default ArraySet;

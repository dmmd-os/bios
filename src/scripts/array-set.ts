// Defines array set
/** Set with array conversion */
export class ArraySet<Type> {
	// Declares fields
	private _array: Type[] | null;
	private _set: Set<Type>;

	// Constructs array set
	constructor() {
		// Initializes fields
		this._array = null;
		this._set = new Set<Type>();
	}

	/** Array conversion of array set */
	get array(): readonly Type[] {
		// Creates cache
		if(this._array === null) this._array = Array.from(this._set.values());

		// Returns arary
		return this._array;
	}

	/** Removes element from array set */
	delete(element: Type): void {
		// Updates set
		this._set.delete(element);

		// Invalidates array
		this._array = null;
	}

	/** CLears array set */
	clear(): void {
		// Updates set
		this._set.clear();

		// Invalidates array
		this._array = null;
	}

	/** Checks if array set contains element */
	probe(element: Type): boolean {
		// Returns probe status
		return this._set.has(element);
	}

	/** Retrieves element at specific index */
	read(index: number): Type | null {
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

	/** Set conversion of array set */
	get set(): ReadonlySet<Type> {
		// Returns set
		return this._set;
	}

	/** Retrieves the array set size */
	size(): number {
		// Returns size
		return this._set.size();
	}

	/** Adds element to array set */
	write(element: Type): void {
		// Updates set
		this._set.add(element);

		// Invalidates array
		this._array = null;
	}
}

// Exports
export default ArraySet;

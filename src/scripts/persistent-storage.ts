// Defines persistent storage class
/** Data storage in a permanent database */
export class PersistentStorage {
	// Declares fields
	/** Indexed database object */
	readonly database: IDBDatabase;
	/** Identification string */
	readonly reference: string;

	// Constructs persistent storage
	private constructor(reference: string, database: IDBDatabase) {
		// Initializes fields
		this.database = database;
		this.reference = reference;
	}

	/** Clears database */
	async clear(): Promise<void> {
		// Clears store
		await this.transact((store: IDBObjectStore) => {
			store.clear();
		}, "readwrite");
	}
	
	/** Deletes key from database */
	async delete(key: string): Promise<void> {
		// Deletes key from store
		await this.transact((store: IDBObjectStore) => {
			store.delete(key);
		}, "readwrite");
	}
	
	/** Deletes multiple keys from database */
	async deleteBulk(keys: string[]): Promise<void> {
		// Deletes multiple keys from store
		await this.transact((store: IDBObjectStore) => {
			for(let i = 0; i < keys.length; i++) store.delete(keys[i]);
		}, "readwrite");
	}

	/** Deletes database */
	static drop(reference: string): Promise<void> {
		// Deletes database
		return new Promise((resolve) => {
			const request = indexedDB.deleteDatabase(reference);
			request.onsuccess = () => resolve();
		});
	}

	/** Retrieves all keys from database */
	async fetchKeys(): Promise<string[]> {
		// Retrieves keys from store
		let keys: string[] = [];
		await this.transact((store: IDBObjectStore) => {
			const request = store.getAllKeys();
			request.onsuccess = () => keys = request.result as string[];
		}, "readonly");

		// Returns keys
		return keys;
	}

	/** Retrieves all pairs from database */
	async fetchTable(): Promise<{ [ key: string ]: unknown }> {
		// Retrieves pairs from store
		const table: { [ key: string ]: unknown } = {};
		let keys: string[] = [];
		let values: unknown[] = [];
		await this.transact((store: IDBObjectStore) => {
			const requestKeys = store.getAllKeys();
			const requestValues = store.getAll();
			requestKeys.onsuccess = () => keys = requestKeys.result as string[];
			requestValues.onsuccess = () => values = requestValues.result as unknown[];
		}, "readonly");

		// Constructs table
		for(let i = 0; i < keys.length; i++) table[keys[i]] = values[i];

		// Returns table
		return table;
	}

	/** Retrieves all values from database */
	async fetchValues(): Promise<unknown[]> {
		// Retrieves values from store
		let values: unknown[] = [];
		await this.transact((store: IDBObjectStore) => {
			const request = store.getAll();
			request.onsuccess = () => values = request.result as unknown[];
		}, "readonly");

		// Returns valuess
		return values;
	}
	
	/** Asynchronously instantiates persistent storage */
	static instantiate(reference: string): Promise<PersistentStorage> {
		// Returns image drive
		return new Promise((resolve) => {
			// Opens database
			const request = indexedDB.open(reference);

			// Initializes database
			request.onupgradeneeded = () => request.result.createObjectStore("data");
			request.onsuccess = () => {
				request.result.onversionchange = () => request.result.close();
				resolve(new PersistentStorage(reference, request.result));
			};
		});
	}

	/** Detects whether key exists in database */
	async probe(key: string): Promise<boolean> {
		// Probes key in store
		let probed: boolean = false;
		await this.transact((store: IDBObjectStore) => {
			const request = store.getKey(key);
			request.onsuccess = () => probed = typeof request.result !== "undefined";
		}, "readonly");

		// Returns probed status
		return probed;
	}

	/** Detects whether multiple keys exists in database */
	async probeBulk(keys: string[]): Promise<{ [ key: string ]: boolean }> {
		// Probes key in store
		const table: { [ key: string ]: boolean } = {};
		await this.transact((store: IDBObjectStore) => {
			for(let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if(key in table) continue;
				const request = store.getKey(key);
				request.onsuccess = () => table[key] = typeof request.result !== "undefined";
				table[key] = false;
			}
		}, "readonly");

		// Returns probed status table
		return table;
	}

	/** Retrieves value from database */
	async read(key: string): Promise<unknown> {
		// Retrieves value from store
		let value: unknown = void 0;
		await this.transact((store: IDBObjectStore) => {
			const request = store.get(key);
			request.onsuccess = () => value = request.result;
		}, "readonly");

		// Returns value
		return value;
	}

	/** Retrieves multiple values from database */
	async readBulk(keys: string[]): Promise<{ [ key: string ]: unknown }> {
		// Retrieves values from store
		const table: { [ key: string ]: unknown } = {};
		await this.transact((store: IDBObjectStore) => {
			for(let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if(key in table) continue;
				const request = store.get(key);
				request.onsuccess = () => table[key] = request.result;
				table[key] = void 0;
			}
		}, "readonly");

		// Returns value table
		return table;
	}

	/** Creates transaction */
	transact(payload: (store: IDBObjectStore) => void, mode: "readonly" | "readwrite"): Promise<void> {
		// Creates transaction
		return new Promise((resolve) => {
			const transaction = this.database.transaction("data", mode);
			payload(transaction.objectStore("data"));
			transaction.oncomplete = () => resolve();
		});
	}

	/** Updates value in database */
	async write(key: string, value: unknown): Promise<void> {
		// Updates value in store
		await this.transact((store: IDBObjectStore) => {
			store.put(value, key)
		}, "readwrite");
	}

	/** Updates multiple values in database */
	async writeBulk(table: { [ key: string ]: unknown }): Promise<void> {
		// Updates values in store
		await this.transact((store: IDBObjectStore) => {
			for(let key in table) store.put(table[key], key);
		}, "readwrite");
	}
}

// Exports
export default PersistentStorage;

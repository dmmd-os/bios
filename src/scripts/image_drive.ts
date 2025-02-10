// Defines image drive
export class ImageDrive {
	// Declares fields
	readonly database: IDBDatabase;

	// Constructs image drive
	constructor(database: IDBDatabase) {
		// Initializes fields
		this.database = database;
	}

	// Clears database
	async clear(): Promise<void> {
		// Creates transaction
		await this.transact((store: IDBObjectStore) => {
			// Clears store
			store.clear();
		}, "readwrite");
	}
	
	// Deletes key from database
	async deleteOne(key: string): Promise<void> {
		// Creates transaction
		await this.transact((store: IDBObjectStore) => {
			// Deletes key from store
			store.delete(key);
		}, "readwrite");
	}
	
	// Deletes multiple keys from database
	async deleteBulk(keys: string[]): Promise<void> {
		// Creates transaction
		await this.transact((store: IDBObjectStore) => {
			// Deletes multiple keys from store
			for(let i = 0; i < keys.length; i++) store.delete(keys[i]);
		}, "readwrite");
	}

	// Retrieves all keys from database
	async fetchKeys(): Promise<string[]> {
		// Creates transaction
		let keys: string[] = [];
		await this.transact((store: IDBObjectStore) => {
			// Retrieves keys from store
			const request = store.getAllKeys();
			request.onsuccess = () => keys = request.result as string[];
		}, "readonly");

		// Returns keys
		return keys;
	}

	// Retrieves all pairs from database
	async fetchTable(): Promise<{ [ key: string ]: unknown }> {
		// Creates transaction
		const table: { [ key: string ]: unknown } = {};
		let keys: string[] = [];
		let values: unknown[] = [];
		await this.transact((store: IDBObjectStore) => {
			// Retrieves pairs from store
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

	// Retrieves all values from database
	async fetchValues(): Promise<unknown[]> {
		// Creates transaction
		let values: unknown[] = [];
		await this.transact((store: IDBObjectStore) => {
			// Retrieves values from store
			const request = store.getAll();
			request.onsuccess = () => values = request.result as unknown[];
		}, "readonly");

		// Returns valuess
		return values;
	}

	// Detects whether key exists in database
	async probeOne(key: string): Promise<boolean> {
		// Creates transaction
		let probed: boolean = false;
		await this.transact((store: IDBObjectStore) => {
			// Probes key in store
			const request = store.getKey(key);
			request.onsuccess = () => probed = typeof request.result !== "undefined";
		}, "readonly");

		// Returns probed status
		return probed;
	}

	// Detects whether multiple keys exists in database
	async probeBulk(keys: string[]): Promise<{ [ key: string ]: boolean }> {
		// Creates transaction
		const table: { [ key: string ]: boolean } = {};
		await this.transact((store: IDBObjectStore) => {
			// Probes key in store
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

	// Retrieves value from database
	async readOne(key: string): Promise<unknown> {
		// Creates transaction
		let value: unknown = void 0;
		await this.transact((store: IDBObjectStore) => {
			// Retrieves value from store
			const request = store.get(key);
			request.onsuccess = () => value = request.result;
		}, "readonly");

		// Returns value
		return value;
	}

	// Retrieves multiple values from database
	async readBulk(keys: string[]): Promise<{ [ key: string ]: unknown }> {
		// Creates transaction
		const table: { [ key: string ]: unknown } = {};
		await this.transact((store: IDBObjectStore) => {
			// Retrieves values from store
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
	
	// Fetches image drive from reference
	static request(reference: string): Promise<ImageDrive> {
		// Returns image drive
		return new Promise((resolve) => {
			// Opens database
			const request = indexedDB.open(reference);

			// Initializes database
			request.onupgradeneeded = () => request.result.createObjectStore("data");

			// Resolves database
			request.onsuccess = () => resolve(new ImageDrive(request.result));
		});
	}

	// Creates transaction
	transact(payload: (store: IDBObjectStore) => void, mode: "readonly" | "readwrite"): Promise<void> {
		// Returns transaction
		return new Promise((resolve) => {
			const transaction = this.database.transaction("data", mode);
			payload(transaction.objectStore("data"));
			transaction.oncomplete = () => resolve();
		});
	}

	// Updates value in database
	async writeOne(key: string, value: unknown): Promise<void> {
		// Creates transaction
		await this.transact((store: IDBObjectStore) => {
			// Updates value in store
			store.put(value, key)
		}, "readwrite");
	}

	// Updates multiple values in database
	async writeBulk(table: { [ key: string ]: unknown }): Promise<void> {
		// Creates transaction
		await this.transact((store: IDBObjectStore) => {
			// Updates values in store
			for(let key in table) store.put(table[key], key);
		}, "readwrite");
	}
}

// Exports
export default ImageDrive;

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
	async deleteKey(key: string): Promise<void> {
		// Creates transaction
		await this.transact((store: IDBObjectStore) => {
			// Deletes key from store
			store.delete(key);
		}, "readwrite");
	}
	
	// Deletes multiple keys from database
	async deleteTable(keys: string[]): Promise<void> {
		// Creates transaction
		await this.transact((store) => {
			// Deletes multiple keys from store
			for(let i = 0; i < keys.length; i++) store.delete(keys[i]);
		}, "readwrite");
	}
	
	// Fetches image drive from reference
	static fetch(reference: string): Promise<ImageDrive> {
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

	// Retrieves value from database
	async readKey(key: string): Promise<unknown> {
		// Creates transaction
		let value;
		await this.transact((store) => {
			// Retrieves value from store
			const request = store.get(key);
			request.onsuccess = () => value = request.result;
		});

		// Returns value
		return value;
	}

	// Retrieves multiple values from database
	async readTable(keys: string[]): Promise<{ [ key: string ]: unknown }> {
		// Creates transaction
		const table: { [ key: string ]: unknown } = {};
		await this.transact((store) => {
			// Retrieves values from store
			for(let i = 0; i < keys.length; i++) {
				const request = store.get(keys[i]);
				request.onsuccess = () => table[keys[i]] = request.result;
			}
		});

		// Returns values
		return table;
	}

	// Creates transaction
	transact(payload: (store: IDBObjectStore) => void, mode: "readonly" | "readwrite" = "readonly"): Promise<void> {
		// Returns transaction
		return new Promise((resolve) => {
			const transaction = this.database.transaction("data", mode);
			payload(transaction.objectStore("data"));
			transaction.oncomplete = () => resolve();
		});
	}

	// Updates value in database
	async writeKey(key: string, value: unknown): Promise<void> {
		// Creates transaction
		await this.transact((store) => {
			// Updates value in store
			store.put(value, key)
		}, "readwrite");
	}

	// Updates multiple values in database
	async writeTable(table: { [ key: string ]: unknown }): Promise<void> {
		// Creates transaction
		await this.transact((store) => {
			// Updates values in store
			for(let key in table) store.put(table[key], key);
		}, "readwrite");
	}
}

// Exports
export default ImageDrive;

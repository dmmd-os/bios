// Defines image proxy
export class ImageProxy {
	// Fetches resource directly
	static async fetch(url: string, remote: boolean): Promise<Response> {
		// Fetches resource
		return await fetch(remote ? ImageProxy.wrap(url) : url);
	}

	// Fetches json
	static async json(url: string, remote: boolean = false): Promise<object> {
		// Fetches resource
		return await (await ImageProxy.fetch(url, remote)).json();
	}

	// Wraps url through a remote server
	static wrap(url: string): string {
		// Wraps url
		return "https://remote.iipython.dev/" + url;
	}
	
	// Fetches text
	static async text(url: string, remote: boolean = false): Promise<string> {
		// Fetches resource
		return await (await ImageProxy.fetch(url, remote)).text();
	}
}

// Exports
export default ImageProxy;

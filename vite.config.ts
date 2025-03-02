// Imports
import { defineConfig } from "vite";
import { commitHash } from "./core/server-constants";

// Exports
export default defineConfig({
	define: {
		__COMMIT_HASH__: JSON.stringify(commitHash)
	}
});

// Imports
import { defineConfig } from "vite";
import commitHash from "./src/core/commit-hash";

// Exports
export default defineConfig({
	esbuild: {
		supported: {
			"top-level-await": true
		},
	},
	define: {
		__COMMIT_HASH__: JSON.stringify(commitHash)
	}
});

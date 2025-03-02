// Imports
import { execSync } from "node:child_process";

// Defines commit hash
export const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

// Exports
export default commitHash;
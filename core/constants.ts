// Imports
import { execSync } from "node:child_process";

// Defines constants
export const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

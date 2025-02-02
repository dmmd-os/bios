import ImageTerminal from "./scripts/image_terminal";

// Imports
const imageTerminal = new ImageTerminal();
document.getElementById("app")!.appendChild(imageTerminal.frame);
document.addEventListener("keydown", (key: KeyboardEvent) => {
	imageTerminal.key(key);
});

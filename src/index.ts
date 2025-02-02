import ImageTerminal from "./scripts/image_terminal";

// Imports
const imageTerminal = new ImageTerminal();
document.getElementById("app")!.appendChild(imageTerminal.frame);
document.addEventListener("keydown", (key: KeyboardEvent) => {
	if(key.ctrlKey && key.key === "r") {}
	else if(key.ctrlKey && key.key === "R") {}
	else if(key.ctrlKey && key.key === "I") {}
	else imageTerminal.key(key); // some spoiled brat wants me to escape ctrl r and ctrl shift i
});

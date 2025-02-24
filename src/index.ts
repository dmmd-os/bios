// @ts-nocheck

// Imports
// @ts-ignore
import ImageBios from "./scripts/image-bios";
import ImageTerminal from "./scripts/image-terminal";
import "./styles/image-os.css";
// @ts-ignore
import "./styles/image-terminal.css";

(async () => {
	const bios = await ImageBios.request();
	window.bios = bios;
	document.getElementById("app")?.appendChild(bios.terminal.frame);
	// setInterval(() => terminal.render());
})();
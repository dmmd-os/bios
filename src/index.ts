// @ts-nocheck

// Imports
// @ts-ignore
import BiosInterface from "./scripts/bios-interface";
import "./styles/image-os.css";
// @ts-ignore
import "./styles/bios-terminal.css";

(async () => {
	const bios = await BiosInterface.instantiate();
	window.bios = bios;
	bios.emitter.on("startChore", (reference) => {
		console.log("Chore started! Reference = " + reference);
	});
	bios.emitter.on("abortChore", (reference) => {
		console.warn("Chore aborted! Reference = " + reference);
	});
	bios.emitter.on("endChore", (reference, results) => {
		console.log("Chore ended! Reference = " + reference);
		console.log(results);
	});
	document.getElementById("app")?.appendChild(bios.terminal.frame);
	// setInterval(() => terminal.render());
})();
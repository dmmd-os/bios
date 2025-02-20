// @ts-nocheck
import ImageBios from "./scripts/image_bios";
import ImageDrive from "./scripts/image_drive";
import ImageOs from "./scripts/image_os";
import ImageProxy from "./scripts/image_proxy";
import ImageStdio from "./scripts/image_stdio";
import { ImageTerminal } from "./scripts/image_terminal";

// Imports
// @ts-ignore
import "./styles/image_os.css";
// @ts-ignore
import "./styles/image_terminal.css";

(async () => {
	const bios = await ImageBios.request();
	console.log("hi");
	window.bios = bios;
	window.ImageDrive = ImageDrive;
	const os = await ImageOs.request("test", await ImageProxy.text("k4ffu.dev", true));
	window.os = os;
	window.ImageProxy = ImageProxy;
	// document.getElementById("app")?.appendChild(os.frame);

	// declare const __COMMIT_HASH__: string;
	// document.getElementById("banner")!.innerText += " " + __COMMIT_HASH__;
	const stdio = window.stdio = new ImageStdio();

	const terminal = bios.terminal;
	window.terminal = terminal;
	document.getElementById("app")?.appendChild(terminal.frame.container);
	// setInterval(() => terminal.render());
})();
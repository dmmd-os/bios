import ImageBios from "./scripts/image_bios";
import ImageDrive from "./scripts/image_drive";
import ImageOs from "./scripts/image_os";
import ImageProxy from "./scripts/image_proxy";

// Imports
// @ts-ignore
import "./styles/image_os.css";
// @ts-ignore
import "./styles/image_stdio.css";

const bios = await ImageBios.request();
window.bios = bios;
window.ImageDrive = ImageDrive;
const os = await ImageOs.request("test", await ImageProxy.text("k4ffu.dev", true));
window.os = os;
window.ImageProxy = ImageProxy;
document.getElementById("app")?.appendChild(os.frame);

declare const __COMMIT_HASH__: string;
document.getElementById("banner")!.innerText += " " + __COMMIT_HASH__;
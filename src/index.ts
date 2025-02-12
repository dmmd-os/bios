import ImageBios from "./scripts/image_bios";
import ImageDrive from "./scripts/image_drive";
import { ImageOs } from "./scripts/image_os";
import ImageProxy from "./scripts/image_proxy";

const bios = await ImageBios.request();
window.bios = bios;
window.ImageDrive = ImageDrive;
const os = await ImageOs.request("test", await ImageProxy.text("k4ffu.dev", true));
window.os = os;
window.ImageProxy = ImageProxy;
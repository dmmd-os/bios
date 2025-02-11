import ImageDrive from "./scripts/image_drive";
import { ImageOs } from "./scripts/image_os";
import ImageProxy from "./scripts/image_proxy";

const drive = await ImageDrive.request("bios");
window.drive = drive;
const os = await ImageOs.request("test");
window.os = os;
window.ImageProxy = ImageProxy;
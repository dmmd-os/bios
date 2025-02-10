import ImageDrive from "./scripts/image_drive";

const drive = await ImageDrive.request("bios");
window.drive = drive;
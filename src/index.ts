import ImageDrive from "./scripts/image_drive";

const drive = await ImageDrive.fetch("bios");
window.drive = drive;
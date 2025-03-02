// Imports
import bios from "./core/bios";
// @ts-ignore
import "./styles/bios-terminal.css";

// Renders terminal
document.getElementById("app")?.appendChild(bios.terminal.frame);

// Exposes bios
// @ts-ignore
window.bios = bios;

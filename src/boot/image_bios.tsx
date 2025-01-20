// Imports

import { Dispatch, StateUpdater, useState } from "preact/hooks";
import ImageDatabase from "./image_database";
import ImageOs from "./image_os";
import ImageTerminal from "./image_terminal";
import { JSX } from "preact/jsx-runtime";

// Defines image bios
export class ImageBios {
	// Defines fields
	private _imageOs: ImageOs | null;
	readonly imageDatabase: ImageDatabase;
	readonly imageTerminal: ImageTerminal;

	// Constructs image bios
	constructor(data: {
		imageDatabase: ImageDatabase;
		imageOs: ImageOs | null;
		imageTerminal: ImageTerminal;
	}) {
		// Initializes fields
		this.imageDatabase = data.imageDatabase;
		this._imageOs = data.imageOs;
		this.imageTerminal = data.imageTerminal;
		
		// Initializes database
		this.imageDatabase.on("blocked", (event) => {

		});
		this.imageDatabase.on("error", (event) => {

		});
		this.imageDatabase.on("success", (event) => {

		});
		this.imageDatabase.on("upgradeneeded", (event) => {

		});

		// Initializes terminal
		this.imageTerminal.enable();
	}

	// Retrieves image os
	get imageOs() {
		return this._imageOs;
	}

	// Updates image os
	set imageOs(imageOs: ImageOs | null) {
		// Toggles image terminal
		imageOs === null ? this.imageTerminal.enable() : this.imageTerminal.disable();
		
		// Updates image os
		this._imageOs = imageOs;
	}

	// Renders bios
	render(): JSX.Element {
		return this._imageOs === null ? this.imageTerminal.render() : <div>os render</div>;
	}
}

// Exports
export default ImageBios;

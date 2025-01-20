// Imports
import { JSX, render } from "preact";
import ImageBios from "./image_bios";
import ImageTerminal from "./image_terminal";
import ImageDatabase from "./image_database";
import { useEffect, useState } from "preact/hooks";

// Defines app
export function App() {
	// Creates image bios
	let iibios = new ImageBios({
		imageDatabase: new ImageDatabase("test", 2),
		imageOs: null,
		imageTerminal: new ImageTerminal()
	});
	// let [ imageBios, setImageBios ] = useState(iibios);
	let [ r, sr ] = useState(iibios.imageTerminal.render());

	useEffect(() => {
		// iibios = new ImageBios({
		// 	imageDatabase: new ImageDatabase("test", 2),
		// 	imageOs: null,
		// 	imageTerminal: new ImageTerminal()
		// });
		// setImageBios(fibios);
		sr(iibios.imageTerminal.render());
	}, [iibios]);
	
	return <>{r}</>;
}

// Renders
render(<App />, document.getElementById("app"));
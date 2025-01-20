// Imports
import "./render.css";
import { render } from "preact";
import { useRef, useState } from "preact/hooks";

// Exports
export function App() {
	// Defines preact references
	const input = useRef<HTMLSpanElement>(null);
	const [ logs, setLogs ] = useState<String[]>([]);
	const [ cursor, setCursor ] = useState<"block" | "underscore">("block");
	const [ filler, setFiller ] = useState<string>("  ");
	const [ overlayed, setOverlayed ] = useState<boolean>(false);
	
	// Defines global keyboard listener
	document.addEventListener("keydown", (event) => {
		if(
			event.ctrlKey && event.shiftKey && event.altKey &&
			event.key === "Escape"
		) {
			// Isolates event
			event.preventDefault();
			event.stopImmediatePropagation();
			console.log("OS force crash");
		}
	});
	
	// Handles boot
	const terminal = {
		clear: () => setLogs([]),
		cursorIndex: 0,
		execute: (content: String) => {
			const [ command, ...parameters ] = content.split(" ");
			switch(command.toLowerCase()) {
				case "clear": {
					terminal.clear();
					break;
				}
				case "help": {
					terminal.print("Commands");
					terminal.print("");
					terminal.print("clear ----- Clears terminal");
					terminal.print("help ----- Displays this message");
					terminal.print("install <url> <id> ----- Installs .html from url as operating systems");
					terminal.print("list ----- Lists all installed operating systems");
					terminal.print("reload ----- Reload booter (website)");
					terminal.print("upload <id> ----- Installs .html from files as operating systems");
					terminal.print("uninstall <id> ----- Uninstalls operating system");
					terminal.print("");
					terminal.print("Keybinds");
					terminal.print("Escape --- Clears line");
					terminal.print("Ctrl - / + ----- Zooms in / out by 1x (0.5x -> 50x; hold shift to zoom in / out by 0.1x)");
					terminal.print("Ctrl 0 ----- Resets zoom");
					terminal.print("Up Arrow / Down Arrow - Retrieves history commands");
					terminal.print("Ctrl Shift C - Copies selection");
					terminal.print("Ctrl Shift V - Pastes selection");
					terminal.print("Ctrl Shift T - Toggles cursor style");
					break;
				}
				case "list": {
					terminal.print("Installed operating systems:");
					terminal.print("- Yuh (yuh)");
					terminal.print("- Nuh (not_yuh)");
					break;	
				}
				case "reload": {
					location.reload();
					break;
				}
				default: {
					terminal.print("Command not found: " + command);
					if(["upload", "install", "uninstall"].includes(command.toLowerCase())) {
						terminal.print("If it says its in the command list, yuh well, i havent added it yet");
						terminal.print("Like damn some people can't be patient ig");
						terminal.print(":3");
					}
				}
			}
		},
		history: [] as string[],
		historyIndex: -1,
		input: () => {
			// Checks null
			if(input === null || input.current === null) return;
			
			// Executes
			terminal.print("> " + input.current.innerText);
			if(input.current.innerText.trim().length !== 0) {
				const history = new Set(terminal.history);
				history.delete(input.current.innerText);
				history.add(input.current.innerText);
				terminal.history = Array.from(history).slice(-500);
				terminal.execute(input.current.innerText);
			}
			input.current.innerText = "";
			terminal.cursorIndex = 0;
			terminal.historyIndex = terminal.history.length;
		},
		listener: async (event: KeyboardEvent) => {
			// Checks null
			if(input === null || input.current === null) return;
			
			// Isolates event
			event.preventDefault();
			event.stopImmediatePropagation();
			if(event.metaKey || event.altKey) return;
			
			// Flushes input
			if(event.key === "Enter")
				terminal.input();
			
			// Clears input
			else if(event.key === "Escape") {
				input.current.innerText = "";
				terminal.cursorIndex = 0;
				terminal.historyIndex = terminal.history.length;
			}
			
			// Removes character
			else if(event.key === "Backspace") {
				input.current.innerText = input.current.innerText.slice(0, terminal.cursorIndex - 1) + input.current.innerText.slice(terminal.cursorIndex);
				terminal.cursorIndex = Math.max(terminal.cursorIndex - 1, 0);
				terminal.historyIndex = terminal.history.length;
			}
			
			// Previous history
			else if(event.key === "ArrowUp") {
				terminal.historyIndex = Math.max(terminal.historyIndex - 1, 0);
				input.current.innerText = terminal.historyIndex >= terminal.history.length ? "" : terminal.history[terminal.historyIndex];
				terminal.cursorIndex = input.current.innerText.length;
			}
			
			// Next history
			else if(event.key === "ArrowDown") {
				terminal.historyIndex = Math.min(terminal.historyIndex + 1, terminal.history.length);
				input.current.innerText = terminal.historyIndex >= terminal.history.length ? "" : terminal.history[terminal.historyIndex];
				terminal.cursorIndex = input.current.innerText.length;
			}
			
			// Previous character
			else if(event.key === "ArrowLeft")
				terminal.cursorIndex = Math.max(terminal.cursorIndex - 1, 0);
			
			// Next character
			else if(event.key === "ArrowRight")
				terminal.cursorIndex = Math.min(terminal.cursorIndex + 1, input.current.innerText.length);
			
			// Zooms in
			else if(event.ctrlKey && (event.key === "=" || event.key === "+"))
				document.body.style.zoom = Math.min(((+document.body.style.zoom || 1) + (event.key === "+" ? 0.1 : 1)), 50).toString();
			
			// Zooms out
			else if(event.ctrlKey && (event.key === "-" || event.key === "_"))
				document.body.style.zoom = Math.max(((+document.body.style.zoom || 1) - (event.key === "_" ? 0.1 : 1)), 0.5).toString();
			
			// Resets zoom
			else if(event.ctrlKey && event.key === "0")
				document.body.style.zoom = "1";
			
			// Copies text
			else if(event.ctrlKey && event.key === "C")
				await navigator.clipboard.writeText(document.getSelection().toString());
			
			// Pastes text
			else if(event.ctrlKey && event.key === "V") {
				const pasted = await navigator.clipboard.readText();
				const cleansed = pasted.replace(/[^\na-zA-Z0-9()[\]{}<>'"`!?@#$%^&~_+\-*/=\\|;:,. ]/g, "");
				const lines = cleansed.split("\n");
				input.current.innerText += lines[0];
				for(let i = 1; i < lines.length; i++) {
					terminal.input();
					input.current.innerText += lines[i];
				}
				terminal.cursorIndex = input.current.innerText.length;
				terminal.historyIndex = terminal.history.length;
			}
			
			// Toggles cursor
			else if(event.ctrlKey && event.key === "T")
				setCursor((previous) => previous === "block" ? "underscore" : "block");
			
			// Appends character
			else if(
				!event.ctrlKey && event.key.length === 1 &&
				/[a-zA-Z0-9()[\]{}<>'"`!?@#$%^&~_+\-*/=\\|;:,. ]/.test(event.key)
			) {
				input.current.innerText = input.current.innerText.slice(0, terminal.cursorIndex) + event.key + input.current.innerText.slice(terminal.cursorIndex);
				terminal.cursorIndex = Math.min(terminal.cursorIndex + 1, input.current.innerText.length);
				terminal.historyIndex = terminal.history.length;
			}

			// Updates cursor status
			setFiller(() => " ".repeat(terminal.cursorIndex + 2));
			setOverlayed(() => terminal.cursorIndex !== input.current.innerText.length);
		},
		print: (content: String) => setLogs((previous) => [ content, ...previous ])
	};
	document.addEventListener("keydown", terminal.listener);
	
	return (
		// Terminal
		<div id="terminal">
			{/* Input */}
			<div class="line">
				<div id="overlay">
					<span id="filler">{filler}</span>
					<span id="cursor" class={`cursor-${cursor} ${overlayed ? "cursor-overlayed" : ""}`}> </span>
				</div>
				<span>&gt; </span>
				<span id="input" ref={input}></span>
			</div>
			
			{/* Logs */}
			{logs.map((log, index) => {
				return (
					<div key={index} class="line">
						{log}
					</div>
				);
			})}
		</div>
	);
}

// Renders
render(<App />, document.getElementById("app"));

// Imports
import { ReadonlySignal, Signal, signal, useComputed, useSignal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";

import { JSX } from "preact/jsx-runtime";

// Defines image terminal
export class ImageTerminal {
	// Defines fields
	private _anchor: Signal<number> = useSignal(-1);
	private _cursor: Signal<number> = useSignal(0);
	private _enabled: Signal<boolean> = useSignal(false);
	private _listener = (event: KeyboardEvent) => {
		// Isolates event
		if(event.metaKey || event.altKey) return;
		event.stopImmediatePropagation();
		event.preventDefault();

		// Resets input
		if(event.key === "Escape") this.page = Infinity;

		// Navigates history
		else if(event.key === "ArrowUp") this.page--;
		else if(event.key === "ArrowDown") this.page++;

		// Navigates input
		else if(event.key === "ArrowLeft" || event.key === "ArrowRight") {
			if(event.shiftKey && this.anchor === -1) this.anchor = this.cursor;
			else if(!event.shiftKey && this.anchor !== -1) this.anchor = -1;
			this.cursor += event.key === "ArrowRight" ? 1 : -1;
		}
		
		// Flushes input
		else if(event.key === "Enter") this.flush();
		
		// Handles input
		else if(event.key === "Backspace") this.input = this.input.slice(0, -1);
		else if(/^[a-zA-Z0-9!?@#$%^&\\|+\-*/=_~,.;:'"`()[\]{}<> ]$/.test(event.key)) this.input += event.key;

		console.log(this);
	};
	private _page: Signal<number> = useSignal(0);
	private _input: Signal<string> = useSignal("");
	private _timeline: Signal<Set<string>> = useSignal(new Set<string>());
	private _timelineArray: ReadonlySignal<string[]> = useComputed(() => Array.from(this._timeline.value));
	readonly events: { [ name: string ]: ((...parameters: any[]) => void)[] } = {};
	reference: typeof globalThis = globalThis;

	// Retrieves anchor
	get anchor() {
		// Returns anchor
		return this._anchor.value;
	}

	// Updates anchor
	set anchor(anchor: number) {
		// Updates anchor
		this._anchor.value = Math.min(Math.max(anchor, -1), this.input.length);
	}

	// Retrieves cursor
	get cursor() {
		// Returns cursor
		return this._cursor.value;
	}

	// Updates cursor
	set cursor(cursor: number) {
		// Updates cursor
		this._cursor.value = Math.min(Math.max(cursor, 0), this.input.length);
	}

	// Disables terminal
	disable() {
		// Removes listener
		if(!this.enabled) return;
		this.reference.removeEventListener("keydown", this._listener);
		this.enabled = false;
	}
	
	// Emits event
	emit(name: "flush", input: string): void;
	emit(name: string, ...parameters: any[]): void;
	emit(name: string, ...parameters: any[]): void {
		// Triggers event listeners
		if(!(name in this.events)) return;
		const events = this.events[name];
		for(let i = 0; i < events.length; i++) events[i](...parameters);
	}
	
	// Enables terminal
	enable() {
		// Adds listener
		if(this.enabled) return;
		this.reference.addEventListener("keydown", this._listener);
		this.enabled = true;
	}

	// Retrieves enabled status
	get enabled() {
		// Returns enabled status
		return this._enabled.value;
	}

	// Updates enabled status
	private set enabled(enabled: boolean) {
		// Updates enabled status
		this._enabled.value = enabled;
	}

	// Flushes input
	flush(): void {
		// Updates timeline
		const timeline = this.timeline;
		this.timeline = new Set();
		this.timeline = timeline;
		this.timeline.delete(this.input);
		this.timeline.add(this.input);
		
		// Emits event
		this.emit("flush");

		// Resets input
		this.page = Infinity;
	}

	// Retrieves timeline
	get timeline() {
		// Returns timeline
		return this._timeline.value;
	}

	// Updates timeline
	private set timeline(timeline: Set<string>) {
		// Updates timeline
		this._timeline.value = timeline;
	}

	// Retrieves input
	get input() {
		// Returns input
		return this._input.value;
	}

	// Updates input
	private set input(input) {
		// Updates input
		this._input.value = input;
	}
	
	// Removes event listener
	off(name: "flush", callback: (input: String) => void): void;
	off(name: string, callback: (...parameters: any[]) => void): void;
	off(name: string, callback: (...parameters: any[]) => void): void {
		// Removes event listener
		if(!(name in this.events)) return;
		const events = this.events[name];
		for(let i = 0; i < events.length; i++) {
			if(events[i] === callback) events.splice(i, 1);
		}
		if(events.length === 0) delete events[name];
	}
	
	// Adds event listener
	on(name: "flush", callback: (input: String) => void): void;
	on(name: string, callback: (...parameters: any[]) => void): void;
	on(name: string, callback: (...parameters: any[]) => void): void {
		// Adds event listner
		if(!(name in this.events)) this.events[name] = [];
		this.events[name].push(callback);
	}

	// Retrieves page
	get page() {
		// Returns page
		return this._page.value;
	}

	// Updates page
	set page(page: number) {
		// Updates page
		this._page.value = Math.min(Math.max(page, 0), this._timeline.value.size);
		this._input.value = this._page.value >= this._timeline.value.size ? "" : this._timelineArray.value[this._page.value];
		this._anchor.value = -1;
		this._cursor.value = this._input.value.length;
	}

	// Renders terminal
	render(): JSX.Element {
		console.log("eyo?");
		return <div>
			&gt; {this.input}
		</div>;
	}
}

// Exports
export default ImageTerminal;

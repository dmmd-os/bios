// Imports
import Emitter from "./emitter";
import UniqueQueue from "./unique-queue";

// Defines routine types
/** Routine chore callback */
export type RoutineChore = () => Promise<void>;
/** Routine call callback */
export type RoutineCall = (reference: number) => any;

// Defines routine class
export class Routine {
    // Declares fields
    private _busy: ReturnType<RoutineChore> | null;
    private _queue: UniqueQueue<RoutineChore>;
    /** Event emitter */
    readonly emitter: Emitter<{
        addChore: (reference: number) => any,
        endChore: (reference: number, results: any[]) => any,
        startChore: (reference: number) => any,
        updateBusy: () => any
    }>;

    // Constructs class
    constructor() {
        // Initializes fields
        this._busy = null;
        this._queue = new UniqueQueue();
        this.emitter = new Emitter();
    }

    /** Current working chore */
    get busy() {
        // Returns busy
        return this._busy;
    }

    private set busy(busy: RoutineChore | null) {
        // Updates busy
        const cache = this._busy;
        this._busy = busy;

        // Emits event
        if(cache !== this._busy) this.emitter.emit("updateBusy");
    }

    /** Creates chore */
    chore<TypeCall extends (reference: number) => any>(calls: TypeCall[]): void {
        // Creates reference
        const reference = this._queue.reference;

        // Creates chore
        const chore = (async () => {
            // Broadcasts event
            await this.emitter.broadcast("startChore", reference);
            
            // Runs calls
            const pendings: Promise<any>[] = [];
            for(let i = 0; i < calls.length; i++) pendings.push(calls[i](reference));
            const results = await Promise.allSettled(pendings);

            // Broadcasts event
            await this.emitter.broadcast("endChore", reference, results);

            // Fetches chore
            const next = this._queue.pull();
            this.busy = next === null ? null : next();

        }) as TypeChore;
    }
}
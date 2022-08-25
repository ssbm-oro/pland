import type World from "../World";
export interface Entry {
        name: string;
}

export class Collection {
    protected items: Map<string, Entry> = new Map();
    protected world_id = 0;
    protected log = (_message:string) => {};

    public constructor(items:Entry[] = [], log: (message:string) => void = (_message:string) => {}) {
        items.forEach(item => {
            this.items.set(item.name, item);
        });

        this.log = log;
    }

    public get(key:string) {
        return this.items.get(key);
    }

    public setChecksForWorld(world: World) {
        this.world_id = world.id;
    }

    // public merge(items: Collection) {
    //     if (items === this) {
    //         return this;
    //     }

    //     return new Collection([...this.items.values(), ...items.items.values()]);
    // }

    public filter(f: { (entry: Entry): boolean; }) {
        return Array.from(this.items.values()).filter(f);
    }

    public addItem(entry: Entry) {
        this.items.set(entry.name, entry);
        return this;
    }

    public removeItem(entry: Entry) {
        this.items.delete(entry.name);
        return this;
    }

    has(key: string): boolean {
        return this.items.has(key);
    }

    getCount() {
        return this.items.size;
    }
}
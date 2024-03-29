import type World from "../World";
export interface Entry {
        name: string;
}

export class Collection {
    protected items: Map<string, Entry> = new Map();
    protected world_id = 0;

    public constructor(items:Entry[] = []) {
        items.forEach(item => {
            this.items.set(item.name, item);
        });
    }

    public get(key:string) {
        return this.items.get(key);
    }

    public setChecksForWorld(world_id: number) {
        this.world_id = world_id;
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
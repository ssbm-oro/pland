export interface Entry {
        name: string;
}

export class Collection {
    items: Map<string, Entry> = new Map();

    public constructor(items:Entry[] = []) {
        items.forEach(item => {
            this.items.set(item.name, item);
        });
    }

    public get(key:string) {
        return this.items.get(key);
    }

    // public merge(items: Collection) {
    //     if (items === this) {
    //         return this;
    //     }

    //     return new Collection([...this.items.values(), ...items.items.values()]);
    // }

    public filter(f: { (entry: any): boolean; }) {
        return Array.from(this.items.values()).filter(f);
    }
}
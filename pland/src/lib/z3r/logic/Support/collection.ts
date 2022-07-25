interface Entry {
        name: string
}

export class Collection {
    entries: Map<string, Entry> = new Map();

    public constructor(items:Entry[] = []) {
        items.forEach(item => {
            this.entries.set(item.name, item);
        });
    }

    public get(key:string) {
        return this.entries.get(key);
    }

    public merge(items: Collection) {
        if (items === this) {
            return this;
        }

        return new Collection([...this.entries.values(), ...items.entries.values()]);
    }
}
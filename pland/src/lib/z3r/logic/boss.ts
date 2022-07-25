import type { ItemCollection } from "./Support/itemcollection";
import type { LocationCollection } from "./Support/locationcollection";
import type { World } from "./world";

export class Boss {
    static get(key: string, world: World): Boss {
        throw new Error("Method not implemented.");
    }
    canBeat(items: ItemCollection, locations: LocationCollection): boolean {
        throw new Error("Method not implemented.");
    }
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
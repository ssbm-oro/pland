import type { Item } from "../item";
import type { World } from "../world";

export class ItemCollection {
    items: Map<string, Item> = new Map();
    item_counts : Map<string, number> = new Map();
    checksForWorld?: World;

    public constructor(items:Item[] = []) {
        items.forEach(item => this.addItem(item));
    }

    public setChecksForWorld(world: World) {
        this.checksForWorld = world;
    }

    public addItem(item: Item) {
        let count = this.item_counts.get(item.name) || 0;

        this.item_counts.set(item.name, count+1);
        this.items.set(item.name, item);

        return this;
    }

    public removeItem(item: Item) {
        if (!this.item_counts.has(item.name)) {
            return this;
        }

        let count = this.item_counts.get(item.name)! - 1;
        if (count == 0) {
            this.items.delete(item.name);
            this.item_counts.delete(item.name);
        }
        

        return this;
    }

    has(key: string, count: number = 1) {
        return this.items.has(key) && this.item_counts.has(key) && this.item_counts.get(key)! >= count;
    }

    public filter(predicate: (value: Item, index: number, array: Item[]) => value is Item){
        return new ItemCollection([...this.items.values()].filter(predicate));
    }

    public values() {
        this.items.values();
    }

    public diff(items:ItemCollection) {
        if (!this.items.size) {
            return new ItemCollection([...this.items.values()]);
        }

        let merged = new ItemCollection([...items.items.values()]);
        this.items.forEach(item => { merged.addItem(item) });

        return merged;
    }

    canKillMostThings(world:World, count: number = 1): boolean {
        throw new Error("Method not implemented.");
    }
    canLightTorches(): boolean {
        throw new Error("Method not implemented.");
    }
    canLiftRocks(): boolean {
        throw new Error("Method not implemented.");
    }
    canLiftDarkRocks(): boolean {
        throw new Error("Method not implemented.");
    }
    canShootArrows(world: World): boolean{
        throw new Error("Method not implemented.");
    }
    hasSword(count: number = 1): boolean {
        throw new Error("Method not implemented.");
    }
    canMeltThings(world: World): boolean {
        throw new Error("Method not implemented.");
    }
    canBombThings(): boolean {
        throw new Error("Method not implemented.");
    }
    hasABottle(): boolean {
        throw new Error("Method not implemented.");
    }
    canFly(world: World): boolean {
        throw new Error("Method not implemented.");
    }
    canExtendMagic(): boolean {
        throw new Error("Method not implemented.");
    }
}
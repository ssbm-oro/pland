import { ItemCollection } from "./Support/itemcollection";
import type { World } from "./world";

export class Item {
    name: string;
    nice_name: string;
    world: World;

    public static items: ItemCollection;
    public static world: World;

    constructor(name: string, world: World) {
        this.name = name;
        this.nice_name = "item." + name;
        this.world = world;
    }

    public static all(world: World) {
        if (Item.items) return Item.items;

        Item.world = world;
        this.items = new ItemCollection([
            new Item('Nothing', world)
        ]);

        return Item.items;
    }

    public static get(name: string, world: World) {
        return Item.items?.items.get(name);
    }
}
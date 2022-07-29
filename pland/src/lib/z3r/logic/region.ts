import type Item from "./item";
import type { BigKey, Key, Map, Compass } from "./item";
import type { Boss } from "./boss";
import type World from "./world";
import type { Prize } from "./Location/prize";
import type { ItemCollection } from "./Support/itemcollection";
import { LocationCollection } from "./Support/locationcollection";

export class Region {
    name: string;
    locations: LocationCollection;
    boss?: Boss;
    world: World;
    prize?: Prize;
    can_complete?: (location: LocationCollection, items: ItemCollection) => boolean;
    can_enter?: (location: LocationCollection, items: ItemCollection) => boolean;
    region_items: Item[] = [];


    constructor(name: string, world: World) {
        this.name = name;
        this.locations = new LocationCollection([]);
        this.world = world;
    }
    
    initialize() : Region {
        return this;
    }

    public canPlaceBoss(boss: Boss, level: string = 'top') {
        if (this.name != "Ice Palace" && this.world.config.weapons == 'swordless' && boss.name == "Kholdstare") {
            return false;
        }

        return !["Agahnim", "Agahnim2", "Ganon"].includes(boss.name);
    }

    public setPrizeLocation(prize: Prize) {
        this.prize = prize;
        this.prize.region = this;
        if (this.can_complete) {
            this.prize.requirement_callback = this.can_complete;
        }

        return this;
    }

    public getPrize() {
        if (!this.prize || !this.prize.hasItem()) {
            return null;
        }

        return this.prize.item;
    }

    public hasPrize(item: Item | null = null) {
        if (!this.prize || !this.prize.hasItem()) {
            return false;
        }

        return this.prize.hasItem(item);
    }

    public canComplete(locations: LocationCollection, items: ItemCollection) {
        if (this.can_complete) {
            return this.can_complete(locations, items);
        }
        return true;
    }

    public canEnter(locations: LocationCollection, items: ItemCollection) {
        if (this.can_enter) {
            this.world.log(`Checking if we can enter ${this.name}`);
            return this.can_enter(locations, items);
        }
        this.world.log(`can_enter not defined. Assuming we can enter this region.`)
        return true;
    }

    public canFill(item: Item) {
        this.world.log(`Checking if ${item.name} can be go in Region ${this.name}.`);
        let from_world = item.world;

        // TODO: Add wild dungeon items
        if (item.is_dungeon_item)
        {
            this.world.log(`Item is a dungeon item.`);
            return this.isRegionItem(item);
        }

        this.world.log(`Item not a dungeon item.`);
        return true;
    }

    public isRegionItem(item: Item) {
        return this.region_items.includes(item);
    }

    public getEmptyLocations() {
        return this.locations.filter(location => !location.hasItem());
    }

    public locationsWithItem() {
        return this.locations.filter(location => location.hasItem());
    }
}
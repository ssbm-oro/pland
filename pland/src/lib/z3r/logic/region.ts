
import type { Boss } from "./Boss";
import type World from "./World";
import type { Prize } from "./Location";
import type { ItemCollection } from "./Support/ItemCollection";
import { LocationCollection } from "./Support/LocationCollection";
import type Item from "./Item";
import type { IDungeonItem } from "./Item";

export interface IRegion {
    name: string;
    locations: LocationCollection;
    boss?: Boss;
    world: World;
    prize?: Prize;
    can_complete?: (location: LocationCollection, items: ItemCollection) => boolean;
    can_enter?: (location: LocationCollection, items: ItemCollection) => boolean;
    region_items: Item[];
}

export default class Region implements IRegion {
    name: string;
    locations: LocationCollection;
    boss?: Boss;
    world: World;
    prize?: Prize;
    can_complete?: (location: LocationCollection, items: ItemCollection) => boolean;
    can_enter?: (location: LocationCollection, items: ItemCollection) => boolean;
    region_items: Item[];

    public constructor(name: string, world: World) {
        this.world = world;
        this.name = name;
        this.locations = new LocationCollection();
        this.region_items = [];
    }

    initialize() {
        return this;
    }


    canComplete(locations: LocationCollection, items: ItemCollection) {
        console.log('in can complete')
        if (this.can_complete) {
            this.world.log(`Checking if we can complete ${this.name}`);
            return this.can_complete(locations, items);
        }
        this.world.log(`can_complete not defined. Assuming we can complete ${this.name}.`)
        return true;
    }

    canEnter(locations: LocationCollection, items: ItemCollection) {
        if (this.can_enter) {
            this.world.log(`Checking if we can enter ${this.name}`);
            return this.can_enter(locations, items);
        }
        this.world.log(`can_enter not defined. Assuming we can enter ${this.name}.`)
        return true;
    }

    canFill(item: Item) {
        this.world.log(`Checking if ${item.name} can be go in Region ${this.name}.`);
        let from_world = item.world;

        // TODO: Add wild dungeon items
        const dungeonItem = item as IDungeonItem
        if (dungeonItem.dungeon)
        {
            this.world.log(`Item is a dungeon item.`);
            return this.isRegionItem(item);
        }

        this.world.log(`Item not a dungeon item.`);
        return true;
    }

    isRegionItem(item: Item) {
        return this.region_items.includes(item);
    }

    getEmptyLocations() {
        return this.locations.filter(location => !location.hasItem());
    }

    locationsWithItem() {
        return this.locations.filter(location => location.hasItem());
    }
}

export class Dungeon extends Region {
    canPlaceBoss(region: IRegion, boss: Boss, level: string = 'top') {
        if (region.name != "Ice Palace" && region.world.config.weapons == 'swordless' && boss.name == "Kholdstare") {
            return false;
        }

        return !["Agahnim", "Agahnim2", "Ganon"].includes(boss.name);
    }

    setPrizeLocation(prize: Prize) {
        this.prize = prize;
        this.prize.region = this;
        if (this.can_complete) {
            this.prize.requirement_callback = this.can_complete;
        }

        return this;
    }

    getPrize() {
        if (!this.prize || !this.prize.hasItem()) {
            return null;
        }

        return this.prize.item;
    }

    hasPrize(item: Item | null = null) {
        if (!this.prize || !this.prize.hasItem()) {
            return false;
        }

        return this.prize.hasItem(item);
    }
}

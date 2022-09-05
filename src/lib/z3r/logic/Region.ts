
import type { Boss } from "./Boss";
import type World from "./World";
import type { Prize } from "./Location";
import type { ItemCollection } from "./Support/ItemCollection";
import { LocationCollection } from "./Support/LocationCollection";
import  type { IDungeonItem, IItem } from "./Item";
import { log } from "./Logic";

export interface IRegion {
    name: string;
    locations: LocationCollection;
    boss?: Boss;

    prize?: Prize;
    can_complete: (location: LocationCollection, items: ItemCollection) => boolean;
    can_enter: (location: LocationCollection, items: ItemCollection, item: IItem | null, locations_checked: string[]) => boolean;
    region_items: IItem[];
}

export default class Region implements IRegion {
    name: string;
    locations: LocationCollection;
    boss?: Boss;
    world: World;
    prize?: Prize;
    can_complete: (location: LocationCollection, items: ItemCollection) => boolean = () => {return true;};
    can_enter: (location: LocationCollection, items: ItemCollection, item: IItem | null, locations_checked: string[]) => boolean = () => {return true;};
    region_items: IItem[];

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
        if (this.can_complete) {
            log(`Checking if we can complete ${this.name}`);
            return this.can_complete(locations, items);
        }
        log(`can_complete not defined. Assuming we can complete ${this.name}.`)
        return true;
    }

    canEnter(locations: LocationCollection, items: ItemCollection, item: IItem | null = null, locations_checked: string[] = []) {
        if (this.can_enter) {
            log(`Checking if we can enter ${this.name}`);
            return this.can_enter(locations, items, item, locations_checked);
        }
        log(`can_enter not defined. Assuming we can enter ${this.name}.`)
        return true;
    }

    canFill(item: IItem) {
        log(`Checking if ${item.name} can go in Region ${this.name}.`);

        // TODO: Add wild dungeon items
        const dungeonItem = item as IDungeonItem
        if (dungeonItem.dungeon)
        {
            log(`Item is a dungeon item.`);
            return this.isRegionItem(item);
        }

        log(`Item not a dungeon item.`);
        return true;
    }

    isRegionItem(item: IItem) {
        return this.region_items.some(region_item => region_item.name == item.name);
    }

    getEmptyLocations() {
        return this.locations.filter(location => !location.hasItem());
    }

    locationsWithItem() {
        return this.locations.filter(location => location.hasItem());
    }
}

export class Dungeon extends Region {
    canPlaceBoss(region: Region, boss: Boss, _level = 'top') {
        if (region.name != "Ice Palace" && region.world.config.weapons == 'swordless' && boss.name == "Kholdstare") {
            return false;
        }

        return !["Agahnim", "Agahnim2", "Ganon"].includes(boss.name);
    }

    setPrizeLocation(prize: Prize) {
        this.prize = prize;
        this.prize.region = this;
        if (this.can_complete) {
            this.prize.requirement_callback = (_item, locations, items) => this.can_complete(locations, items);
        }

        return this;
    }

    getPrize() {
        if (!this.prize || !this.prize.hasItem()) {
            return null;
        }

        return this.prize.item;
    }

    hasPrize(item: IItem | null = null) {
        if (!this.prize || !this.prize.hasItem()) {
            return false;
        }

        return this.prize.hasItem(item);
    }

    toJSON() {
        return {
            name: this.name,
            boss: this.boss,
            locations: this.locations,
            region_items: this.region_items,
        }
    }
}

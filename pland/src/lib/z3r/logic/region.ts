import type { Location } from "./location";
import type { Item } from "./item";
import type { Boss } from "./boss";
import type { World } from "./world";
import type { Prize } from "./Location/prize";
import type { ItemCollection } from "./Support/itemcollection";

export class Region {
    initialize() {
        throw new Error("Method not implemented.");
    }
    name: string;
    locations: Location[];
    boss?: Boss;
    world: World;
    prize?: Prize;
    can_complete?: (location: Location[], items: ItemCollection) => boolean;
    can_enter?: (location: Location[], items: ItemCollection) => boolean;
    region_items: Item[] = [];


    constructor(name: string, world: World) {
        this.name = name;
        this.locations = [];
        this.world = world;
    }

    public canPlaceBoss(boss: Boss, level: string = 'top') {
        if (this.name != "Ice Palace" && this.world.config.mode.weapon == 'swordless' && boss.name == "Kholdstare") {
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

    public canComplete(locations: Location[], items: ItemCollection) {
        if (this.can_complete) {
            return this.can_complete(locations, items);
        }
        return true;
    }

    public canEnter(locations: Location[], items: ItemCollection) {
        if (this.can_enter) {
            return this.can_enter(locations, items);
        }
        return true;
    }

    public canFill(item: Item) {
        let from_world = item.world;

        // TODO: Add key/region checking

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
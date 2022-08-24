import type Item from "./item";
import type { BigKey, Key, Map, Compass, IDungeonItem } from "./item";
import type { Boss } from "./boss";
import type World from "./world";
import type { Prize } from "./Location/prize";
import type { ItemCollection } from "./Support/itemcollection";
import type { LocationCollection } from "./Support/locationcollection";
import { log } from "./world";

export interface Region {
    name: string;
    locations: LocationCollection;
    boss?: Boss;
    world: World;
    prize?: Prize;
    can_complete?: (location: LocationCollection, items: ItemCollection) => boolean;
    can_enter?: (location: LocationCollection, items: ItemCollection) => boolean;
    region_items: Item[];
}

export function InItializeRegion(region: Region) {
    return region;
}

export function canPlaceBoss(region: Region, boss: Boss, level: string = 'top') {
    if (region.name != "Ice Palace" && region.world.config.weapons == 'swordless' && boss.name == "Kholdstare") {
        return false;
    }

    return !["Agahnim", "Agahnim2", "Ganon"].includes(boss.name);
}

export function setPrizeLocation(region:Region, prize: Prize) {
    region.prize = prize;
    region.prize.region = region;
    if (region.can_complete) {
        region.prize.requirement_callback = region.can_complete;
    }

    return region;
}

export function getPrize(region: Region) {
    if (!region.prize || !region.prize.hasItem()) {
        return null;
    }

    return region.prize.item;
}

export function hasPrize(region: Region, item: Item | null = null) {
    if (!region.prize || !region.prize.hasItem()) {
        return false;
    }

    return region.prize.hasItem(item);
}

export function canComplete(region: Region, locations: LocationCollection, items: ItemCollection) {
    if (region.can_complete) {
        return region.can_complete(locations, items);
    }
    return true;
}

export function canEnter(region: Region, locations: LocationCollection, items: ItemCollection) {
    if (region.can_enter) {
        log(`Checking if we can enter ${region.name}`);
        return region.can_enter(locations, items);
    }
    log(`can_enter not defined. Assuming we can enter this region.`)
    return true;
}

export function canFillRegion(region: Region, item: Item) {
    log(`Checking if ${item.name} can be go in Region ${region.name}.`);
    let from_world = item.world;

    // TODO: Add wild dungeon items
    const dungeonItem = item as IDungeonItem
    if (dungeonItem.dungeon)
    {
        log(`Item is a dungeon item.`);
        return isRegionItem(region, item);
    }

    log(`Item not a dungeon item.`);
    return true;
}

export function isRegionItem(region: Region, item: Item) {
    return region.region_items.includes(item);
}

export function getEmptyLocations(region: Region) {
    return region.locations.filter(location => !location.hasItem());
}

export function locationsWithItem(region: Region) {
    return region.locations.filter(location => location.hasItem());
}

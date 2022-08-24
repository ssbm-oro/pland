import { canEnter, canFillRegion, type Region } from "./region";
import type Item from "./item";
import type { ItemCollection } from "./Support/itemcollection";
import { LocationCollection } from "./Support/locationcollection";
import type { Entry } from "./Support/collection";
import {log} from './world'
import { allItems, type IPrize } from "./item";
import type { Medallion as MedallionItem } from "./item";

export default interface Location extends Entry {
    region: Region;
    item: Item | null;
    messages: string[]|null;
    isCrystalPendant: boolean;
    always_callback?: (item: Item, items: ItemCollection) => boolean;
    fill_callback?: (item: Item, locations: LocationCollection) => boolean;
    requirement_callback?: (locations: LocationCollection, items: ItemCollection) => boolean;
}



function fill(location: Location, newItem:Item, items: ItemCollection, check_access: boolean = false): boolean {
    let oldItem = location.item;
    setItem(location, newItem);
    if (canFill(location,newItem, items, check_access)) {
        allItems(newItem.world)!.addItem(newItem);
        return true;
    }

    setItem(location, oldItem);

    return false;
}

function setItem(location: Location, newItem: Item | null) {
    if ((location as Medallion) && (!(newItem as MedallionItem))) {
        throw "Trying to set non-medallion to medallion location";
    }

    if ((location as Prize) && (!(newItem as IPrize))) {
        throw "Trying to set non-Pendant/Crystal in a prize location: " + getName(location) + " item: " + newItem?.name;
    }

    location.item = newItem;
    return location;
}

function setRequirements(location:Location, requirement_callback: (locations: LocationCollection, items: ItemCollection) => boolean) {
    location.requirement_callback = requirement_callback;
}

function canFill(location: Location, newItem: Item, items: ItemCollection, check_access = true, plants: LocationCollection = new LocationCollection([])) {
    if (check_access) {
        items = items.clone();

        plants.filter(location => location.canAccess(items)).forEach(accessible => {
            let accessible_item = (accessible as Location).item;
            if (canEnter((accessible as Location).region, location.region.world.locations, items) && accessible_item) {
                log(`${accessible.name} is accessible so adding ${accessible_item.name}`);
                items.addItem(accessible_item!);
            }
        });
    }

    let oldItem = location.item;
    location.item = newItem;
    let fillable = (location.always_callback && location.always_callback.call(location, location.item, items)) || (canFillRegion(location.region, location.item) && (!location.fill_callback || location.fill_callback.call(location, location.item, location.region.locations))) && (!check_access || canAccess(location, items));
    location.item = oldItem;

    return fillable;
}

function removeItem(location: Location) {
    location.item = null;
}

function canAccess(location: Location, items: ItemCollection, locations: LocationCollection = new LocationCollection([])) {
    let total_locations = locations.merge(location.region.locations);

    log(`Checking region access for ${location.region.name}.`);
    if (!canEnter(location.region, total_locations, items))
    {
        log(`Cannot access region.`);
        return false;
    }

    log(`Checking requirement callback for ${location.name}.`);
    if (!location.requirement_callback || location.requirement_callback.call(location, total_locations, items)) {
        log(`Can access requirements.`);
        return true
    }

    return false;
}

function hasItem(location: Location, item: Item | null = null) {
    return item ? location.item == item : location.item !== null;
}

function getName(location: Location) {
    return location.name + ":" + location.region.world.id;
}

export interface Chest extends Location { 
    // purposefully empty class
}

export interface BigChest extends Chest { 
    // purposefully empty class
}

export class Dash extends Location { 
    // purposefully empty class
}

export class Dig extends Location { 
    // purposefully empty class
}

export class Drop extends Location { 
    // purposefully empty class
}

export class Bombos extends Drop { 
    // purposefully empty class
}

export class Ether extends Drop { 
    // purposefully empty class
}

export class Fountain extends Location { 
    // purposefully empty class
}

export interface Medallion extends Location { 
    // purposefully empty class
}

export class Npc extends Location { 
    // purposefully empty class
}

export class BugCatchingKid extends Npc { 
    // purposefully empty class
}

export class Uncle extends Npc { 
    // purposefully empty class
}

export class Witch extends Npc { 
    // purposefully empty class
}

export class Zora extends Npc { 
    // purposefully empty class
}

export class Pedestal extends Location { 
    // purposefully empty class
}

export interface Prize extends Location {
    // purposefully empty class
}

export interface Crystal extends Prize { 
    // purposefully empty class
}

export interface Pendant extends Prize { 
    // purposefully empty class
}

export interface Event extends Prize { 
    // purposefully empty class
}

export class Standing extends Location { 
    // purposefully empty class
}

export class HeraBasement extends Standing { 
    
}

export class Trade extends Location { 
    // purposefully empty class
}
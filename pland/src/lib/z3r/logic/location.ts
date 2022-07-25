import type { Region } from "./region";
import { Item } from "./item";
import type { ItemCollection } from "./Support/itemcollection";
import { LocationCollection } from "./Support/locationcollection";

export class Location {
    name: string;
    region: Region;
    item: Item | null = null;
    always_callback?: (item: Item, items: ItemCollection) => boolean;
    fill_callback?: (item: Item, locations: LocationCollection) => boolean;
    requirement_callback?: (locations: LocationCollection, items: ItemCollection) => boolean;

    constructor(name: string, region: Region) {
        this.name = name;
        this.region = region;
    }

    public fill(newItem:Item): boolean {
        let oldItem = this.item;
        this.setItem(newItem);
        if (this.canFill(newItem, Item.items)) {
            Item.items?.addItem(newItem);
            return true;
        }

        this.setItem(oldItem);

        return false;
    }

    public setItem(newItem: Item | null) {
        this.item = newItem;
        return this;
    }

    setRequirement(requirement_callback: (locations: LocationCollection, items: ItemCollection) => boolean) {
        this.requirement_callback = requirement_callback;
    }

    public canFill(newItem: Item, items: ItemCollection, check_access = true) {
        let oldItem = this.item;
        this.item = newItem;
        let fillable = (this.always_callback && this.always_callback.call(this, this.item, items)) || (this.region.canFill(this.item) && (!this.fill_callback || this.fill_callback.call(this, this.item, this.region.locations))) && (!check_access || this.canAccess(items));
        this.item = oldItem;

        return fillable;
    }

    public canAccess(items: ItemCollection, locations: LocationCollection = new LocationCollection([])) {
        let total_locations = locations ?? this.region.locations;

        if (!this.region.canEnter(total_locations, items))
        {
            return false;
        }

        if (!this.requirement_callback || this.requirement_callback.call(this, locations, items)) {
            return true
        }

        return false;
    }

    public hasItem(item: Item | null = null) {
        return item ? this.item == item : this.item !== null;
    }

    public getName() {
        return this.name + ":1";
    }
}
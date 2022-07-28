import type { Region } from "./region";
import Item from "./item";
import { ItemCollection } from "./Support/itemcollection";
import { LocationCollection } from "./Support/locationcollection";
import { Entry } from "./Support/collection";

export default class Location extends Entry {
    region: Region;
    item: Item | null = null;
    always_callback?: (item: Item, items: ItemCollection) => boolean;
    fill_callback?: (item: Item, locations: LocationCollection) => boolean;
    requirement_callback?: (locations: LocationCollection, items: ItemCollection) => boolean;

    constructor(name: string, region: Region) {
        super(name);
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

    setRequirements(requirement_callback: (locations: LocationCollection, items: ItemCollection) => boolean) {
        this.requirement_callback = requirement_callback;
    }

    public canFill(newItem: Item, items: ItemCollection, plants: LocationCollection = new LocationCollection([]), check_access = true) {
        if (check_access) {
            let items_clone = new ItemCollection([]);
            items.items.forEach(item => items_clone.addItem(item as Item));
            items = items_clone;

            plants.filter(location => location.canAccess(items, plants)).forEach(accessible => {
                let accessible_item = (accessible as Location).item;
                if (accessible_item) {
                    console.log(`${accessible.name} is accessible so adding ${accessible_item.name}`);
                    items.addItem(accessible_item!);
                }
            });
        }

        let oldItem = this.item;
        this.item = newItem;
        let fillable = (this.always_callback && this.always_callback.call(this, this.item, items)) || (this.region.canFill(this.item) && (!this.fill_callback || this.fill_callback.call(this, this.item, this.region.locations))) && (!check_access || this.canAccess(items));
        this.item = oldItem;

        return fillable;
    }

    public canAccess(items: ItemCollection, locations: LocationCollection = new LocationCollection([])) {
        console.log(items);
        let total_locations = locations ?? this.region.locations;

        console.log(`Checking region access for ${this.region.name}.`);
        if (!this.region.canEnter(total_locations, items))
        {
            console.log(`Cannot access region.`);
            return false;
        }

        console.log(`Checking requirement callback for ${this.name}.`);
        if (!this.requirement_callback || this.requirement_callback.call(this, locations, items)) {
            console.log(`Can access requirements.`);
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
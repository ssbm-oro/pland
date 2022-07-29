import type { Region } from "./region";
import Item from "./item";
import type { ItemCollection } from "./Support/itemcollection";
import { LocationCollection } from "./Support/locationcollection";
import { Entry } from "./Support/collection";

export default class Location extends Entry {
    region: Region;
    item: Item | null = null;
    messages: string[]|null;
    always_callback?: (item: Item, items: ItemCollection) => boolean;
    fill_callback?: (item: Item, locations: LocationCollection) => boolean;
    requirement_callback?: (locations: LocationCollection, items: ItemCollection) => boolean;

    constructor(name: string, region: Region, messages: string[]|null = null) {
        super(name);
        this.region = region;
        this.messages = messages;
    }

    public fill(newItem:Item, items: ItemCollection, check_access: boolean = false): boolean {
        let oldItem = this.item;
        this.setItem(newItem);
        if (this.canFill(newItem, items, check_access)) {
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

    public canFill(newItem: Item, items: ItemCollection, check_access = true, plants: LocationCollection = new LocationCollection([])) {
        if (check_access) {
            // let items_clone = new ItemCollection([]);
            // items.items.forEach(item => {
            //     for (let i = 0; i <= items.item_counts.get(item.name)!; i++) {
            //         console.log(`adding ${item.name} to cloned item collection ${items.item_counts.get(item.name)!}`);
            //         items_clone.addItem(item as Item)
            //     }
            // });
            // items = items_clone;

            plants.filter(location => location.region != this.region && location.canAccess(items, plants)).forEach(accessible => {
                let accessible_item = (accessible as Location).item;
                if (accessible_item) {
                    this.log(`${accessible.name} is accessible so adding ${accessible_item.name}`);
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
        let total_locations = locations ?? this.region.locations;

        this.log(`Checking region access for ${this.region.name}.`);
        if (!this.region.canEnter(total_locations, items))
        {
            this.log(`Cannot access region.`);
            return false;
        }

        this.log(`Checking requirement callback for ${this.name}.`);
        if (!this.requirement_callback || this.requirement_callback.call(this, locations, items)) {
            this.log(`Can access requirements.`);
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

    public log(message:string) {
        if (this.region.world.messages) this.region.world.messages.push(message);
    }
}
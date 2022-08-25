import type { ItemCollection } from "./Support/ItemCollection";
import type { Entry } from "./Support/Collection";
import Item from "./Item";
import type Region from "./Region";
import { LocationCollection } from "./Support/LocationCollection";

export interface ILocation extends Entry {
    region: Region;
    item: Item | null;
    messages: string[]|null;
    isCrystalPendant: boolean;
    always_callback?: (item: Item, items: ItemCollection) => boolean;
    fill_callback?: (item: Item, locations: LocationCollection) => boolean;
    requirement_callback?: (locations: LocationCollection, items: ItemCollection) => boolean;
}

export class Location implements ILocation {
    name: string;
    region: Region;
    item: Item | null;
    messages: string[]|null;
    isCrystalPendant: boolean;

    always_callback?: (item: Item, items: ItemCollection) => boolean;
    fill_callback?: (item: Item, locations: LocationCollection) => boolean;
    requirement_callback?: (locations: LocationCollection, items: ItemCollection) => boolean;

    public constructor(name: string, region: Region, messages: string[]|null = null) {
        this.name = name;
        this.region = region;
        this.item = null;
        this.messages = messages;
        this.isCrystalPendant = false;
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

    public setRequirements(requirement_callback: (locations: LocationCollection, items: ItemCollection) => boolean) {
        this.requirement_callback = requirement_callback;
    }

    public canFill(newItem: Item, items: ItemCollection, check_access = true, plants: LocationCollection = new LocationCollection([])) {
        if (check_access) {
            items = items.clone();

            plants.filter(location => location.canAccess(items)).forEach(accessible => {
                let accessible_item = (accessible as Location).item;
                if ((accessible as Location).region.canEnter(this.region.world.locations, items) && accessible_item) {
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

    public removeItem() {
        this.item = null;
    }

    public canAccess(items: ItemCollection, locations: LocationCollection = new LocationCollection([])) {
        let total_locations = locations.merge(this.region.locations);

        this.log(`Checking region access for ${this.region.name}.`);
        if (!this.region.canEnter(total_locations, items))
        {
            this.log(`Cannot access region.`);
            return false;
        }

        this.log(`Checking requirement callback for ${this.name}.`);
        if (!this.requirement_callback || this.requirement_callback.call(this, total_locations, items)) {
            this.log(`Can access requirements.`);
            return true
        }

        return false;
    }

    public hasItem(item: Item | null = null) {
        return item ? this.item == item : this.item !== null;
    }

    public getName() {
        return this.name + ":" + this.region.world.id;
    }

    public log(message:string) {
        this.region.world.log(message);
    }
}

export class Chest extends Location { 
    // purposefully empty class
}

export class BigChest extends Chest { 
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

export class Medallion extends Location { 
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

export class Prize extends Location {
    // purposefully empty class
}

export class Crystal extends Prize { 
    // purposefully empty class
    public override isCrystalPendant = true;
}

export class Pendant extends Prize { 
    // purposefully empty class
    public override isCrystalPendant = true;
}

export class Event extends Prize { 
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

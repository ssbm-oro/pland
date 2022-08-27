import type { ItemCollection } from "./Support/ItemCollection";
import type { Entry } from "./Support/Collection";
import type { IItem } from "./Item";
import type Region from "./Region";
import { LocationCollection } from "./Support/LocationCollection";
import { log } from "./Logic";

export interface ILocation extends Entry {
    item: IItem | null;
    isCrystalPendant: boolean;
    always_callback?: (item: IItem, items: ItemCollection) => boolean;
    fill_callback?: (item: IItem, locations: LocationCollection) => boolean;
    requirement_callback?: (locations: LocationCollection, items: ItemCollection) => boolean;
}

export class Z3rLocation implements ILocation {
    name: string;
    region: Region;
    item: IItem | null;
    isCrystalPendant: boolean;

    always_callback?: (item: IItem, items: ItemCollection) => boolean;
    fill_callback?: (item: IItem, locations: LocationCollection) => boolean;
    requirement_callback?: (locations: LocationCollection, items: ItemCollection) => boolean;

    public constructor(name: string, region: Region) {
        this.name = name;
        this.region = region;
        this.item = null;
        this.isCrystalPendant = false;
    }

    public fill(newItem:IItem, items: ItemCollection, check_access: boolean = false): boolean {
        let oldItem = this.item;
        this.setItem(newItem);
        if (this.canFill(newItem, items, check_access)) {
            // Item.items?.addItem(newItem); TODO - do i need this line?
            return true;
        }

        this.setItem(oldItem);

        return false;
    }

    public setItem(newItem: IItem | null) {
        this.item = newItem;
        return this;
    }

    public setRequirements(requirement_callback: (locations: LocationCollection, items: ItemCollection) => boolean) {
        this.requirement_callback = requirement_callback;
    }

    public canFill(newItem: IItem, items: ItemCollection, check_access = true, plants: LocationCollection = new LocationCollection([])) {
        if (check_access) {
            items = items.clone();

            plants.filter(location => location.canAccess(items)).forEach(accessible => {
                let accessible_item = (accessible as Z3rLocation).item;
                if ((accessible as Z3rLocation).region.canEnter(this.region.world.locations, items) && accessible_item) {
                    log(`${accessible.name} is accessible so adding ${accessible_item.name}`);
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
        const total_locations = locations.merge(this.region.locations);

        log(`Checking region access for ${this.region.name}.`);
        if (!this.region.canEnter(total_locations, items))
        {
            log(`Cannot access region.`);
            return false;
        }

        log(`Checking requirement callback for ${this.name}.`);
        if (!this.requirement_callback || this.requirement_callback.call(this, total_locations, items)) {
            log(`Can access requirements.`);
            return true
        }

        return false;
    }

    public hasItem(item: IItem | null = null) {
        return item ? this.item == item : this.item !== null;
    }

    public getName() {
        return this.name + ":" + this.region.world.id;
    }

    public toJSON() {
        return {
            name: this.name,
            region: {
                name: this.region.name
            },
            item: this.item,
        }
    }
}

export class Chest extends Z3rLocation { 
    // purposefully empty class
}

export class BigChest extends Chest { 
    // purposefully empty class
}

export class Dash extends Z3rLocation { 
    // purposefully empty class
}

export class Dig extends Z3rLocation { 
    // purposefully empty class
}

export class Drop extends Z3rLocation { 
    // purposefully empty class
}

export class Bombos extends Drop { 
    // purposefully empty class
}

export class Ether extends Drop { 
    // purposefully empty class
}

export class Fountain extends Z3rLocation { 
    // purposefully empty class
}

export class Medallion extends Z3rLocation { 
    // purposefully empty class
}

export class Npc extends Z3rLocation { 
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

export class Pedestal extends Z3rLocation { 
    // purposefully empty class
}

export class Prize extends Z3rLocation {
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

export class Standing extends Z3rLocation { 
    // purposefully empty class
}

export class HeraBasement extends Standing { 
    
}

export class Trade extends Z3rLocation { 
    // purposefully empty class
}

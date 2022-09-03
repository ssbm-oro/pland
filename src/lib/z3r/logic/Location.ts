import type { ItemCollection } from "./Support/ItemCollection";
import type { Entry } from "./Support/Collection";
import type { IItem } from "./Item";
import type Region from "./Region";
import { LocationCollection } from "./Support/LocationCollection";
import { log } from "./Logic";
import Item from "./Item";

export interface ILocation extends Entry {
    item: IItem | null;
    isCrystalPendant: boolean;
    always_callback?: (item: IItem, items: ItemCollection) => boolean;
    fill_callback?: (item: IItem, locations: LocationCollection) => boolean;
    requirement_callback?: (locations: LocationCollection, items: ItemCollection) => boolean;
    class: 'items' | 'prizes' | 'medallions' | 'bottles' | 'events';
}

export class Z3rLocation implements ILocation {
    name: string;
    region: Region;
    item: IItem | null;
    isCrystalPendant: boolean;
    class: 'items' | 'prizes' | 'medallions' | 'bottles' | 'events';

    always_callback?: (item: IItem, items: ItemCollection) => boolean;
    fill_callback?: (item: IItem, locations: LocationCollection) => boolean;
    requirement_callback?: (locations: LocationCollection, items: ItemCollection) => boolean;

    public constructor(name: string, region: Region) {
        this.name = name;
        this.region = region;
        this.item = null;
        this.isCrystalPendant = false;
        this.class = 'items';
    }

    public fill(newItem:IItem, items: ItemCollection, check_access = false): boolean {
        const oldItem = this.item;
        this.setItem(newItem);
        if (this.canFill(newItem, items, check_access)) {
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

    public setFillCriteria(fill_callback: (item: IItem, locations: LocationCollection) => boolean) {
        this.fill_callback = fill_callback;
    }

    public canFill(newItem: IItem, items: ItemCollection, check_access = true) {
        if (this.isCrystalPendant && !Item.isPrize(newItem)) return false;

        const oldItem = this.item;
        this.item = newItem;
        const fillable = (this.always_callback && this.always_callback.call(this, this.item, items)) || (this.region.canFill(this.item) && (!this.fill_callback || this.fill_callback.call(this, this.item, this.region.locations))) && (!check_access || this.canAccess(items));
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
        if (!!item && !!this.item) log(`checking if ${this.name}, which has: ${this.item?.name} is equal to ${item?.name}`)
        return item ? this.item?.name == item.name : this.item !== null;
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
    public constructor(name: string, region: Region) {
        super(name, region);
        this.class = "bottles"
        // TODO: Fill Criteria should be a bottle
        this.setFillCriteria(() => {return false;});
    }
}

export class Medallion extends Z3rLocation { 
    public constructor(name: string, region: Region) {
        super(name, region);
        this.class = "medallions";
    }
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
    constructor(name: string, region:Region) {
        super(name, region);
        this.class = 'prizes'
    }
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
    public constructor(name: string, region: Region) {
        super(name, region);
        this.class = 'events'
        this.setFillCriteria(() => {return false;});
    }
}

export class Standing extends Z3rLocation { 
    // purposefully empty class
}

export class HeraBasement extends Standing { 
    
}

export class Trade extends Z3rLocation { 
    // purposefully empty class
}

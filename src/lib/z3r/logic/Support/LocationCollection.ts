import type { IItem } from "../Item";
import type { ILocation, Z3rLocation as Z3rLocation } from "../Location";
import { log } from "../Logic";
import type { IRegion } from "../Region";
import type World from "../World";
import { Collection } from "./Collection";
import { ItemCollection } from "./ItemCollection";

export class LocationCollection extends Collection {
    protected override items: Map<string, Z3rLocation>;

    public constructor(locations: Z3rLocation[] = []) {
        super(locations);
        this.items = new Map<string, Z3rLocation>();
        locations.forEach(item => {
            this.items.set(item.name, item);
        });
    }

    public override get(key:string) {
        return super.get(key) as Z3rLocation;
    }

    public override filter(f: (location: Z3rLocation) => boolean): Z3rLocation[] { 
        return Array.from(this.items.values()).filter(f);
    }

    // public filter(predicate: (value: Z3rLocation) => boolean){
    //     let filtered = new  LocationCollection([...this.locations.values()].filter(predicate));
    //     filtered.world_id = this.world_id;
    //     return filtered;
    // }

    public getEmptyLocations() {
        return this.filter(location => { return (!(location as Z3rLocation).hasItem()); });
    }

    public getNonEmptyLocations() { 
        return this.filter(location => { return ((location as Z3rLocation).hasItem()); }) 
    }

    public itemInLocations(item: IItem, locationKeys: string[]) {
        log(`Checking if ${item.name} is in one of these locations:`, ...locationKeys)
        const locations = locationKeys.map(key => this.items.get(key) as Z3rLocation);
        

        if(locations.some(location => location.hasItem(item))) {
            log(`${item.name} is in ${locations.filter(location => location.hasItem(item))[0]?.name}.`)
            return true;
        }

        // const randoLocation = locations[Math.floor(Math.random() * locations.length)];
        // if (randoLocation) {
        //     log(`randomly chose ${randoLocation?.name} to place ${item.name}`)
        //     items.removeItem(item);
        //     return randoLocation.fill(item, items);
        // }

        log(`${item.name} was not in them.`)
        return false;
    }

    public getItems(world: World) {
        const item_array: IItem[] = [];

        this.items.forEach(entry => {
            const Z3rLocation = entry as Z3rLocation;
            const item = Z3rLocation.item;
            if ((item) && (world) && (item.world_id == world.id)) {
                item_array.push(item as IItem);
            }
        });
        const ret = new ItemCollection(item_array);
        ret.setChecksForWorld(world);
        return ret;
    }

    public getRegions() {
        const regions: IRegion[] = [];

        this.items.forEach(entry => {
            const location = entry as Z3rLocation;
            if (!regions.includes(location.region)) {
                regions.push(location.region);
            }
        });

        return regions;
    }

    public LocationsWithItem(item?: IItem) {
        log(`Found ${this.filter(location => { return (location as Z3rLocation).hasItem(item); }).length} locations with items`)
        return this.filter(location => { return (location as Z3rLocation).hasItem(item); })
    }

    public canAccess(items: ItemCollection) { 
        return this.filter(location => (location as Z3rLocation).canAccess(items));
    }

    public merge(locations: LocationCollection):  LocationCollection {
        if (locations === this) {
            return this;
        }

        const items1 = this.items as Map<string, Z3rLocation>;
        const items2 = locations.items as Map<string, Z3rLocation>;

        return new  LocationCollection([...items1.values(), ...items2.values()]);
    }

    public forEach(callbackfn: (value: Z3rLocation, key: string, map:Map<string, Z3rLocation>) => void, thisArg?: any) {
        this.items.forEach(callbackfn, thisArg)
    }

    public to_array() {
        return Array.from<ILocation>(this.items.values() as IterableIterator<ILocation>);
    }

    public toJSON() {
        const locations: { name: string; region: { name: string; }; item: IItem | null; }[] = [];
        this.items.forEach(location => {
            locations.push(location.toJSON());
        })
        return locations;
    }
}
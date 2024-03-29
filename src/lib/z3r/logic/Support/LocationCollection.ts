import type { IItem } from "../Item";
import Item from "../Item";
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
        log(`also this is a ${this.getCount()} collection and has ${this.to_array()[0]?.name}`)
        const locations = locationKeys.map(key => this.items.get(key) as Z3rLocation);

        log(`these locations were passed in:`)
        locations.map(location => log(`${location.name}`))

        const locationWithItem = this.filter(location => location.hasItem(item));
        
        if(locationWithItem.length > 0) {
            log(`${item.name} is in ${locationWithItem[0]?.name}.`)
            log(`returning ${locationWithItem.some(location => locationKeys.includes(location.name))}`)
            return locationWithItem.some(location => locationKeys.includes(location.name));
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

    some(predicate: (location: Z3rLocation, index: number, array: Z3rLocation[]) => boolean) {
        return Array.from(this.items.values()).some(predicate);
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
        ret.setChecksForWorld(world.id);
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

    // TODO: investigate adding this to ItemCollection.has
    CanGet(item_to_get: string, item: IItem | null, items: ItemCollection, locations_checked: string[]): boolean {
        // if (!item) return true;

        log(`checking if we can get ${item_to_get} and also items checked is ${locations_checked.join(', ')}`);
        const itemToGet = Item.get(item_to_get, this.world_id);
        let canGet = false;
        if (itemToGet) {
            const itemLocation = this.LocationsWithItem(itemToGet)[0];
            log(`${itemToGet.name} was found in ${itemLocation?.name}`)
            if (locations_checked.includes(itemLocation?.name || '')) return false;
            if (itemLocation) {
                log(`checking if we can access ${itemLocation.name}`)
                locations_checked.push(itemLocation.name)
                canGet = itemLocation.canAccess(items, this, itemToGet, locations_checked);
                locations_checked.pop();
            }
        }

        log(`${item_to_get} not even available. does it exist? ${canGet}`)
        return canGet;
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
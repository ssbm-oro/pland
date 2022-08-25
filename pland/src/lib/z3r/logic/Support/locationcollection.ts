import type Item from "../Item";
import type { Location as Z3rLocation } from "../Location";
import type { IRegion } from "../Region";
import type World from "../World";
import { Collection, type Entry } from "./Collection";
import { ItemCollection } from "./ItemCollection";

export class LocationCollection extends Collection {
    protected override items: Map<string, Z3rLocation>;

    public constructor(locations: Z3rLocation[] = []) {
        super();
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

    public itemInLocations(item: Item, LocationKeys: string[], count: number = 1) {
        LocationKeys.forEach(locationKey => {
            if ((this.items.get(locationKey) as Z3rLocation).hasItem(item)) {
                count--;
            }

        });
        return count < 1;
    }

    public getItems(world: World) {
        let items:Item[] = [];

        this.items.forEach(entry => {
            let Z3rLocation = entry as Z3rLocation;
            const item = Z3rLocation.item;
            if ((item) && (world) && (item.world == world)) {
                items.push(item);
            }
        });
        let ret = new ItemCollection(items);
        ret.setChecksForWorld(world);
        return ret;
    }

    public getRegions() {
        let regions: IRegion[] = [];

        this.items.forEach(entry => {
            let location = entry as Z3rLocation;
            if (!regions.includes(location.region)) {
                regions.push(location.region);
            }
        });

        return regions;
    }

    public LocationsWithItem(item?: Item) {
        return this.filter(location => { return (location as Z3rLocation).hasItem(item); })
    }

    public canAccess(items: ItemCollection) { 
        return this.filter(location => (location as Z3rLocation).canAccess(items));
    }

    public merge(locations: LocationCollection):  LocationCollection {
        if (locations === this) {
            return this;
        }

        let items1 = this.items as Map<string, Z3rLocation>;
        let items2 = locations.items as Map<string, Z3rLocation>;

        return new  LocationCollection([...items1.values(), ...items2.values()]);
    }

    public to_array() {
        return Array.from<Z3rLocation>(this.items.values() as IterableIterator<Z3rLocation>);
    }
}
import type { Item } from "../item";
import type { Location } from "../location";
import type { Region } from "../region";
import type { World } from "../world";
import { Collection } from "./collection";
import { ItemCollection } from "./itemcollection";

export class LocationCollection extends Collection {
    locations:Map<string, Location> = new Map();
    world_id = 0;


    public constructor(locations: Location[] = []) {
        super();
        locations.forEach(location => this.locations.set(location.name, location));
    }

    public override get(key: string) {
        return this.locations.get(key);
    }

    public setChecksForWorld(world_id: number) {
        this.world_id = world_id;
    }

    public addItem(location: Location) {
        this.locations.set(location.name, location);
        return this;
    }

    public removeItem(location: Location) {
        this.locations.delete(location.name);
        return this;
    }

    has(key: string): boolean {
        return this.locations.has(key);
    }

    public filter(predicate: (value: Location) => boolean){
        let filtered = new LocationCollection([...this.locations.values()].filter(predicate));
        filtered.world_id = this.world_id;
        return filtered;
    }

    public getEmptyLocations() {
        return this.filter(location => { return (!location.hasItem()); });
    }

    public getNonEmptyLocations() { 
        return this.filter(location => { return (location.hasItem()); }) 
    }

    public itemInLocations(item: Item, locationKeys: string[], count: number = 1) {
        locationKeys.forEach(locationKey => {
            if (this.locations.get(locationKey)?.hasItem(item)) {
                count--;
            }

        });
        return count < 1;
    }

    public getItems(world: World) {
        let items:Item[] = [];

        this.locations.forEach(location => {
            const item = location.item;
            if ((item) && (world) && (item.world == world)) {
                items.push(item);
            }
        });

        return new ItemCollection(items);
    }

    public getRegions() {
        let regions: Region[] = [];

        this.locations.forEach(location => {
            if (!regions.includes(location.region)) {
                regions.push(location.region);
            }
        });

        return regions;
    }

    public locationsWithItem(item?: Item) {
        return this.filter(location => { return location.hasItem(item); })
    }

    public canAccess(items: ItemCollection) { 
        return this.filter(location => location.canAccess(items));
    }

    public override merge(locations: LocationCollection): LocationCollection {
        let merged = super.merge(locations) as LocationCollection;
        merged.setChecksForWorld(this.world_id);
        return merged;
    }
}
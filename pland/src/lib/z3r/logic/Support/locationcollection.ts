import type { APIAuditLogChangeKeyPermissionOverwrites } from "discord-api-types/v10";
import type Item from "../item";
import type { Location } from "../location";
import type { Region } from "../region";
import type World from "../world";
import { Collection, type Entry } from "./collection";
import { ItemCollection } from "./itemcollection";

export class LocationCollection extends Collection {
    world_id = 0;


    public constructor(locations: Location[] = []) {
        super(locations);
    }

    public setChecksForWorld(world_id: number) {
        this.world_id = world_id;
    }

    public addItem(location: Location) {
        this.items.set(location.name, location);
        return this;
    }

    public removeItem(location: Location) {
        this.items.delete(location.name);
        return this;
    }

    has(key: string): boolean {
        return this.items.has(key);
    }

    public override get(key: string): Location | undefined {
        return super.get(key) as Location | undefined;
    }

    // public filter(predicate: (value: Location) => boolean){
    //     let filtered = new LocationCollection([...this.locations.values()].filter(predicate));
    //     filtered.world_id = this.world_id;
    //     return filtered;
    // }

    public getEmptyLocations() {
        return this.filter(location => { return (!location.hasItem()); });
    }

    public getNonEmptyLocations() { 
        return this.filter(location => { return (location.hasItem()); }) 
    }

    public itemInLocations(item: Item, locationKeys: string[], count: number = 1) {
        locationKeys.forEach(locationKey => {
            if ((this.items.get(locationKey) as Location).hasItem(item)) {
                count--;
            }

        });
        return count < 1;
    }

    public getItems(world: World) {
        let items:Item[] = [];

        this.items.forEach(entry => {
            let location = entry as Location;
            const item = location.item;
            if ((item) && (world) && (item.world == world)) {
                items.push(item);
            }
        });

        return new ItemCollection(items);
    }

    public getRegions() {
        let regions: Region[] = [];

        this.items.forEach(entry => {
            let location = entry as Location;
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

    public merge(locations: LocationCollection): LocationCollection {
        if (locations === this) {
            return this;
        }

        let items1 = this.items as Map<string, Location>;
        let items2 = locations.items as Map<string, Location>;

        return new LocationCollection([...items1.values(), ...items2.values()]);
    }

    public to_array() {
        return Array.from<Location>(this.items.values() as IterableIterator<Location>);
    }
}
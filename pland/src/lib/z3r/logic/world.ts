import type { Region } from "./region";
import type { ItemCollection } from "./Support/itemcollection";
import { LocationCollection } from "./Support/locationcollection";
import type { Config } from "./config";
import type Item from "./item";
import type Location from "./location";

export default class World {
    regions: Map<string, Region> = new Map();
    locations: LocationCollection = new LocationCollection([]);
    config: Config;
    win_condition?: (items: ItemCollection) => boolean;
    id: number = 0;
    inverted = false;
    messages: string[]|null = null;

    public constructor(config:Config, messages: string[]|null = null)
    {
        this.config = config;
        messages = messages;
    }

    public initialize() {
        this.regions.forEach(region => {
            if(this.config.glitches !== 'NoLogic') {
                region.initialize();
            }
            this.locations = this.locations.merge(region.locations);
        });
    }

    getRegion(regionName: string) :Region | undefined {
        return this.regions.get(regionName);
    }

    canPlant(item: Item, location: Location, messages:string[]|null): boolean {
        return location.region.canFill(item);
    }


    resetPlants() {
        this.locations.locationsWithItem().forEach(location => {
            this.locations.get(location.name)!.removeItem();
        });
    }


    canPlacePrizes(): boolean {
        return true;
    }

    canPlaceBosses(): boolean {
        return true;
    }

    canPlaceMedallions(items:ItemCollection): boolean {
        return this.canPlaceMedallion("Misery Mire Medallion", items) && this.canPlaceMedallion("Turtle Rock Medallion", items);
    }
    
    canPlaceMedallion(location: string,items: ItemCollection): boolean {
        let haveMedallion = false;
        let medallion = this.locations.get(location);
        if (!medallion || !medallion.item) {
            console.log(items);
            haveMedallion = items.has('Bombos') || items.has('Ether') || items.has('Quake');
            this.log(`${location} not set. HaveMedallion based on any medallion: ${haveMedallion}`);
        }
        else {
            haveMedallion = items.has(medallion.item.name);
            this.log(`${location} is ${medallion.item.name}. HaveMedallion: ${haveMedallion}`);
        }
        return haveMedallion;
    }

    log(message: string) {
        if (this.messages) this.messages.push(message); else console.log(message);
    }
}
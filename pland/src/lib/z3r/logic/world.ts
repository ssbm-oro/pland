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

    log(message: string) {
        if (this.messages) this.messages.push(message); else console.log(message);
    }
}
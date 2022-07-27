import type { Region } from "./region";
import type { ItemCollection } from "./Support/itemcollection";
import { LocationCollection } from "./Support/locationcollection";
import type { Config } from "./config";

export default class World {
    regions: Map<string, Region> = new Map();
    locations: LocationCollection = new LocationCollection([]);
    config: Config;
    win_condition?: (items: ItemCollection) => boolean;
    id: number = 0;

    public constructor(config:Config)
    {
        this.config = config;
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

}
import type { Region } from "./region";
import type { Location } from "./location";
import type { Item } from "./item";
import { Open } from "./World/open";
import { Standard } from "./World/standard";
import { Inverted } from "./World/inverted";
import { Retro } from "./World/retro";
import type { ItemCollection } from "./Support/itemcollection";

export class World {
    regions: Region[] = [];
    locations: Location[] = [];
    config: any;
    win_condition?: (items: ItemCollection) => boolean;

    public constructor(config:[] = [])
    {
        this.config = config;

        this.regions.forEach(region => {
            if(this.config['logic'] !== 'NoLogic') {
                region.initialize();
            }
            this.locations.push(... region.locations);
        });
    }

    public static factory(type: string, config: any) {
        switch(type) {
            case 'open':
                return new Open(config);
            case 'inverted':
                return new Inverted(config);
            case 'retro':
                return new Retro(config);
            case 'standard':
            default:
                return new Standard(config);
        }
    }

}
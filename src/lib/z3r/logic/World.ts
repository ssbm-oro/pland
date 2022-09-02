
import { ItemCollection } from "./Support/ItemCollection";
import { LocationCollection } from "./Support/LocationCollection";
import Item from "./Item";
import type { Z3rLocation } from "./Location";
import type  Config from "./Config";
import type { IRegion } from "./Region";
import type Region from "./Region";
import { log } from "./Logic";

export interface IWorld {
    config: Config;
    id: number;
}

export default class World implements IWorld {
    regions: Map<string, Region> = new Map();
    locations: LocationCollection;
    config: Config;
    win_condition?: (items: ItemCollection) => boolean;
    id = 1;
    inverted = false;

    public constructor(config:Config)
    {
        this.config = config;
        this.locations = new LocationCollection([]);
    }

    public initialize() {
        this.regions.forEach(region => {
            if(this.config.glitches !== 'NoLogic') {
                region.initialize();
            }
            this.locations = this.locations.merge(region.locations);
        });
    }

    getRegion(regionName: string) : Region | undefined {
        return this.regions.get(regionName) as Region;
    }

    canPlant(item: Item, location: Z3rLocation): boolean {
        if (location) {
            return location.region.canFill(item);
        }
        return false;
    }


    resetPlants() {
        this.locations.LocationsWithItem().forEach(location => {
            this.locations.get(location.name)!.removeItem();
        });
    }


    canPlacePrizes(items: ItemCollection): boolean {
        const requiredPendants: IRegion[] = [];
        const requiredCrystals: IRegion[] = [];


        const gtItems = new ItemCollection([]);
        this.regions.get("Ganons Tower")?.locationsWithItem().forEach(location =>{
            gtItems.addItem(location.item!);
        });
        gtItems.addItem(Item.get('Crystal1', this)!)
        gtItems.addItem(Item.get('Crystal2', this)!)
        gtItems.addItem(Item.get('Crystal3', this)!)
        gtItems.addItem(Item.get('Crystal4', this)!)
        gtItems.addItem(Item.get('Crystal5', this)!)
        gtItems.addItem(Item.get('Crystal6', this)!)
        gtItems.addItem(Item.get('Crystal7', this)!)
        gtItems.addItem(Item.get('DefeatAgahnim', this)!)
        const nonGtItems = items.diff(gtItems);

        log(`Checking if Aghanim1 is defeatable.`)
        if (nonGtItems.canDefeatAgahnim(this)) {
            log(`Determined that Agahnim1 is defeatable.`)
            nonGtItems.addItem(Item.get('DefeatAgahnim',this)!)
        }

        this.regions.forEach(region => {
            if (region.prize && region.prize.isCrystalPendant && !region.canComplete(this.locations, nonGtItems)) {
                requiredPendants.push(region);
                log(`Determined that ${region.name} must be a pendant based on GT items.`)
            }
        });
        if (requiredPendants.length > 3) {
            log(`Too many pendants! Can't place crystals.`)
            return false;
        }

        const pendItems = new ItemCollection([]);
        pendItems.addItem(Item.get('PendantOfCourage', this)!);
        pendItems.addItem(Item.get('PendantOfWisdom', this)!);
        pendItems.addItem(Item.get('PendantOfPower', this)!);
        if (this.locations.get('Master Sword Pedestal')?.item) {
            pendItems.addItem(this.locations.get('Master Sword Pedestal').item!);
        }

        const nonPendItems = items.merge(gtItems).diff(pendItems);

        this.regions.forEach(region => {
            if (region.prize && region.prize.isCrystalPendant && !region.canComplete(this.locations, nonPendItems)) {
                requiredCrystals.push(region);
                log(`Determined that ${region.name} must be a crystal based on pendant items.`);
            }
        });
        if (requiredCrystals.length > 7) {
            log(`Too many crystals! Can't place pendants.`);
            return false;
        }

        let noDoubles = true;
        requiredCrystals.forEach(crystal => {
            requiredPendants.forEach(pendant => {
                if (crystal == pendant) {
                    log(`Paradox: ${crystal.name} must be both a pendant and a crystal.`);
                    noDoubles = false;
                }
            });
        });

        // TODO: Think of circumstances where Saha or Pyramid Fairy mandate a crystal/pendant

        return noDoubles;
    }

    canPlaceBosses(): boolean {
        return true;
    }

    canPlaceMedallions(items:ItemCollection): boolean {
        return this.canPlaceMedallion("Misery Mire Medallion", items) && this.canPlaceMedallion("Turtle Rock Medallion", items);
    }
    
    canPlaceMedallion(location: string,items: ItemCollection): boolean {
        let haveMedallion = false;
        const medallion = this.locations.get(location);
        if (!medallion || !medallion.item) {
            haveMedallion = items.has('Bombos') || items.has('Ether') || items.has('Quake');
            log(`${location} not set. HaveMedallion based on any medallion: ${haveMedallion}`);
        }
        else {
            haveMedallion = items.has(medallion.item.name);
            log(`${location} is ${medallion.item.name}. HaveMedallion: ${haveMedallion}`);
        }
        return haveMedallion;
    }

    toJSON() {
        return {
            config: this.config,
            id: this.id,
            inverted: this.inverted,
            regions: this.regions,
        }
    }
}

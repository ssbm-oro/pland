
import { ItemCollection } from "./Support/ItemCollection";
import { LocationCollection } from "./Support/LocationCollection";
import Item from "./Item";
import type { Location } from "./Location";
import type  Config from "./Config";
import type { IRegion } from "./Region";
import type Region from "./Region";

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

    getRegion(regionName: string) : Region | undefined {
        return this.regions.get(regionName) as Region;
    }

    canPlant(item: Item, location: Location, messages:string[]|null): boolean {
        return location.region.canFill(item);
    }


    resetPlants() {
        this.locations.LocationsWithItem().forEach(location => {
            this.locations.get(location.name)!.removeItem();
        });
    }


    canPlacePrizes(items: ItemCollection): boolean {
        let requiredPendants: IRegion[] = [];
        let requiredCrystals: IRegion[] = [];


        let gtItems = new ItemCollection();
        this.regions.get("Ganons Tower")?.locationsWithItem().forEach(location =>{
            gtItems.addItem((location as Location).item!);
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

        if (this.getRegion('Hyrule Castle Tower')?.canComplete(this.locations, nonGtItems)) {
            nonGtItems.addItem(Item.get('DefeatAgahnim',this)!)
        }

        console.log('can complete hyrule castle tower')
        console.log(this.regions);

        this.regions.forEach(region => {
            console.log(region);
            if (region.prize && region.prize.isCrystalPendant && !region.canComplete(this.locations, nonGtItems)) {
                requiredPendants.push(region);
                this.log(`Determined that ${region.name} must be a pendant based on GT items.`)
            }
        });
        if (requiredPendants.length > 3) {
            this.log(`Too many pendants! Can't place crystals.`)
            return false;
        }

        let pendItems = new ItemCollection();
        pendItems.addItem(Item.get('PendantOfCourage', this)!);
        pendItems.addItem(Item.get('PendantOfWisdom', this)!);
        pendItems.addItem(Item.get('PendantOfPower', this)!);
        if (this.locations.get('Master Sword Pedestal')?.item) {
            pendItems.addItem(this.locations.get('Master Sword Pedestal')?.item!);
        }
        if (this.locations.get('Sahasrahla')?.item) {
            pendItems.addItem(this.locations.get('Sahasrahla')?.item!);
        }
        const nonPendItems = items.diff(pendItems);
        this.regions.forEach(region => {
            if (region.prize && region.prize.isCrystalPendant && !region.canComplete(this.locations, nonPendItems)) {
                requiredCrystals.push(region);
                this.log(`Determined that ${region.name} must be a crystal based on pendant items.`);
            }
        });
        if (requiredCrystals.length > 7) {
            this.log(`Too many crystals! Can't place pendants.`);
            return false;
        }

        let noDoubles = true;
        requiredCrystals.forEach(crystal => {
            requiredPendants.forEach(pendant => {
                if (crystal == pendant) {
                    this.log(`Paradox: ${crystal.name} must be both a pendant and a crystal.`);
                    noDoubles = false;
                }
            });
        });

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
        let medallion = this.locations.get(location);
        if (!medallion || !medallion.item) {
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

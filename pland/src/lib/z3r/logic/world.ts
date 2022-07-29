import type { Region } from "./region";
import { ItemCollection } from "./Support/itemcollection";
import { LocationCollection } from "./Support/locationcollection";
import type { Config } from "./config";
import Item from "./item";
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


    canPlacePrizes(items: ItemCollection): boolean {
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

        let requiredPendants: Region[] = [];
        // TODO: use gtItems to populate required pendants
        const nonGtItems = items.diff(gtItems);
        this.regions.forEach((region, key) => {
            if (region.prize && region.prize.isCrystalPendant && !region.canComplete(this.locations, nonGtItems)) {
                requiredPendants.push(region);
                this.log(`Determined that ${region.name} must be a pendant based on GT items.`)
            }
        });
        if (requiredPendants.length > 3) {
            this.log(`Too many pendants! Can't place crystals.`)
            return false;
        }

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
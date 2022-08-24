import { InItializeRegion, type Region } from "./region";
import { ItemCollection } from "./Support/itemcollection";
import { LocationCollection } from "./Support/locationcollection";
import type Item from "./item";
import type Location from "./location";
import type Config from "./config";


let messages: string[]|null = [];

export default interface World {
    regions: Map<string, Region> = new Map();
    locations: LocationCollection = new LocationCollection([]);
    config: Config;
    win_condition?: (items: ItemCollection) => boolean;
    id: number = 0;
    inverted: boolean;
}

    export function initialize(world: World) {
        world.regions.forEach(region => {
            if(world.config.glitches !== 'NoLogic') {
                InItializeRegion(region);
            }
            world.locations = world.locations.merge(region.locations);
        });
    }

    export function getRegion(world: World, regionName: string) :Region | undefined {
        return world.regions.get(regionName);
    }

    export function canPlant(item: Item, location: Location, messages:string[]|null): boolean {
        return canFillRegion(location.region, item);
    }


    export function resetPlants(world: World) {
        world.locations.locationsWithItem().forEach(location => {
            removeItem(world.locations.get(location.name)!);
        });
    }


    export function canPlacePrizes(world: World, items: ItemCollection): boolean {
        let requiredPendants: Region[] = [];
        let requiredCrystals: Region[] = [];


        let gtItems = new ItemCollection();
        world.regions.get("Ganons Tower")?.locationsWithItem().forEach(location =>{
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

        if (world.getRegion('Hyrule Castle Tower')?.canComplete(world.locations, nonGtItems)) {
            nonGtItems.addItem(Item.get('DefeatAgahnim',world)!)
        }

        world.regions.forEach(region => {
            if (region.prize && region.prize.isCrystalPendant && !region.canComplete(world.locations, nonGtItems)) {
                requiredPendants.push(region);
                log(`Determined that ${region.name} must be a pendant based on GT items.`)
            }
        });
        if (requiredPendants.length > 3) {
            log(`Too many pendants! Can't place crystals.`)
            return false;
        }

        let pendItems = new ItemCollection();
        pendItems.addItem(Item.get('PendantOfCourage', world)!);
        pendItems.addItem(Item.get('PendantOfWisdom', world)!);
        pendItems.addItem(Item.get('PendantOfPower', world)!);
        if (world.locations.get('Master Sword Pedestal')?.item) {
            pendItems.addItem(world.locations.get('Master Sword Pedestal')?.item!);
        }
        if (world.locations.get('Sahasrahla')?.item) {
            pendItems.addItem(world.locations.get('Sahasrahla')?.item!);
        }
        const nonPendItems = items.diff(pendItems);
        world.regions.forEach(region => {
            if (region.prize && region.prize.isCrystalPendant && !canComplete(region, world.locations, nonPendItems)) {
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

        return noDoubles;
    }

    // TODO: Implement
    export function canPlaceBosses(): boolean {
        return true;
    }


    export function canPlaceMedallions(world: World, items:ItemCollection): boolean {
        return canPlaceMedallion(world, "Misery Mire Medallion", items) && canPlaceMedallion(world, "Turtle Rock Medallion", items);
    }
    
    export function canPlaceMedallion(world: World, location: string,items: ItemCollection): boolean {
        let haveMedallion = false;
        let medallion = world.locations.get(location);
        if (!medallion || !medallion.item) {
            console.log(items);
            haveMedallion = items.has('Bombos') || items.has('Ether') || items.has('Quake');
            log(`${location} not set. HaveMedallion based on any medallion: ${haveMedallion}`);
        }
        else {
            haveMedallion = items.has(medallion.item.name);
            log(`${location} is ${medallion.item.name}. HaveMedallion: ${haveMedallion}`);
        }
        return haveMedallion;
    }

    export function log(message: string) {
        if (messages) messages.push(message); else console.log(message);
    }
}
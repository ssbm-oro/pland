import Item, { type IItem } from "./Item";
import type { ILocation, Z3rLocation } from "./Location";
import { ItemCollection } from "./Support/ItemCollection";
import { LocationCollection } from "./Support/LocationCollection";
import type World from "./World";
import { items } from '$lib/data/json/alttpr-customizer-schema.json';

export function checkPlants(world: World, selectedItems: IItem[], selectedLocations: ILocation[]) {
    world.messages = [];
    let logicTestResult = false;
    try {
        let plantable = true;
        let available = new ItemCollection([
            Item.get('RescueZelda',world)!,
            Item.get('Crystal1',world)!,
            Item.get('Crystal2',world)!,
            Item.get('Crystal3',world)!,
            Item.get('Crystal4',world)!,
            Item.get('Crystal5',world)!,
            Item.get('Crystal6',world)!,
            Item.get('Crystal7',world)!,
            Item.get('PendantOfWisdom',world)!,
            Item.get('PendantOfCourage',world)!,
            Item.get('PendantOfPower',world)!,
            Item.get('DefeatAgahnim',world)!,
            Item.get('DefeatAgahnim2',world)!,
        ], world.log);
        available.setChecksForWorld(world);
        let planted = new LocationCollection();

        items.forEach(item => {
            if (item.count && item.count > 0)
            {
                let itemObj = Item.get(item.value, world);
                if (!itemObj)
                    itemObj = Item.get(item.value.slice(0, -2), world);
                
                if (itemObj) {
                    for(let i = 0; i < item.count; i++) {
                        available.addItem(itemObj);
                    }
                }
            }
        });

        world.resetPlants();

        for(let i = 0; i < selectedItems.length; i++) {
            const location = world.locations.get(selectedLocations[i]!.name)!;
            const item = selectedItems[i]!;
            world.log(`Attempting to plant ${item.value} in ${location.name}.`);
            if (!available.has(item.value.slice(0,-2))) {
                world.log(`${item.value} not available to plant.`);
                plantable = false;
                break;
            }

            if (location.hasItem() && !location.hasItem(item)) {
                world.log(`${location.name} already has item planted: ${location.item?.name}.`);
                plantable = false;
                break;
            }

            available.removeItem(item);

            plantable = plantable && location.canFill(item, available, true, planted)!;

            if (!plantable) {
                world.log(`Could not plant ${item.name} in ${location.name}.`)
                break;
            }
            else {
                if (location.fill(item, available)) {
                    world.log(`Planted ${item.name} at ${location.name}.`)
                    planted.addItem(location);
                }
                else {
                    world.log(`Unknown error occurred. Could not Plant ${item.name} in ${location.name}.`);
                }
            }
        }

        if (plantable) {
            planted.to_array().map(location => location as Z3rLocation).forEach(location => {
                if (location.region.canEnter(world.locations, available) && location.canAccess(available) && location.item) {
                    available.addItem(location.item);
                }
            });
            plantable &&= world.canPlaceMedallions(available);
            plantable &&= world.canPlaceBosses();
            plantable &&= world.canPlacePrizes(available);
        }

        logicTestResult = plantable;
    }
    catch (err:any) {
        world.log(err);
    }
    finally {
        return {
            plantable: logicTestResult,
            messages: world.messages
        }
    }
}
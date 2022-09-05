import Item, { type IItem } from "./Item";
import type { ILocation, Z3rLocation } from "./Location";
import { ItemCollection } from "./Support/ItemCollection";
import { LocationCollection } from "./Support/LocationCollection";
import type World from "./World";
import { items } from '$lib/data/json/alttpr-customizer-schema.json';

export function checkPlants(world: World, selectedItems: IItem[], selectedLocations: ILocation[]) {
    messages = [];
    let logicTestResult = false;
    try {
        if (selectedItems.length != selectedLocations.length) {
            throw Error('Different lengths of item array and location array received!')
        }
        let plantable = true;
        const available = new ItemCollection([
            Item.get('RescueZelda',world.id)!,
            Item.get('Crystal1',world.id)!,
            Item.get('Crystal2',world.id)!,
            Item.get('Crystal3',world.id)!,
            Item.get('Crystal4',world.id)!,
            Item.get('Crystal5',world.id)!,
            Item.get('Crystal6',world.id)!,
            Item.get('Crystal7',world.id)!,
            Item.get('PendantOfWisdom',world.id)!,
            Item.get('PendantOfCourage',world.id)!,
            Item.get('PendantOfPower',world.id)!,
            Item.get('DefeatAgahnim2',world.id)!,
        ]);
        available.setChecksForWorld(world.id);
        const planted = new LocationCollection([]);

        items.forEach(item => {
            if (item.count && item.count > 0)
            {
                let itemObj = Item.get(item.value, world.id);
                if (!itemObj)
                    itemObj = Item.get(item.value.slice(0, -2), world.id);
                
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
            log(`Attempting to plant ${item.value} in ${location.name}.`);
            if (!available.has(item.value.slice(0,-2))) {
                log(`${item.value} not available to plant.`);
                plantable = false;
                break;
            }

            if (location.hasItem() && !location.hasItem(item)) {
                log(`${location.name} already has item planted: ${location.item?.name}.`);
                plantable = false;
                break;
            }

            log(...planted.to_array().map(location => `${location.item?.name} is planted at ${location.name}`))


            available.removeItem(item);

            const canFill = location.canFill(item, available, true);
            plantable = plantable && canFill

            log(`canFill is ${canFill} here in the 73`)

            let recheck = true;
            const availableItems: IItem[] = []
            const availablePlants: Z3rLocation[] = []
            while (recheck) {
                recheck = false;
                // if another item is in logic, we can get use it to plant this item
                planted.LocationsWithItem().forEach(location => {
                    log(`checking if ${location.name} can be accessed to get ${location.item?.name}`)
                    if (location.canAccess(available, planted, location.item, [])) {
                        log(`could access, adding ${location.item?.name}.`)
                        available.addItem(location.item!);
                        availableItems.push(location.item!);
                        recheck = true;
                        availablePlants.push(location);
                        planted.removeItem(location);
                    }
                });

            }

            plantable = location.canFill(item, available, true);


            availablePlants.forEach(location => {
                // log(`chceking ${location.name} plantable was ${plantable}`)
                // plantable &&= location.requirement_callback? location.requirement_callback(item, planted, available, []) : true;
                // log(`plantable is ${plantable}`)
                planted.addItem(location);
            })

            // remove the planted items for next iteration
            availableItems.forEach(item => {
                available.removeItem(item);
            })
            

            if (!plantable) {
                log(`Could not plant ${item.name} in ${location.name}.`)
                break;
            }
            else {
                if (location.fill(item, available)) {
                    log(`Planted ${item.name} at ${location.name}.`)
                    planted.addItem(location);

                }
                else {
                    log(`Unknown error occurred. Could not Plant ${item.name} in ${location.name}.`);
                }
            }

        }

        plantable &&= planted.to_array().every((location, index) => {
            if (index == planted.getCount() - 1) return true;
            log(`checking ${location.name} with ${location.item?.name}`)
            return (location.requirement_callback ? location?.requirement_callback(location.item, world.locations, available, []) : true)
        });

        if (plantable) {

            let recheck = true;
            while (recheck) {
                recheck = false;
                // We already checked and saw we can plant them? Surely that means we can access them...
                planted.to_array().map(location => location as Z3rLocation).forEach(location => {
                    log(`checking if planted item at ${location.name} is accessible.`)
                    if (location.region.canEnter(world.locations, available) && location.canAccess(available, planted, location.item) && location.item && (location.requirement_callback ? location.requirement_callback(location.item, world.locations, available, []): true)) {
                        log(`${location.name} is accessible so adding ${location.item.name} to available items`)
                        available.addItem(location.item);
                        planted.removeItem(location);
                    }
                    else {
                        log(`${location.name} was not accessible so ${location.item?.name} is not being added to available.`)
                        recheck = false
                    }
                });
            }

            // planted.forEach(location => available.addItem(location.item!))

            plantable &&= world.canPlaceMedallions(available);
            plantable &&= world.canPlaceBosses();
            plantable &&= world.canPlacePrizes(available);
        }

        logicTestResult = plantable;
    }
    catch (err:any) {
        log(err);
    }
    return {
        plantable: logicTestResult,
        messages: messages
    }
}

let messages: string[] = [];

export function log(...newMessages: string[]) {
    messages.push(...newMessages);
}
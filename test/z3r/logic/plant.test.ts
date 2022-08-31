import { describe, expect, it } from "vitest";
import fs from "fs";
import World from "../../../src/lib/z3r/logic/World";
import Open from "../../../src/lib/z3r/logic/World/Open";
import { ItemCollection } from "../../../src/lib/z3r/logic/Support/ItemCollection";
import Item from "../../../src/lib/z3r/logic/Item";
import { Z3rLocation } from "../../../src/lib/z3r/logic/Location";
import { LocationCollection } from "../../../src/lib/z3r/logic/Support/LocationCollection";
import { items as itemPool } from '../../../src/lib/data/json/alttpr-customizer-schema.json';

describe("Sample Logic Bombs", () =>{
    it("Mire and TR Can't Have all the swords", () => {
        let messages: string[] = [];
        let preset = JSON.parse(fs.readFileSync("static/presets/open.json").toString());
        let world: World = new Open(preset.settings, messages);
        let planted = new LocationCollection([]);
        
        let available = get_available_items(world);
        let plantable = true;
        
        plantable &&= test_plant(
            world,
            available,
            Item.get('ProgressiveSword', world)!,
            world.locations.get('Misery Mire - Big Chest')!,
            planted,
            messages);
        expect(plantable).toBe(true);

        plantable &&= test_plant(
            world,
            available,
            Item.get('ProgressiveSword', world)!,
            world.locations.get('Misery Mire - Spike Chest')!,
            planted,
            messages);
        expect(plantable).toBe(true);

        plantable &&= test_plant(
            world,
            available,
            Item.get('ProgressiveSword', world)!,
            world.locations.get('Turtle Rock - Big Chest')!,
            planted,
            messages);
        expect(plantable).toBe(true);

        plantable &&= test_plant(
            world,
            available,
            Item.get('ProgressiveSword', world)!,
            world.locations.get('Turtle Rock - Chain Chomps')!,
            planted,
            messages);
        
        expect(plantable).toBe(false);
    })
});

function finalize_plants(plantable: boolean, planted: LocationCollection, world: World, available: ItemCollection) {
    if (plantable) {
        planted.to_array().forEach(location => {
            if (location.region.canEnter(world.locations, available) && location.canAccess(available) && location.item) {
                available.addItem(location.item);
            }
        });
        plantable &&= world.canPlaceMedallions(available);
        plantable &&= world.canPlaceBosses();
        plantable &&= world.canPlacePrizes(available);
    }
    return plantable;
}

function test_plant(world: World, available: ItemCollection, item: Item, location: Z3rLocation, planted: LocationCollection, messages:string[] = []) {
    let plantable = true;
    messages.push(`Attempting to plant ${item.name} in ${location.name}.`);
    if (!available.has(item.name)) {
        messages.push(`${item.name} not available to plant.`);
        return false;
    }
    if (location.hasItem() && !location.hasItem(item)) {
        messages.push(`${location.name} already has item planted: ${location.item?.name}.`);
        return false;
    }
    available.removeItem(item);

    plantable = plantable && location.canFill(item, available, true, planted)!;

    if (!plantable) {
        messages.push(`Could not plant ${item.name} in ${location.name}.`)
        return false;
    }
    else {
        if (location.fill(item, available)) {
            messages.push(`Planted ${item.name} at ${location.name}.`)
            planted.addItem(location);
        }
        else {
            messages.push(`Unknown error occurred. Could not Plant ${item.name} in ${location.name}.`);
        }
    }

    return plantable;
}

function get_available_items(world: World) {
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
    ]);

    itemPool.forEach(item => {
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

    available.setChecksForWorld(world);
    return available;
}
import Item from "$lib/z3r/logic/item";
import { Chest } from "$lib/z3r/logic/Location/chest";
import { Event } from "$lib/z3r/logic/Location/Prize/event";
import { Standing } from "$lib/z3r/logic/Location/standing";
import { Region } from "$lib/z3r/logic/region";
import type { ItemCollection } from "$lib/z3r/logic/Support/itemcollection";
import { LocationCollection } from "$lib/z3r/logic/Support/locationcollection";
import type World from "$lib/z3r/logic/world";

export class NorthEast extends Region {
    public constructor(world: World) {
        super("Dark World", world);

        this.locations = new LocationCollection([
            new Standing("Catfish", this),
            new Standing("Pyramid", this),
            new Chest("Pyramid Fairy - Left", this),
            new Chest("Pyramid Fairy - Right", this),
            new Event("Ganon", this)
        ]);
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Ganon")!;
        this.prize.setItem(Item.get("DefeatGanon", world)!);
    }

    override initialize(): Region {
        this.locations.get("Catfish")?.setRequirements((locations, items) => {
            return items.canLiftRocks();
        });

        const pyramidRequirements = (locations:LocationCollection, items:ItemCollection) => {
            return items.has("Crystal5") && items.has("Crystal6")
                && this.world.getRegion("South Dark World")!.canEnter(locations, items)
                && ((items.has("MoonPearl") && items.has("Hammer"))
                    || (items.has("Mirror") && (items.has("DefeatAgahnim"))))
        }

        this.locations.get("Pyramid Fairy - Left")?.setRequirements(pyramidRequirements);
        this.locations.get("Pyramid Fairy - Right")?.setRequirements(pyramidRequirements);

        this.can_enter = (locations, items) => {
            return items.has("RescueZelda")
                && (items.has("DefeatAgahnim")
                    || (items.has("Hammer") && items.canLiftRocks() && items.has("MoonPearl"))
                    || (items.canLiftDarkRocks() && items.has("MoonPearl") && (items.has("Hammer") || items.has("Flippers"))))
        }

        // TODO: Add ganon logic


        return this;
    }
}
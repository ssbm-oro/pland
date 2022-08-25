import Item from "$lib/z3r/logic/Item";
import { Chest, Event, Standing } from "$lib/z3r/logic/Location";
import  Region from "$lib/z3r/logic/Region";
import type { ItemCollection } from "$lib/z3r/logic/Support/ItemCollection";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

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
        this.locations.setChecksForWorld(world);

        this.prize = this.locations.get("Ganon")!;
        this.prize.setItem(Item.get("DefeatGanon", world)!);
    }

    override initialize() {
        this.locations.get("Catfish")?.setRequirements((_locations, items) => {
            return items.canLiftRocks();
        });

        const pyramidRequirements = (locations: LocationCollection, items: ItemCollection) => {
            return items.has("Crystal5") && items.has("Crystal6")
                && this.world.getRegion("South Dark World")!.canEnter(locations, items)
                && ((items.has("MoonPearl") && items.has("Hammer"))
                    || (items.has("MagicMirror") && (items.has("DefeatAgahnim"))))
        }

        this.locations.get("Pyramid Fairy - Left")?.setRequirements(pyramidRequirements);
        this.locations.get("Pyramid Fairy - Right")?.setRequirements(pyramidRequirements);

        this.can_enter = (_locations, items) => {
            return items.has("RescueZelda")
                && (items.has("DefeatAgahnim")
                    || (items.has("Hammer") && items.canLiftRocks() && items.has("MoonPearl"))
                    || (items.canLiftDarkRocks() && items.has("MoonPearl") && (items.has("Hammer") || items.has("Flippers"))))
        }

        // TODO: Add ganon logic


        return this;
    }
}
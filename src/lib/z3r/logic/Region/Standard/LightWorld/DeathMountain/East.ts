import { Chest, Standing } from "$lib/z3r/logic/Location";
import Region from "$lib/z3r/logic/Region";
import type { ItemCollection } from "$lib/z3r/logic/Support/ItemCollection";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class East extends Region {
    public constructor(world: World) {
        super("Death Mountain", world);

        this.locations = new LocationCollection([
            new Chest("Spiral Cave", this),
            new Chest("Mimic Cave", this),
            new Chest("Paradox Cave Lower - Far Left", this),
            new Chest("Paradox Cave Lower - Left", this),
            new Chest("Paradox Cave Lower - Right", this),
            new Chest("Paradox Cave Lower - Far Right", this),
            new Chest("Paradox Cave Lower - Middle", this),
            new Chest("Paradox Cave Upper - Left", this),
            new Chest("Paradox Cave Upper - Right", this),
            new Standing("Floating Island", this)
        ]);
        this.locations.setChecksForWorld(world.id);
    }

    override initialize() {
        this.locations.get("Mimic Cave")?.setRequirements((item, locations, items, items_checked) => {
            return items.hasOrCanGet("Hammer", locations, item, items_checked) && items.hasOrCanGet("MagicMirror", locations, item, items_checked)
                && (items.has("KeyD7", 2) && this.world.getRegion("Turtle Rock")!.canEnter(locations, items));
        });

        this.locations.get("Floating Island")?.setRequirements((item, locations, items, items_checked) => {
            return (items.hasOrCanGet("MagicMirror", locations, item, items_checked)
                && (items.hasOrCanGet("MoonPearl", locations, item, items_checked) && (items.canBombThings()) && items.canLiftRocks())
                && this.world.getRegion("East Dark World Death Mountain")!.canEnter(locations, items));
        });

        this.can_enter = (locations: LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda")
                && ((items.has("MagicMirror") || items.has("Hookshot")) && this.world.getRegion("West Death Mountain")!.canEnter(locations, items))
                || (items.has("Hammer") && this.world.getRegion("Tower of Hera")!.canEnter(locations, items));
        }

        return this;
    }
}
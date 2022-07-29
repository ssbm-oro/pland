import { Chest } from "$lib/z3r/logic/Location/chest";
import { Standing } from "$lib/z3r/logic/Location/standing";
import { Region } from "$lib/z3r/logic/region";
import type { ItemCollection } from "$lib/z3r/logic/Support/itemcollection";
import { LocationCollection } from "$lib/z3r/logic/Support/locationcollection";
import type World from "$lib/z3r/logic/world";

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

    override initialize(): Region {
        this.locations.get("Mimic Cave")?.setRequirements((locations, items) => {
            return items.has("Hammer") && items.has("MagicMirror")
                && (items.has("KeyD7", 2) && this.world.getRegion("Turtle Rock")!.canEnter(locations, items));
        });

        this.locations.get("Floating Island")?.setRequirements((locations, items) => {
            return (items.has("MagicMirror")
                && (items.has("MoonPearl") && (items.canBombThings()) && items.canLiftRocks())
                && this.world.getRegion("East Dark Death Mountain")!.canEnter(locations, items));
        });

        this.can_enter = (locations: LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda")
                && ((items.has("MagicMirror") || items.has("Hookshot")) && this.world.getRegion("West Death Mountain")!.canEnter(locations, items))
                || (items.has("Hammer") && this.world.getRegion("Tower of Hera")!.canEnter(locations, items));
        }

        return this;
    }
}
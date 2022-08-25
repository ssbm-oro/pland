import { Chest } from "$lib/z3r/logic/Location";
import Region from "$lib/z3r/logic/Region";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class Mire extends Region {
    public constructor(world: World) {
        super("Mire", world);

        this.locations = new LocationCollection([
            new Chest("Mire Shed - Left", this),
            new Chest("Mire Shed - Right", this)
        ]);
        this.locations.setChecksForWorld(world);
    }

    override initialize() {
        this.locations.get("Mire Shed - Left")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.locations.get("Mire Shed - Right")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.can_enter = (locations, items) => {
            this.world.log(`Checking access for Mire Area. Moon Pearl: ${items.has("MoonPearl")}`)
            return items.has("MoonPearl")
                && items.canLiftDarkRocks() && items.canFly(this.world);
        };

        return this;
    }

}
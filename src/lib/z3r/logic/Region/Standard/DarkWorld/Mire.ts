import { Chest } from "$lib/z3r/logic/Location";
import { log } from "$lib/z3r/logic/Logic";
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
        this.locations.setChecksForWorld(world.id);
    }

    override initialize() {
        this.locations.get("Mire Shed - Left")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked);
        });

        this.locations.get("Mire Shed - Right")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked);
        });

        this.can_enter = (locations, items, item, locations_checked) => {
            log(`Checking access for Mire Area. Moon Pearl: ${items.has("MoonPearl")}`)
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked)
                && items.canLiftDarkRocks() && items.canFly(this.world);
        };

        return this;
    }

}
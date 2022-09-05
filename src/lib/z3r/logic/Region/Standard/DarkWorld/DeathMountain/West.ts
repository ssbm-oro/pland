import { Chest } from "$lib/z3r/logic/Location";
import Region from "$lib/z3r/logic/Region";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class West extends Region {
    public constructor(world: World) {
        super("Dark World", world);

        this.locations = new LocationCollection([
            new Chest("Spike Cave", this)
        ]);
        this.locations.setChecksForWorld(world.id);
    }

    public override initialize() {
        this.locations.get("Spike Cave")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked) && items.hasOrCanGet("Hammer", locations, item, locations_checked) && items.canLiftRocks()
                    && ((items.canExtendMagic() && items.hasOrCanGet("Cape", locations, item, locations_checked)) || items.hasOrCanGet("CaneOfByrna", locations, item, locations_checked));
        });

        this.can_enter = (locations, items, item, locations_checked) => {
            return (items.has("RescueZelda")
                && this.world.getRegion("West Death Mountain")!.canEnter(locations, items, item, locations_checked));
        };

        return this;
    }
}
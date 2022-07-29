import { Chest } from "$lib/z3r/logic/Location/chest";
import { Region } from "$lib/z3r/logic/region";
import { LocationCollection } from "$lib/z3r/logic/Support/locationcollection";
import type World from "$lib/z3r/logic/world";

export class West extends Region {
    public constructor(world: World) {
        super("Dark World", world);

        this.locations = new LocationCollection([
            new Chest("Spike Cave", this)
        ]);
        this.locations.setChecksForWorld(world.id);
    }

    public override initialize(): Region {
        this.locations.get("Spike Cave")?.setRequirements((locations, items) => {
            return (items.has("MoonPearl") && items.has("Hammer") && items.canLiftRocks()
                    && (items.canExtendMagic() && items.has("Cape")) || items.has("CaneOfByrna"));
        });

        this.can_enter = (locations, items) => {
            return (items.has("RescueZelda")
                && this.world.getRegion("West Death Mountain")!.canEnter(locations, items));
        };

        return this;
    }
}
import { Ether, Npc, Standing } from "$lib/z3r/logic/Location";
import Region from "$lib/z3r/logic/Region";
import type { ItemCollection } from "$lib/z3r/logic/Support/ItemCollection";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class West extends Region {
    public constructor(world: World) {
        super("Death Mountain", world);

        this.locations = new LocationCollection([
            new Npc("Old Man", this),
            new Standing("Spectacle Rock Cave", this),
            new Ether("Ether Tablet", this),
            new Standing("Spectacle Rock", this)
        ]);
        this.locations.setChecksForWorld(world.id);
    }

    override initialize() {
        this.locations.get("Old Man")?.setRequirements((item, locations, items) => {
            return items.hasOrCanGet("Lamp", locations, item);
        });

        this.locations.get("Ether Tablet")?.setRequirements((item, locations, items) => {
            return items.hasOrCanGet("BookOfMudora", locations, item) && items.hasSword(2)
                && this.world.getRegion("Tower of Hera")?.canEnter(locations, items) || false;
        });

        this.locations.get("Spectacle Rock")?.setRequirements((item, locations, items) => {
            return items.hasOrCanGet("MagicMirror", locations, item);
        });

        this.can_enter = (locations:LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda")
                && (items.canFly(this.world)
                    || (items.canLiftRocks() && items.hasOrCanGet("Lamp", locations)));
        }

        return this;
    }
}
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
        this.locations.setChecksForWorld(world);
    }

    override initialize() {
        this.locations.get("Old Man")?.setRequirements((_item, _locations, items) => {
            return items.has("Lamp");
        });

        this.locations.get("Ether Tablet")?.setRequirements((_item, locations, items) => {
            return items.has("BookOfMudora") && items.hasSword(2)
                && this.world.getRegion("Tower of Hera")!.canEnter(locations, items);
        });

        this.locations.get("Spectacle Rock")?.setRequirements((_item, _locations, items) => {
            return items.has("MagicMirror");
        });

        this.can_enter = (_locations:LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda")
                && (items.canFly(this.world)
                    || (items.canLiftRocks() && items.has("Lamp")));
        }

        return this;
    }
}
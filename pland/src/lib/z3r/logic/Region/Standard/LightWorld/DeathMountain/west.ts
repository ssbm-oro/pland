import { Ether } from "$lib/z3r/logic/Location/Drop/ether";
import { Npc } from "$lib/z3r/logic/Location/npc";
import { Standing } from "$lib/z3r/logic/Location/standing";
import { Region } from "$lib/z3r/logic/region";
import type { ItemCollection } from "$lib/z3r/logic/Support/itemcollection";
import { LocationCollection } from "$lib/z3r/logic/Support/locationcollection";
import type World from "$lib/z3r/logic/world";

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

    override initialize(): Region {
        this.locations.get("Old Man")?.setRequirements((locations, items) => {
            return items.has("Lamp");
        });

        this.locations.get("Ether Tablet")?.setRequirements((locations, items) => {
            return items.has("BookOfMudora") && items.hasSword(2)
                && this.world.getRegion("Tower of Hera")!.canEnter(locations, items);
        });

        this.locations.get("Spectacle Rock")?.setRequirements((locations, items) => {
            return items.has("MagicMirror");
        });

        this.can_enter = (locations:LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda")
                && (items.canFly(this.world)
                    || (items.canLiftRocks() && items.has("Lamp")));
        }

        return this;
    }
}
import { Chest, Npc, Standing } from "$lib/z3r/logic/Location";
import Region from "$lib/z3r/logic/Region";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class NorthWest extends Region {
    public constructor(world: World) {
        super("Dark World", world);

        this.locations = new LocationCollection([
            new Chest("Brewery", this),
            new Chest("C-Shaped House", this),
            new Chest("Chest Game", this),
            new Standing("Hammer Pegs", this),
            new Standing("Bumper Cave", this),
            new Npc("Blacksmith", this),
            new Npc("Purple Chest", this)
        ]);
        this.locations.setChecksForWorld(world.id);
    }

    public override initialize() {
        this.locations.get("Brewery")?.setRequirements((item, locations, items, locations_checked) => {
            return items.canBombThings() && items.hasOrCanGet("MoonPearl", locations, item, locations_checked);
        });

        this.locations.get("C-Shaped House")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked);
        });

        this.locations.get("Chest Game")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked);
        });

        this.locations.get("Hammer Pegs")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("Hammer", locations, item, locations_checked) && items.hasOrCanGet("MoonPearl", locations, item, locations_checked) && items.canLiftDarkRocks();
        });

        this.locations.get("Bumper Cave")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked) && items.hasOrCanGet("Cape", locations, item, locations_checked) && items.canLiftRocks();
        });

        this.locations.get("Blacksmith")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked) && items.canLiftDarkRocks();
        });

        this.locations.get("Purple Chest")?.setRequirements((item, locations, items, locations_checked) => {
            return locations.get("Blacksmith")?.canAccess(items, locations, item)
                && (items.hasOrCanGet("MoonPearl", locations, item, locations_checked) && items.canLiftDarkRocks());
        });

        this.can_enter = (locations, items, item, locations_checked) => {
            return items.has("RescueZelda")
                && (items.hasOrCanGet("MoonPearl", locations, item, locations_checked)
                    && ((this.world.getRegion("North East Dark World")?.canEnter(locations, items, item, locations_checked)
                        && ((items.hasOrCanGet("Hookshot", locations, item, locations_checked) && (items.canLiftRocks() || items.hasOrCanGet("Hammer", locations, item, locations_checked) || items.hasOrCanGet("Flippers", locations, item, locations_checked))))))
                    || (items.hasOrCanGet("Hammer", locations, item, locations_checked) && items.canLiftRocks())
                    || (items.canLiftDarkRocks()))
        }

        return this;
    }
}
import type { IItem } from "$lib/z3r/logic/Item";
import { Chest } from "$lib/z3r/logic/Location";
import Region from "$lib/z3r/logic/Region";
import type { ItemCollection } from "$lib/z3r/logic/Support/ItemCollection";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class East extends Region {
    public constructor(world: World) {
        super("Dark World", world);

        this.locations = new LocationCollection([
            new Chest("Super Bunny Cave - Top", this),
            new Chest("Super Bunny Cave - Bottom", this),
            new Chest("Hookshot Cave - Top Right", this),
            new Chest("Hookshot Cave - Top Left", this),
            new Chest("Hookshot Cave - Bottom Left", this),
            new Chest("Hookshot Cave - Bottom Right", this),
        ]);
        this.locations.setChecksForWorld(world.id);
    }

    public override initialize() {
        this.locations.get("Super Bunny Cave - Top")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked);
        });

        this.locations.get("Super Bunny Cave - Bottom")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked);
        });

        const hookshotCaveRequirements = (item: IItem | null, locations: LocationCollection, items: ItemCollection, locations_checked:string[]) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked) && items.canLiftRocks() && items.hasOrCanGet("Hookshot", locations, item, locations_checked);
        }

        this.locations.get("Hookshot Cave - Top Right")?.setRequirements(hookshotCaveRequirements);
        this.locations.get("Hookshot Cave - Top Left")?.setRequirements(hookshotCaveRequirements);
        this.locations.get("Hookshot Cave - Bottom Left")?.setRequirements(hookshotCaveRequirements);

        this.locations.get("Hookshot Cave - Bottom Right")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, locations_checked) && items.canLiftRocks() && (items.hasOrCanGet("Hookshot", locations, item, locations_checked) || items.hasOrCanGet("PegasusBoots", locations, item, locations_checked));
        });

        this.can_enter = (locations, items, item, locations_checked) => {
            return items.has("RescueZelda") && items.has('MoonPearl')
                && (items.canLiftDarkRocks() && this.world.getRegion("East Death Mountain")!.canEnter(locations, items, item, locations_checked));
        };

        return this;
    }
}
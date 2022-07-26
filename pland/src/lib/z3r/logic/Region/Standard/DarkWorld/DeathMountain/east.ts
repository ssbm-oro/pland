import { Chest } from "$lib/z3r/logic/Location/chest";
import { Region } from "$lib/z3r/logic/region";
import type { ItemCollection } from "$lib/z3r/logic/Support/itemcollection";
import { LocationCollection } from "$lib/z3r/logic/Support/locationcollection";
import type { World } from "$lib/z3r/logic/world";

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

    public override initialize(): Region {
        this.locations.get("Super Bunny Cave - Top")?.setRequirements((locations, items) => {
            return items.has("Moon Pearl")
        });

        this.locations.get("Super Bunny Cave - Bottom")?.setRequirements((locations, items) => {
            return items.has("Moon Pearl")
        });

        const hookshotCaveRequirements = (locations: LocationCollection, items: ItemCollection) => {
            return items.has("MoonPearl") && items.canLiftRocks() && items.has("Hookshot");
        }

        this.locations.get("Hookshot Cave - Top Right")?.setRequirements(hookshotCaveRequirements);
        this.locations.get("Hookshot Cave - Top Left")?.setRequirements(hookshotCaveRequirements);
        this.locations.get("Hookshot Cave - Bottom Left")?.setRequirements(hookshotCaveRequirements);

        this.locations.get("Hookshot Cave - Bottom Right")?.setRequirements((locations, items) => {
            return items.has("MoonPearl") && items.canLiftRocks() && (items.has("Hookshot") || items.has("PegasusBoots"));
        });

        this.canEnter = (locations, items) => {
            return items.has("RescueZelda")
                && (items.canLiftDarkRocks() && this.world.getRegion("East Death Mountain")!.canEnter(locations, items));
        };

        return this;
    }
}
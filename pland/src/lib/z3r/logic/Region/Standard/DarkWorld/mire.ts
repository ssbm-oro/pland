import { Chest } from "$lib/z3r/logic/Location/chest";
import { Region } from "$lib/z3r/logic/region";
import { LocationCollection } from "$lib/z3r/logic/Support/locationcollection";
import type World from "$lib/z3r/logic/world";

export class Mire extends Region {
    public constructor(world: World, messages: string[]|null = null) {
        super("Mire", world, messages);

        this.locations = new LocationCollection([
            new Chest("Mire Shed - Left", this),
            new Chest("Mire Shed - Right", this)
        ]);
        this.locations.setChecksForWorld(world.id);
    }

    override initialize(): Region {
        this.locations.get("Mire Shed - Left")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.locations.get("Mire Shed - Right")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.can_enter = (locations, items) => {
            this.log(`Checking access for Mire Area. Moon Pearl: ${items.has("MoonPearl")}`)
            return items.has("MoonPearl")
                && items.canLiftDarkRocks() && items.canFly(this.world);
        };

        return this;
    }

}
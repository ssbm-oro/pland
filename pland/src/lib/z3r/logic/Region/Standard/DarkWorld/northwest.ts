import { Chest } from "$lib/z3r/logic/Location/chest";
import { Npc } from "$lib/z3r/logic/Location/npc";
import { Standing } from "$lib/z3r/logic/Location/standing";
import { Region } from "$lib/z3r/logic/region";
import { LocationCollection } from "$lib/z3r/logic/Support/locationcollection";
import type World from "$lib/z3r/logic/world";

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

    public override initialize(): Region {
        this.locations.get("Brewery")?.setRequirements((locations, items) => {
            return items.canBombThings() && items.has("MoonPearl");
        });

        this.locations.get("C-Shaped House")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.locations.get("Chest Game")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.locations.get("Hammer Pegs")?.setRequirements((locations, items) => {
            return items.has("Hammer") && items.has("MoonPearl") && items.canLiftDarkRocks();
        });

        this.locations.get("Bumper Cave")?.setRequirements((locations, items) => {
            return items.has("MoonPearl") && items.has("Cape") && items.canLiftRocks();
        });

        this.locations.get("Blacksmith")?.setRequirements((locations, items) => {
            return items.has("MoonPearl") && items.canLiftDarkRocks();
        });

        this.locations.get("Purple Chest")?.setRequirements((locations, items) => {
            return locations.get("Blacksmith")?.canAccess(items, locations)!
                && (items.has("MoonPearl") && items.canLiftDarkRocks());
        });

        this.canEnter = (locations, items) => {
            return items.has("RescueZelda")
                && (items.has("MoonPearl")
                    && ((this.world.getRegion("North East Dark World")!.canEnter(locations, items)
                        && ((items.has("Hookshot") && (items.canLiftRocks() || items.has("Hammer") || items.has("Flippers"))))))
                    || (items.has("Hammer") && items.canLiftRocks())
                    || (items.canLiftDarkRocks()))
        }

        return this;
    }
}
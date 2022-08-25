import { Chest, Dig, Npc } from "$lib/z3r/logic/Location";
import Region from "$lib/z3r/logic/Region";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class South extends Region {
    public constructor(world: World) {
        super("Dark World", world);

        this.locations = new LocationCollection([
            new Chest("Hype Cave - Top", this),
            new Chest("Hype Cave - Middle Right", this),
            new Chest("Hype Cave - Middle Left", this),
            new Chest("Hype Cave - Bottom", this),
            new Npc("Stumpy", this),
            new Npc("Hype Cave - NPC", this),
            new Dig("Digging Game", this)
        ]);
        this.locations.setChecksForWorld(world);
    }

    public override initialize() {
        this.locations.get("Hype Cave - Top")?.setRequirements((_locations, items) => {
            return items.has("MoonPearl");
        });
        
        this.locations.get("Hype Cave - Middle Right")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.locations.get("Hype Cave - Middle Left")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.locations.get("Hype Cave - Bottom")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.locations.get("Hype Cave - NPC")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.locations.get("Hype Cave - Stumpy")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.locations.get("Hype Cave - Digging Game")?.setRequirements((locations, items) => {
            return items.has("MoonPearl");
        });

        this.can_enter = (locations, items) => {
            return items.has("RescueZelda")
                && (items.has("MoonPearl")
                    && (this.world.getRegion("North East Dark World")!.canEnter(locations, items) && items.has("Hammer"))
                || this.world.getRegion("North West Dark World")!.canEnter(locations, items));
        };

        return this;
    }
}
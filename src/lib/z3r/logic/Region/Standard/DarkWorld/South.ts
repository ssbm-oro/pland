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
        this.locations.setChecksForWorld(world.id);
    }

    public override initialize() {
        this.locations.get("Hype Cave - Top")?.setRequirements((item, locations, items, items_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, items_checked);
        });
        
        this.locations.get("Hype Cave - Middle Right")?.setRequirements((item, locations, items, items_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, items_checked);
        });

        this.locations.get("Hype Cave - Middle Left")?.setRequirements((item, locations, items, items_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, items_checked);
        });

        this.locations.get("Hype Cave - Bottom")?.setRequirements((item, locations, items, items_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, items_checked);
        });

        this.locations.get("Hype Cave - NPC")?.setRequirements((item, locations, items, items_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, items_checked);
        });

        this.locations.get("Stumpy")?.setRequirements((item, locations, items, items_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, items_checked);
        });

        this.locations.get("Digging Game")?.setRequirements((item, locations, items, items_checked) => {
            return items.hasOrCanGet("MoonPearl", locations, item, items_checked);
        });

        this.can_enter = (locations, items) => {
            return items.has("RescueZelda")
                && (items.has("MoonPearl")
                    && (this.world.getRegion("North East Dark World")?.canEnter(locations, items) && items.has("Hammer"))
                || this.world.getRegion("North West Dark World")?.canEnter(locations, items)) || false;
        };

        return this;
    }
}
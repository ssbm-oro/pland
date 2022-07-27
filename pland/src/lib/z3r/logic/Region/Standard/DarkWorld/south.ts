import { Chest } from "$lib/z3r/logic/Location/chest";
import { Dig } from "$lib/z3r/logic/Location/dig";
import { Npc } from "$lib/z3r/logic/Location/npc";
import { Region } from "$lib/z3r/logic/region";
import { LocationCollection } from "$lib/z3r/logic/Support/locationcollection";
import type World from "$lib/z3r/logic/world";

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

    public override initialize(): Region {
        this.locations.get("Hype Cave - Top")?.setRequirements((locations, items) => {
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

        this.canEnter = (locations, items) => {
            return items.has("RescueZelda")
                && (items.has("MoonPearl")
                    && (this.world.getRegion("North East Dark World")!.canEnter(locations, items) && items.has("Hammer"))
                || this.world.getRegion("North West Dark World")!.canEnter(locations, items));
        };

        return this;
    }
}
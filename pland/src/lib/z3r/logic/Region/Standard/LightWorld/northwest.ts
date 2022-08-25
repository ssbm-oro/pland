import { Chest, Npc, BugCatchingKid, Pedestal, Standing } from "$lib/z3r/logic/Location";
import Region from "$lib/z3r/logic/Region";
import type { ItemCollection } from "$lib/z3r/logic/Support/ItemCollection";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class NorthWest extends Region {
    public constructor(world: World) {
        super("Light World", world);

        this.locations = new LocationCollection([
            new Pedestal("Master Sword Pedestal", this),
            new Chest("King's Tomb", this),
            new Chest("Kakariko Tavern", this),
            new Chest("Chicken House", this),
            new Chest("Kakariko Well - Top", this),
            new Chest("Kakariko Well - Left", this),
            new Chest("Kakariko Well - Middle", this),
            new Chest("Kakariko Well - Right", this),
            new Chest("Kakariko Well - Bottom", this),
            new Chest("Blind's Hideout - Top", this),
            new Chest("Blind's Hideout - Left", this),
            new Chest("Blind's Hideout - Right", this),
            new Chest("Blind's Hideout - Far Left", this),
            new Chest("Blind's Hideout - Far Right", this),
            new Chest("Pegasus Rocks", this),
            new Npc("Bottle Merchant", this),
            new Npc("Magic Bat", this),
            new BugCatchingKid("Sick Kid", this),
            new Standing("Lost Woods Hideout", this),
            new Standing("Lumberjack Tree", this),
            new Standing("Graveyard Ledge", this),
            new Standing("Mushroom", this)
        ]);
        this.locations.setChecksForWorld(world);
    }

    public override initialize() {
        this.locations.get("Master Sword Pedestal")?.setRequirements((locations, items) => {
            return items.has("PendantOfPower") && items.has("PendantOfWisdom") && items.has("PendantOfCourage");
        });

        this.locations.get("King's Tomb")?.setRequirements((locations, items) => {
            return items.has("PegasusBoots")
                && (items.canLiftDarkRocks()
                    || items.has("MagicMirror") && this.world.getRegion("North West Dark World")!.canEnter(locations, items));
        });

        this.locations.get("Pegasus Rocks")?.setRequirements((locations, items) => {
            return items.has("PegasusBoots")
        });

        this.locations.get("Magic Bat")?.setRequirements((locations, items) => {
            return items.has("Powder")
                && (items.has("Hammer")
                || (items.has("MagicMirror")
                    && items.has("MoonPearl") && this.world.getRegion("North West Dark World")!.canEnter(locations, items)));
        });

        this.locations.get("Sick Kid")?.setRequirements((locations, items) => {
            return items.hasABottle();
        });

        this.locations.get("Lumberjack Tree")?.setRequirements((locations, items) => {
            return items.has("DefeatAgahnim") && items.has("PegasusBoots");
        });

        this.locations.get("Graveyard Ledge")?.setRequirements((locations, items) => {
            return (items.has("MagicMirror") && this.world.getRegion("North West Dark World")!.canEnter(locations, items))
                && items.has("MoonPearl");
        });

        this.can_enter = (locations: LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda");
        }

        return this;
    }
}
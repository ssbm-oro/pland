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
        this.locations.setChecksForWorld(world.id);
    }

    public override initialize() {
        this.locations.get("Master Sword Pedestal")?.setRequirements((_item, _locations, items) => {
            return items.has("PendantOfPower") && items.has("PendantOfWisdom") && items.has("PendantOfCourage");
        });

        this.locations.get("King's Tomb")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("PegasusBoots", locations, item, locations_checked)
                && (items.canLiftDarkRocks()
                    || items.hasOrCanGet("MagicMirror", locations, item, locations_checked) && this.world.getRegion("North West Dark World")?.canEnter(locations, items, item, locations_checked) || false);
        });

        this.locations.get("Pegasus Rocks")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("PegasusBoots", locations, item, locations_checked)
        });

        this.locations.get("Magic Bat")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("Powder", locations, item, locations_checked)
                && (items.hasOrCanGet("Hammer", locations, item, locations_checked)
                || (items.hasOrCanGet("MagicMirror", locations, item, locations_checked)
                    && items.has("MoonPearl") && this.world.getRegion("North West Dark World")?.canEnter(locations, items, item, locations_checked) || false));
        });

        this.locations.get("Sick Kid")?.setRequirements((_item, _locations, items) => {
            return items.hasABottle();
        });

        this.locations.get("Lumberjack Tree")?.setRequirements((item, locations, items, locations_checked) => {
            return items.canDefeatAgahnim(this.world) && items.hasOrCanGet("PegasusBoots", locations, item, locations_checked);
        });

        this.locations.get("Graveyard Ledge")?.setRequirements((item, locations, items, locations_checked) => {
            return (items.hasOrCanGet("MagicMirror", locations, item, locations_checked) && this.world.getRegion("North West Dark World")?.canEnter(locations, items, item, locations_checked) || false)
                && items.hasOrCanGet("MoonPearl", locations, item, locations_checked);
        });

        this.can_enter = (_locations, items) => {
            return items.has("RescueZelda");
        }

        return this;
    }
}
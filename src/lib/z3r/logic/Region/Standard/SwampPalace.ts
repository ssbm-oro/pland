import Item from "../../Item";
import { Chest, BigChest, Drop, Crystal } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import { Bosses } from "../../Boss";

export class SwampPalace extends Dungeon {
    public constructor(world: World) {
        super("Swamp Palace", world,);

        this.region_items = [
            Item.get('BigKey', this.world.id)!,
            Item.get('BigKeyD2', this.world.id)!,
            Item.get('Compass', this.world.id)!,
            Item.get('CompassD2', this.world.id)!,
            Item.get('Key', this.world.id)!,
            Item.get('KeyD2', this.world.id)!,
            Item.get('Map', this.world.id)!,
            Item.get('MapD2', this.world.id)!
        ];

        this.boss = Bosses.get("Arrghus", world);

        this.locations = new LocationCollection([
            new Chest("Swamp Palace - Entrance", this),
            new BigChest("Swamp Palace - Big Chest", this),
            new Chest("Swamp Palace - Big Key Chest", this),
            new Chest("Swamp Palace - Map Chest", this),
            new Chest("Swamp Palace - West Chest", this),
            new Chest("Swamp Palace - Compass Chest", this),
            new Chest("Swamp Palace - Flooded Room - Left", this),
            new Chest("Swamp Palace - Flooded Room - Right", this),
            new Chest("Swamp Palace - Waterfall Room", this),
            new Drop("Swamp Palace - Boss", this),

            new Crystal("Swamp Palace - Prize", this)
        ]);
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Swamp Palace - Prize");
    }

    public override initialize() {
        this.locations.get("Swamp Palace - Big Chest")?.setRequirements((item, locations, items, locations_checked) => {
            return items.has("KeyD2")
                && items.hasOrCanGet("Hammer", locations, item, locations_checked)
                && items.has("BigKeyD2");
        });

        this.locations.get("Swamp Palace - Big Key Chest")?.setRequirements((item, locations, items, locations_checked) => {
            return items.has("KeyD2")
                && items.hasOrCanGet("Hammer", locations, item, locations_checked);
        });

        this.locations.get("Swamp Palace - Map Chest")?.setRequirements((_item, _locations, items) => {
            return items.has("KeyD2")
                && items.canBombThings();
        });

        this.locations.get("Swamp Palace - West Chest")?.setRequirements((item, locations, items, locations_checked) => {
            return items.has("KeyD2")
            && items.hasOrCanGet("Hammer", locations, item, locations_checked);
        });

        this.locations.get("Swamp Palace - Compass Chest")?.setRequirements((item, locations, items, locations_checked) => {
            return items.has("KeyD2")
            && items.hasOrCanGet("Hammer", locations, item, locations_checked);
        });

        this.locations.get("Swamp Palace - Compass Chest")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("Hookshot", locations, item, locations_checked)
                && items.has("KeyD2")
                && items.hasOrCanGet("Hammer", locations, item, locations_checked);
        });

        this.locations.get("Swamp Palace - Flooded Room - Left")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("Hookshot", locations, item, locations_checked)
                && items.has("KeyD2")
                && items.hasOrCanGet("Hammer", locations, item, locations_checked);
        });

        this.locations.get("Swamp Palace - Flooded Room - Right")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("Hookshot", locations, item, locations_checked)
                && items.has("KeyD2")
                && items.hasOrCanGet("Hammer", locations, item, locations_checked);
        });

        this.locations.get("Swamp Palace - Waterfall Room")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("Hookshot", locations, item, locations_checked)
                && items.has("KeyD2")
                && items.hasOrCanGet("Hammer", locations, item, locations_checked);
        });

        this.can_complete = (_locations, items) => {
            return this.locations.get("Swamp Palace - Boss")?.canAccess(items);
        }

        this.locations.get("Swamp Palace - Boss")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("Hookshot", locations, item, locations_checked)
                && items.has("KeyD2")
                && items.hasOrCanGet("Hammer", locations, item, locations_checked)
                && this.boss?.canBeat(items, locations, item, locations_checked) || false
        });

        this.can_enter = (locations, items, item, locations_checked) => {
            return items.has("RescueZelda")
                && items.hasOrCanGet("Flippers", locations, item, locations_checked)
                && (this.world.getRegion("South Dark World")?.canEnter(locations, items, item, locations_checked) || false)
                && items.hasOrCanGet("MoonPearl", locations, item, locations_checked)
                && items.hasOrCanGet("MagicMirror", locations, item, locations_checked);
        }

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items));

        return this;
    }
}
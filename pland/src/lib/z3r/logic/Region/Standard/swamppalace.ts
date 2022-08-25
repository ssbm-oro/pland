import Item from "../../Item";
import { BigKey, Compass, Key, Map } from "../../Item";
import { Chest, BigChest, Drop, Crystal } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import { Bosses } from "../../Boss";

export class SwampPalace extends Dungeon {
    override region_items: Item[] = [
        Item.get('BigKey', this.world)!,
        Item.get('BigKeyD2', this.world)!,
        Item.get('Compass', this.world)!,
        Item.get('CompassD2', this.world)!,
        Item.get('Key', this.world)!,
        Item.get('KeyD2', this.world)!,
        Item.get('Map', this.world)!,
        Item.get('MapD2', this.world)!
    ];

    public constructor(world: World) {
        super("Swamp Palace", world,);

        this.boss = Bosses.get("Arrghus", world);

        this.locations = new LocationCollection([
            new Chest("Swamp Palace - Entrance", this),
            new BigChest("Swamp Palace - Big Chest", this),
            new Chest("Swamp Palace - Big Key Chest", this),
            new Chest("Swamp Palace - Map Chest", this),
            new Chest("Swamp Palace - West Chest", this),
            new Chest("Swamp Palace - Compass Chest", this),
            new Chest("Swamp Palace - Flooed Room - Left", this),
            new Chest("Swamp Palace - Flooed Room - Right", this),
            new Chest("Swamp Palace - Waterfall Room", this),
            new Drop("Swamp Palace - Boss", this),

            new Crystal("Swamp Palace - Prize", this)
        ]);
        this.locations.setChecksForWorld(world);

        this.prize = this.locations.get("Swamp Palace - Prize")!;
    }

    public override initialize() {
        this.locations.get("Swamp Palace - Big Chest")?.setRequirements((_locations, items) => {
            return items.has("KeyD2")
                && items.has("Hammer")
                && items.has("BigKeyD2");
        });

        this.locations.get("Swamp Palace - Big Key Chest")?.setRequirements((_locations, items) => {
            return items.has("KeyD2")
                && items.has("Hammer");
        });

        this.locations.get("Swamp Palace - Map Chest")?.setRequirements((_locations, items) => {
            return items.has("KeyD2")
                && items.canBombThings();
        });

        this.locations.get("Swamp Palace - West Chest")?.setRequirements((_locations, items) => {
            return items.has("KeyD2")
                && items.has("Hammer");
        });

        this.locations.get("Swamp Palace - Compass Chest")?.setRequirements((_locations, items) => {
            return items.has("KeyD2")
                && items.has("Hammer");
        });

        this.locations.get("Swamp Palace - Compass Chest")?.setRequirements((_locations, items) => {
            return items.has("Hookshot")
                && items.has("KeyD2")
                && items.has("Hammer")
        });

        this.locations.get("Swamp Palace - Flooded Room - Left")?.setRequirements((_locations, items) => {
            return items.has("Hookshot")
                && items.has("KeyD2")
                && items.has("Hammer")
        });

        this.locations.get("Swamp Palace - Flooded Room - Right")?.setRequirements((_locations, items) => {
            return items.has("Hookshot")
                && items.has("KeyD2")
                && items.has("Hammer")
        });

        this.locations.get("Swamp Palace - Waterfall Room")?.setRequirements((_locations, items) => {
            return items.has("Hookshot")
                && items.has("KeyD2")
                && items.has("Hammer")
        });

        this.can_complete = (_locations, items) => {
            return this.locations.get("Swamp Palace - Boss")?.canAccess(items)!;
        }

        this.locations.get("Swamp Palace - Boss")?.setRequirements((locations, items) => {
            return items.has("Hookshot")
                && items.has("KeyD2")
                && items.has("Hammer")
                && this.boss?.canBeat(items, locations)!;
        });

        this.can_enter = (locations, items) => {
            return items.has("RescueZelda")
                && items.has("Flippers")
                && this.world.getRegion("South Dark World")!.canEnter(locations, items)
                && items.has("MoonPearl")
                && items.has("MagicMirror");
        }

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
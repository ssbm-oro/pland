import Item from "../../Item";
import { Chest, BigChest, Drop, Standing, Pendant } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import { Bosses } from "../../Boss";

export class TowerOfHera extends Dungeon {
    override region_items: Item[] = [
        Item.get('BigKey', this.world)!,
        Item.get('BigKeyP3', this.world)!,
        Item.get('Compass', this.world)!,
        Item.get('CompassP3', this.world)!,
        Item.get('Key', this.world)!,
        Item.get('KeyP3', this.world)!,
        Item.get('Map', this.world)!,
        Item.get('MapP3', this.world)!
    ];

    public constructor(world: World) {
        super("Tower of Hera", world,);

        this.boss = Bosses.get("Moldorm", world);

        this.locations = new LocationCollection([
            new Chest("Tower of Hera - Big Key Chest", this),
            new Standing("Tower of Hera - Basement Cage", this),
            new Chest ("Tower of Hera - Map Chest", this),
            new Chest ("Tower of Hera - Compass Chest", this),
            new BigChest ("Tower of Hera - Big Chest", this),
            new Drop ("Tower of Hera - Boss", this),

            new Pendant("Tower of Hera - Prize", this)
        ]);
        this.locations.setChecksForWorld(world);

        this.prize = this.locations.get("Tower of Hera - Prize")!
    }

    public override initialize() {
        this.locations.get("Tower of Hera - Big Key Chest")?.setRequirements((_locations, items) => {
            return items.canLightTorches() && items.has("KeyP3");
        });

        this.locations.get("Tower of Hera - Compass Chest")?.setRequirements((_locatinos, items) => {
            return items.has("BigKeyP3");
        })

        this.locations.get("Tower of Hera - Big Chest")?.setRequirements((_locatinos, items) => {
            return items.has("BigKeyP3");
        })

        this.can_complete = (locations, items) => {
            return this.locations.get("Tower of Hera - Boss")?.canAccess(items, locations)!;
        }

        this.locations.get("Tower of Hera - Boss")?.setRequirements((locations, items) => {
            return this.boss?.canBeat(items, locations)!
                && items.has("BigKeyP3");
        });

        this.can_enter = (locations, items) => {
            return items.has("RescueZelda")
                && (items.has("Magic Mirror")
                    || (items.has("Hookshot") && items.has("Hammer")
                        && this.world.getRegion("West Death Mountain")!.canEnter(locations, items)));
        };

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
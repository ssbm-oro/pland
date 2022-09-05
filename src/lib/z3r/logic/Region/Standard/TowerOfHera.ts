import Item from "../../Item";
import { Chest, BigChest, Drop, Standing, Pendant } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import { Bosses } from "../../Boss";

export class TowerOfHera extends Dungeon {
    public constructor(world: World) {
        super("Tower of Hera", world,);

        this.region_items = [
            Item.get('BigKey', this.world.id)!,
            Item.get('BigKeyP3', this.world.id)!,
            Item.get('Compass', this.world.id)!,
            Item.get('CompassP3', this.world.id)!,
            Item.get('Key', this.world.id)!,
            Item.get('KeyP3', this.world.id)!,
            Item.get('Map', this.world.id)!,
            Item.get('MapP3', this.world.id)!
        ];

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
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Tower of Hera - Prize");
    }

    public override initialize() {
        this.locations.get("Tower of Hera - Big Key Chest")?.setRequirements((_item, _locations, items) => {
            return items.canLightTorches() && items.has("KeyP3");
        });

        this.locations.get("Tower of Hera - Compass Chest")?.setRequirements((_item, _locatinos, items) => {
            return items.has("BigKeyP3");
        })

        this.locations.get("Tower of Hera - Big Chest")?.setRequirements((_item, _locatinos, items) => {
            return items.has("BigKeyP3");
        })

        this.can_complete = (locations, items) => {
            return this.locations.get("Tower of Hera - Boss").canAccess(items, locations);
        }

        this.locations.get("Tower of Hera - Boss")?.setRequirements((item, locations, items, locations_checked) => {
            return (this.boss?.canBeat(items, locations, item, locations_checked) || false
                && items.has("BigKeyP3"));
        });

        this.can_enter = (locations, items, item, locations_checked) => {
            return items.has("RescueZelda")
                && (items.hasOrCanGet("MagicMirror", locations, item, locations_checked)
                    || (items.hasOrCanGet("Hookshot", locations, item, locations_checked) && items.hasOrCanGet("Hammer", locations, item, locations_checked)
                        && this.world.getRegion("West Death Mountain")?.canEnter(locations, items, item, locations_checked) || false));
        };

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items));

        return this;
    }
}
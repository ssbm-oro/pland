import { Bosses } from "../../Boss";
import Item from "../../Item";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import { BigChest, Chest, Dash, Drop, Pendant, type Prize } from "../../Location";

export class DesertPalace extends Dungeon {
    public constructor(world: World) {
        super("Desert Palace", world);

        this.region_items = [
            Item.get('BigKey', this.world.id)!,
            Item.get('BigKeyP2', this.world.id)!,
            Item.get('Compass', this.world.id)!,
            Item.get('CompassP2', this.world.id)!,
            Item.get('Key', this.world.id)!,
            Item.get('KeyP2', this.world.id)!,
            Item.get('Map', this.world.id)!,
            Item.get('MapP2', this.world.id)!
        ]

        this.boss = Bosses.get("Lanmolas", world);

        this.locations = new LocationCollection([
            new BigChest("Desert Palace - Big Chest", this),
            new Chest("Desert Palace - Map Chest", this),
            new Dash("Desert Palace - Torch", this),
            new Chest("Desert Palace - Big Key Chest", this),
            new Chest("Desert Palace - Compass Chest", this),
            new Drop("Desert Palace - Boss", this),
            new Pendant("Desert Palace - Prize", this)
        ]);
        this.locations.setChecksForWorld(world.id);
        this.setPrizeLocation(this.locations.get("Desert Palace - Prize") as Prize);


        this.locations.get("Desert Palace - Big Chest").setRequirements((_item, _locations, items) => {
            return items.has("BigKeyP2");
        });

        this.locations.get("Desert Palace - Big Key Chest").setRequirements((_item, _locations, items) => {
            return items.has("KeyP2") && items.canKillMostThings(this.world);
        });

        this.locations.get("Desert Palace - Compass Chest").setRequirements((_item, _locations, items) => {
            return items.has("KeyP2");
        })

        this.locations.get("Desert Palace - Torch").setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet('PegasusBoots', locations, item, locations_checked);
        })

        this.can_complete = (locations, items) => {
            return this.locations.get("Desert Palace - Boss").canAccess(items, locations);
        }

        this.locations.get("Desert Palace - Boss")?.setRequirements((item, locations, items, locations_checked) => {
            return ((this.canEnter(locations, items, item, locations_checked))
                && ((items.canLiftRocks() || items.hasOrCanGet('MagicMirror', locations, item, locations_checked) && this.world.getRegion('Mire')?.canEnter(locations, items, item, locations_checked)) || false)
                && items.canLightTorches()
                && items.has('BigKeyP2') && items.has('KeyP2')
                && this.boss?.canBeat !== undefined && this.boss?.canBeat(items, locations, item, locations_checked))
        });

        this.can_enter = (locations, items, item, locations_checked) => {
            return items.hasOrCanGet('RescueZelda', locations, item, locations_checked)
                && (items.hasOrCanGet('BookOfMudora', locations, item, locations_checked) || (items.hasOrCanGet('MagicMirror', locations, item, locations_checked) && (this.world.getRegion('Mire')?.canEnter(locations,items, item, locations_checked)))) || false;
        };

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items));
    }
}
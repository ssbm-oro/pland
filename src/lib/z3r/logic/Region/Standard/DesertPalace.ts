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
            Item.get('BigKey', this.world)!,
            Item.get('BigKeyP2', this.world)!,
            Item.get('Compass', this.world)!,
            Item.get('CompassP2', this.world)!,
            Item.get('Key', this.world)!,
            Item.get('KeyP2', this.world)!,
            Item.get('Map', this.world)!,
            Item.get('MapP2', this.world)!
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
        this.locations.setChecksForWorld(world);
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

        this.locations.get("Desert Palace - Torch").setRequirements((_item, _locations, items) => {
            return items.has('PegasusBoots');
        })

        this.can_complete = (locations, items) => {
            return this.locations.get("Desert Palace - Boss").canAccess(items, locations);
        }

        this.locations.get("Desert Palace - Boss")?.setRequirements((_item, locations, items) => {
            return ((this.canEnter(locations, items))
                && ((items.canLiftRocks() || items.has('MagicMirror') && this.world.getRegion('Mire')?.canEnter(locations, items)) || false)
                && items.canLightTorches()
                && items.has('BigKeyP2') && items.has('KeyP2')
                && this.boss?.canBeat !== undefined && this.boss?.canBeat(items, locations))
        });

        this.can_enter = (locations, items) => {
            return items.has('RescueZelda')
                && (items.has('BookOfMudora') || (items.has('MagicMirror') && (this.world.getRegion('Mire')?.canEnter(locations,items)))) || false;
        };

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items));
    }
}
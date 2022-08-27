import Item from "../../Item";
import { Chest, BigChest, Drop, Crystal } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import type { ItemCollection } from "../../Support/ItemCollection";
import { Bosses } from "../../Boss";

export class IcePalace extends Dungeon {
    public constructor(world: World) {
        super("Ice Palace", world);

        this.region_items = [
            Item.get('BigKey', this.world)!,
            Item.get('BigKeyD5', this.world)!,
            Item.get('Compass', this.world)!,
            Item.get('CompassD5', this.world)!,
            Item.get('Key', this.world)!,
            Item.get('KeyD5', this.world)!,
            Item.get('Map', this.world)!,
            Item.get('MapD5', this.world)!
        ];

        this.boss = Bosses.get("Kholdstare", world);

        this.locations = new LocationCollection([
            new Chest("Ice Palace - Big Key Chest", this),
            new Chest("Ice Palace - Compass Chest", this),
            new Chest("Ice Palace - Map Chest", this),
            new Chest("Ice Palace - Spike Room", this),
            new Chest("Ice Palace - Freezor Chest", this),
            new Chest("Ice Palace - Iced T Chest", this),
            new BigChest("Ice Palace - Big Chest", this),
            new Drop("Ice Palace - Boss", this),

            new Crystal("Ice Palace - Prize", this)
        ]);

        this.locations.setChecksForWorld(world);
        this.prize = this.locations.get("Ice Palace - Prize")!;
    }

    public override initialize() {
        this.locations.get("Ice Palace - Big Key Chest")?.setRequirements((locations, items) => {
            return items.has('Hammer') && items.canLiftRocks()
            && ((items.has('Hookshot') || items.has('ShopKey') || (items.has('KeyD5', 1) && (locations.itemInLocations(Item.get('BigKeyD5', this.world)!, ["Ice Palace - Map Chest", "Ice Palace - Spike Room"])))));
        });

        this.locations.get("Ice Palace - Map Chest")?.setRequirements((locations, items) => {
            return items.has('Hammer') && items.canLiftRocks()
            && ((items.has('Hookshot') || items.has('ShopKey') || (items.has('KeyD5', 1) && (locations.itemInLocations(Item.get('BigKeyD5', this.world)!, ["Ice Palace - Big Key Chest", "Ice Palace - Spike Room"])))));
        });

        this.locations.get("Ice Palace - Spike Room")?.setRequirements((locations, items) => {
            return items.has('Hammer') && items.canLiftRocks()
            && ((items.has('Hookshot') || items.has('ShopKey') || (items.has('KeyD5', 1) && (locations.itemInLocations(Item.get('BigKeyD5', this.world)!, ["Ice Palace - Big Key Chest", "Ice Palace - Map Chest"])))));
        });

        this.locations.get("Ice Palace - Freezor Chest")?.setRequirements((_locations, items) => {
            return items.canMeltThings(this.world);
        });
        
        this.locations.get("Ice Palace - Big Chest")?.setRequirements((_locations, items) => {
            return items.has('BigKeyD5');
        });

        this.can_complete = (locations: LocationCollection, items: ItemCollection) => {
            return this.locations.get("Ice Palace - Boss")?.canAccess(items, locations)!;
        }

        this.locations.get("Ice Palace - Boss")?.setRequirements((locations, items) => {
            return this.canEnter(locations, items)
                && items.has('Hammer') && items.canLiftRocks()
                && this.boss?.canBeat(items, locations)!
                && items.has('BigKeyD5') && ((items.has("CaneOfSomaria") && items.has('KeyD5')) || (items.has('KeyD5', 2)));
        });

        this.can_enter = (_locations, items) => {
            return items.has('RescueZelda')
            && items.canMeltThings(this.world)
            && items.has('MoonPearl') && items.has('Flippers') && items.canLiftDarkRocks();
        }

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}

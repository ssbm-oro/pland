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
            Item.get('BigKey', this.world.id)!,
            Item.get('BigKeyD5', this.world.id)!,
            Item.get('Compass', this.world.id)!,
            Item.get('CompassD5', this.world.id)!,
            Item.get('Key', this.world.id)!,
            Item.get('KeyD5', this.world.id)!,
            Item.get('Map', this.world.id)!,
            Item.get('MapD5', this.world.id)!
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

        this.locations.setChecksForWorld(world.id);
        this.prize = this.locations.get("Ice Palace - Prize");
    }

    public override initialize() {
        this.locations.get("Ice Palace - Big Key Chest")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet('Hammer', locations, item, locations_checked) && items.canLiftRocks()
            && (items.hasOrCanGet('Hookshot', locations, item, locations_checked) || items.has('ShopKey')
            || (items.has('KeyD5', 1) && (items.has('BigKeyD5') || item?.name == 'BigKeyD5'  || this.locations.itemInLocations(Item.get('BigKeyD5', this.world.id)!, 
                ['Ice Palace - Spike Room','Ice Palace - Map Chest', 'Ice Palace - Big Key Chest']))));
        });

        this.locations.get("Ice Palace - Map Chest")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet('Hammer', locations, item, locations_checked) && items.canLiftRocks()
            && (items.hasOrCanGet('Hookshot', locations, item, locations_checked) || items.has('ShopKey')
            || (items.has('KeyD5', 1) && (items.has('BigKeyD5') || item?.name == 'BigKeyD5'  || this.locations.itemInLocations(Item.get('BigKeyD5', this.world.id)!, 
                ['Ice Palace - Big Key Chest','Ice Palace - Spike Room', 'Ice Palace - Map Chest']))));
        });

        this.locations.get("Ice Palace - Spike Room")?.setRequirements((item, locations, items, locations_checked) => {
            return (items.hasOrCanGet('Hookshot', locations, item, locations_checked) || items.has('ShopKey')
            || (items.has('KeyD5', 1) && (items.has('BigKeyD5') || item?.name == 'BigKeyD5' || this.locations.itemInLocations(Item.get('BigKeyD5', this.world.id)!, 
                ['Ice Palace - Big Key Chest','Ice Palace - Map Chest', 'Ice Palace - Spike Room']))));
        });

        this.locations.get("Ice Palace - Freezor Chest")?.setRequirements((_item, _locations, items) => {
            return items.canMeltThings(this.world);
        });
        
        this.locations.get("Ice Palace - Big Chest")?.setRequirements((_item, _locations, items) => {
            return items.has('BigKeyD5');
        });

        this.can_complete = (locations: LocationCollection, items: ItemCollection) => {
            return this.locations.get("Ice Palace - Boss")?.canAccess(items, locations);
        }

        this.locations.get("Ice Palace - Boss")?.setRequirements((item, locations, items, locations_checked) => {
            return this.canEnter(locations, items, item, locations_checked)
                && items.hasOrCanGet('Hammer', locations, item, locations_checked)  && items.canLiftRocks()
                && (this.boss?.canBeat(items, locations, item, locations_checked) || false)
                && items.has('BigKeyD5') && ((items.hasOrCanGet("CaneOfSomaria", locations, item, locations_checked) && items.has('KeyD5')) || (items.has('KeyD5', 2)));
        });

        this.can_enter = (locations, items, item, locations_checked) => {
            return items.has('RescueZelda')
            && items.canMeltThings(this.world)
            && items.hasOrCanGet('MoonPearl', locations, item, locations_checked) && items.hasOrCanGet('Flippers', locations, item, locations_checked) && items.canLiftDarkRocks();
        }

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items));

        return this;
    }
}

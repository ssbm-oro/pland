import Item from "../../Item";
import { Chest, BigChest, Drop, Crystal } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import { Bosses } from "../../Boss";

export class ThievesTown extends Dungeon {
    public constructor(world: World) {
        super("Thieves Town", world);

        this.region_items = [
            Item.get('BigKey', this.world.id)!,
            Item.get('BigKeyD4', this.world.id)!,
            Item.get('Compass', this.world.id)!,
            Item.get('CompassD4', this.world.id)!,
            Item.get('Key', this.world.id)!,
            Item.get('KeyD4', this.world.id)!,
            Item.get('Map', this.world.id)!,
            Item.get('MapD4', this.world.id)!
        ];

        this.boss = Bosses.get("Blind", world);

        this.locations = new LocationCollection([
            new Chest("Thieves' Town - Attic", this),
            new Chest("Thieves' Town - Big Key Chest", this),
            new Chest("Thieves' Town - Map Chest", this),
            new Chest("Thieves' Town - Compass Chest", this),
            new Chest("Thieves' Town - Ambush Chest", this),
            new BigChest("Thieves' Town - Big Chest", this),
            new Chest("Thieves' Town - Blind's Cell", this),
            new Drop("Thieves' Town - Boss", this),

            new Crystal("Thieves' Town - Prize", this)
        ]);
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Thieves' Town - Prize");
    }

    public override initialize() {
        this.locations.get("Thieves' Town - Attic")?.setRequirements((_item, _locations, items) => {
            return items.has('KeyD4') && items.has('BigKeyD4');
        });

        this.locations.get("Thieves' Town - Big Chest")?.setRequirements((item, locations, items, locations_checked) => {
            if (locations.get("Thieves' Town - Big Chest")?.hasItem(Item.get('KeyD4', this.world.id))) {
                return items.hasOrCanGet("Hammer", locations, item, locations_checked) && items.has("BigKeyD4");
            }
            return items.hasOrCanGet("Hammer", locations, item, locations_checked) && items.has('KeyD4') && items.has('BigKeyD4');
        });

        this.locations.get("Thieves' Town - Blind's Cell")?.setRequirements((_item, _locations, items) => {
            return items.has('BigKeyD4');
        });

        this.can_complete = (locations, items) => {
            return this.locations.get("Thieves' Town - Boss").canAccess(items, locations)
        }

        this.locations.get("Thieves' Town - Boss")?.setRequirements((item, locations, items, locations_checked) => {
            return this.canEnter(locations, items, item, locations_checked)
                && items.has("KeyD4") && items.has("BigKeyD4")
                && !!this.boss && this.boss.canBeat(items, locations, item, locations_checked)
        });

        this.can_enter = (locations, items, item, locations_checked) => {
            return items.has("RescueZelda")
                && items.hasOrCanGet("MoonPearl", locations, item, locations_checked)
                && this.world.getRegion("North West Dark World")?.canEnter(locations, items, item, locations_checked) || false;
        };

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items));

        return this;
    }
}
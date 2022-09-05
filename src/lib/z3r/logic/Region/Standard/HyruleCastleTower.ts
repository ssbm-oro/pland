import Item from "../../Item";
import { Chest, Event } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import type { ItemCollection } from "../../Support/ItemCollection";
import { log } from "../../Logic";

export class HyruleCastleTower extends Dungeon {
    override region_items = [
        Item.get('BigKey', this.world.id)!,
        Item.get('BigKeyA1', this.world.id)!,
        Item.get('Compass', this.world.id)!,
        Item.get('CompassA1', this.world.id)!,
        Item.get('Key', this.world.id)!,
        Item.get('KeyA1', this.world.id)!,
        Item.get('Map', this.world.id)!,
        Item.get('MapA1', this.world.id)!
    ];

    public constructor(world: World) {
        super("Castle Tower", world);

        this.locations = new LocationCollection([
            new Chest("Castle Tower - Room 03", this),
            new Chest("Castle Tower - Dark Maze", this),
            new Event("Agahnim", this)
        ]);

        this.locations.setChecksForWorld(world.id);
        this.prize = this.locations.get("Agahnim")!;
        this.prize.setItem(Item.get('DefeatAgahnim', world.id)!);
    }

    public override initialize() {
        this.locations.get("Castle Tower - Dark Maze")?.setRequirements((item, _locations, items, locations_checked) => {
            return items.hasOrCanGet('Lamp', this.locations, item, locations_checked) && items.has('KeyA1');
        });

        this.can_complete = (locations: LocationCollection, items: ItemCollection) => {
            log(`Checking if we can complete Castle Tower`)
            return this.canEnter(locations, items, null, []) && items.has('KeyA1',2) && items.has('Lamp') && items.hasSword();
        }

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items));

        this.can_enter = (locations, items, item, locations_checked) => {
            log(`Checking if we can enter Castle Tower`);
            return items.canKillMostThings(this.world, 8)
                && items.has('RescueZelda')
                && (items.hasOrCanGet('Cape', locations, item, locations_checked) || (items.hasSword(2)));
        }

        return this;
    }
}
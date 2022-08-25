import Item from "../../Item";
import { Chest, Event } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import type { ItemCollection } from "../../Support/ItemCollection";

export class HyruleCastleTower extends Dungeon {
    override region_items: Item[] = [
        Item.get('BigKey', this.world)!,
        Item.get('BigKeyA1', this.world)!,
        Item.get('Compass', this.world)!,
        Item.get('CompassA1', this.world)!,
        Item.get('Key', this.world)!,
        Item.get('KeyA1', this.world)!,
        Item.get('Map', this.world)!,
        Item.get('MapA1', this.world)!
    ];

    public constructor(world: World) {
        super("Castle Tower", world);

        this.locations = new LocationCollection([
            new Chest("Castle Tower - Room 03", this),
            new Chest("Castle Tower - Dark Maze", this),
            new Event("Agahnim", this)
        ]);

        this.locations.setChecksForWorld(world);
        this.prize = this.locations.get("Agahnim")!;
        this.prize.setItem(Item.get('DefeatAgahnim', world)!);
    }

    public override initialize() {
        this.locations.get("Castle Tower - Dark Maze")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return items.has('Lamp') && items.has('KeyA1');
        });

        this.can_complete = (locations: LocationCollection, items: ItemCollection) => {
            return this.canEnter(locations, items) && items.has('KeyA1',2) && items.has('Lamp') && items.hasSword();
        }

        this.prize?.setRequirements(this.canComplete);

        this.can_enter = (locations: LocationCollection, items: ItemCollection) => {
            return items.canKillMostThings(this.world, 8)
                && items.has('RescueZelda')
                && (items.has('Cape') || (items.hasSword(2)));
        }

        return this;
    }
}
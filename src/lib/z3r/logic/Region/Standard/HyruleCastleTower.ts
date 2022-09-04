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
        this.locations.get("Castle Tower - Dark Maze")?.setRequirements((_item, _locations: LocationCollection, items: ItemCollection) => {
            return items.has('Lamp') && items.has('KeyA1');
        });

        this.can_complete = (locations: LocationCollection, items: ItemCollection) => {
            log(`Checking if we can complete Castle Tower`)
            return this.canEnter(locations, items) && items.has('KeyA1',2) && items.has('Lamp') && items.hasSword();
        }

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items));

        this.can_enter = (_locations: LocationCollection, items: ItemCollection) => {
            log(`Checking if we can enter Castle Tower`);
            return items.canKillMostThings(this.world, 8)
                && items.has('RescueZelda')
                && (items.has('Cape') || (items.hasSword(2)));
        }

        return this;
    }
}
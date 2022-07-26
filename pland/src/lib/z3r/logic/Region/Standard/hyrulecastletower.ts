import { Item } from "../../item";
import { BigKey } from "../../Item/bigkey";
import { Compass } from "../../Item/compass";
import { Key } from "../../Item/key";
import { Map } from "../../Item/map";
import { Chest } from "../../Location/chest";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type { World } from "../../world";
import { Event } from "../../Location/Prize/event"
import type { ItemCollection } from "../../Support/itemcollection";

export class HyruleCastleTower extends Region {
    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyA1', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassA1', this.world),
        new Key('Key', this.world),
        new Key('KeyA1', this.world),
        new Map('Map', this.world),
        new Map('MapA1', this.world)
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
        this.prize.setItem(Item.get('DefeatAgahnim', world)!);
    }

    public override initialize(): Region {
        this.locations.get("Castle Tower - Dark Maze")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return items.has('Lamp') && items.has('KeyA1');
        });

        this.canComplete = (locations: LocationCollection, items: ItemCollection) => {
            return this.canEnter(locations, items) && items.has('KeyA1',2) && items.has('Lamp') && items.hasSword();
        }

        this.prize?.setRequirements(this.canComplete);

        this.canEnter = (locations: LocationCollection, items: ItemCollection) => {
            return items.canKillMostThings(this.world, 8)
                && items.has('RescueZelda')
                && (items.has('Cape') || (items.hasSword(2)));
        }

        return this;
    }
}
import { Boss } from "../../boss";
import type { Item } from "../../item";
import { Pendant } from "../../Location/Prize/pendant";
import { Location } from "../../location";
import { BigChest } from "../../Location/bigchest";
import { Chest } from "../../Location/chest";
import { Drop } from "../../Location/drop";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type { World } from "../../world";
import type { Prize } from "../../Location/prize";
import { BigKey } from "../../Item/bigkey";
import { Compass } from "../../Item/compass";
import { Key } from "../../Item/key";
import { Map } from "../../Item/map";

export class EasternPalace extends Region {
    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyP1', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassP1', this.world),
        new Map('Map', this.world),
        new Map('MapP1', this.world),
        new Key('Key', this.world),
        new Key('KeyP1', this.world),
    ];

    public constructor(world: World) {
        super("Eastern Palace", world);

        this.boss = Boss.get("Armos Knights", world);

        this.locations = new LocationCollection([
            new Chest("Eastern Palace - Compass Chest", this),
            new BigChest("Eastern Palace - Compass Chest", this),
            new Chest("Eastern Palace - Canonball Chest", this),
            new Chest("Eastern Palace - Big Key Chest", this),
            new Chest("Eastern Palace - Map Chest", this),
            new Drop("Eastern Palace - Boss", this),

            new Pendant("Eastern Palace - Prize", this)
        ]);

        this.locations.setChecksForWorld(world.id);
        this.setPrizeLocation(this.locations.get("Eastern Palace - Prize") as Prize);
    }

    public override initialize(): Region {
        this.locations.get("Eastern Palace - Big Chest")?.setRequirement((locations, items) => {
            return items.has('BigKeyP1');
        });

        this.locations.get("Eastern Palace - Big Key Chest")?.setRequirement((locations, items) => {
            return items.has('Lamp');
        });

        this.canComplete = (locations, items) => {
            return this.locations.get("Eastern Palace - Boss")?.canAccess(items, locations)!;
        }

        this.locations.get("Eastern Palace - Boss")?.setRequirement((locations, items) => {
            return items.canShootArrows(this.world)
                && items.canLightTorches()
                && items.has('BigKeyP1')
                && this.boss?.canBeat(items, locations)!;
        });

        this.canEnter = (locations, items) => {
            return items.has('RescueZelda');
        };

        return this;
    }
}
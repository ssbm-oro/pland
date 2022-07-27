import Item, { BigKey, Compass, Key, Map } from "../../item";
import { Chest } from "../../Location/chest";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type World from "../../world";
import { Boss } from "../../boss";
import { BigChest } from "../../Location/bigchest";
import { Drop } from "../../Location/drop";
import { Standing } from "../../Location/standing";
import { Pendant } from "../../Location/Prize/pendant";

export class TowerOfHera extends Region {
    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyP3', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassP3', this.world),
        new Key('Key', this.world),
        new Key('KeyP3', this.world),
        new Map('Map', this.world),
        new Map('MapP3', this.world)
    ];

    public constructor(world: World) {
        super("Tower of Hera", world);

        this.boss = Boss.get("Moldorm", world);

        this.locations = new LocationCollection([
            new Chest("Tower of Hera - Big Key Chest", this),
            new Standing("Tower of Hera - Basement Cage", this),
            new Chest ("Tower of Hera - Map Chest", this),
            new Chest ("Tower of Hera - Compass Chest", this),
            new BigChest ("Tower of Hera - Big Chest", this),
            new Drop ("Tower of Hera - Boss", this),

            new Pendant("Tower of Hera - Prize", this)
        ]);
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Tower of Hera - Prize")!
    }

    public override initialize(): Region {
        this.locations.get("Tower of Hera - Big Key Chest")?.setRequirements((locations, items) => {
            return items.canLightTorches() && items.has("KeyP3");
        });

        this.locations.get("Tower of Hera - Compass Chest")?.setRequirements((locatinos, items) => {
            return items.has("BigKeyP3");
        })

        this.locations.get("Tower of Hera - Big Chest")?.setRequirements((locatinos, items) => {
            return items.has("BigKeyP3");
        })

        this.canComplete = (locations, items) => {
            return this.locations.get("Tower of Hera - Boss")?.canAccess(items, locations)!;
        }

        this.locations.get("Tower of Hera - Boss")?.setRequirements((locations, items) => {
            return this.boss?.canBeat(items, locations)!
                && items.has("BigKeyP3");
        });

        this.canEnter = (locations, items) => {
            return items.has("RescueZelda")
                && (items.has("Magic Mirror")
                    || (items.has("Hookshot") && items.has("Hammer")
                        && this.world.getRegion("West Death Mountain")!.canEnter(locations, items)));
        };

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
import { Boss } from "../../boss";
import type { Item } from "../../item";
import { Pendant } from "../../Location/Prize/pendant";
import { Location } from "../../location";
import { BigChest } from "../../Location/bigchest";
import { Chest } from "../../Location/chest";
import { Dash } from "../../Location/dash";
import { Drop } from "../../Location/drop";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type { World } from "../../world";
import type { Prize } from "../../Location/prize";
import type { ItemCollection } from "../../Support/itemcollection";
import { BigKey } from "../../Item/bigkey";
import { Compass } from "../../Item/compass";
import { Key } from "../../Item/key";
import { Map } from "../../Item/map";

export class DesertPalace extends Region {
    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyP2', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassP2', this.world),
        new Key('Key', this.world),
        new Key('KeyP2', this.world),
        new Map('Map', this.world),
        new Map('MapP2', this.world)
    ]

    public constructor(world: World) {
        super("Desert Palace", world);

        this.boss = Boss.get("Lanmolas", world);

        this.locations = new LocationCollection([
            new BigChest("Desert Palace - Big Chest", this),
            new Chest("Desert Palace - Map Chest", this),
            new Dash("Desert Palace - Torch", this),
            new Chest("Desert Palace - Big Key Chest", this),
            new Chest("Desert Palace - Compass Chest", this),
            new Drop("Desert Palace - Boss", this),
            new Pendant("Desert Palace - Prize", this)
        ])
        this.locations.setChecksForWorld(world.id);
        this.setPrizeLocation(this.locations.get("Desert Palace - Prize") as Prize);
    }

    public override initialize(): Region {
        this.locations.get("Desert Palace - Big Chest")!.setRequirement((locations, items) => {
            return items.has("BigKeyP2");
        });

        this.locations.get("Desert Palace - Big Key Chest")!.setRequirement((locations, items) => {
            return items.has("KeyP2") && items.canKillMostThings(this.world);
        });

        this.locations.get("Desert Palace - Compass Chest")!.setRequirement((locations, items) => {
            return items.has("KeyP2");
        })

        this.locations.get("Desert Palace - Torch")!.setRequirement((locations, items) => {
            return items.has('Pegasus Boots');
        })

        this.canComplete = (locations, items) => {
            return this.locations.get("Desert Palace - Boss")?.canAccess(items, locations)!;
        }

        this.locations.get("Desert Palace - Boss")!.setRequirement((locations, items) => {
            return ((this.canEnter(locations, items))
                && ((items.canLiftRocks() || items.has('Magic Mirror') && this.world.getRegion('Mire').canEnter(locations, items)))
                && items.canLightTorches()
                && items.has('BigKeyP2') && items.has('KeyP2')
                && this.boss!.canBeat(items, locations))
        });

        this.canEnter = (locations, items) => {
            return items.has('RescueZelda')
                && (items.has('Book of Mudora') || (items.has('Mirror') && (this.world.getRegion('Mire').canEnter(locations,items))));
        };

        this.prize!.setRequirement(this.canComplete);

        return this;
    }
}
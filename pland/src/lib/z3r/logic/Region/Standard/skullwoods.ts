import type { Item } from "../../item";
import { BigKey } from "../../Item/bigkey";
import { Compass } from "../../Item/compass";
import { Key } from "../../Item/key";
import { Map } from "../../Item/map";
import { Chest } from "../../Location/chest";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type { World } from "../../world";
import { Boss } from "../../boss";
import { BigChest } from "../../Location/bigchest";
import { Drop } from "../../Location/drop";
import { Crystal } from "../../Location/Prize/crystal";

export class SkullWoods extends Region {
    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyD3', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassD3', this.world),
        new Key('Key', this.world),
        new Key('KeyD3', this.world),
        new Map('Map', this.world),
        new Map('MapD3', this.world)
    ];

    public constructor(world: World) {
        super("Skull Woods", world);

        this.boss = Boss.get("Mothula", world);

        this.locations = new LocationCollection([
            new BigChest("Skull Woods - Big Chest", this),
            new Chest("Skull Woods - Big Key Chest", this),
            new Chest("Skull Woods - Compass Chest", this),
            new Chest("Skull Woods - Map Chest", this),
            new Chest("Skull Woods - Bridge Chest", this),
            new Chest("Skull Woods - Pot Prison", this),
            new Chest("Skull Woods - Pinball Room", this),
            new Drop("Skull Woods - Boss", this),

            new Crystal("Skull Woods - Prize", this)
        ]);
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Skull Woods - Prize")!;
    }

    public override initialize(): Region {
        this.locations.get("Skull Woods - Big Chest")?.setRequirements((locations, items) => {
            return items.has('BigKeyD3');
        });

        this.locations.get("Skull Woods - Bridge Room")?.setRequirements((locations, items) => {
            return items.has('MoonPearl') && items.has('FireRod');
        });

        this.canComplete = (locations, items) => {
            return this.locations.get('Skull Woods - Boss')?.canAccess(items, locations)!;
        };

        this.locations.get("Skull Woods - Boss")?.setRequirements((locations, items) => {
            return this.canEnter(locations, items)
                && items.has('MoonPearl') && items.has('FireRod')
                && items.hasSword()
                && items.has('KeyD3', 3)
                && this.boss?.canBeat(items, locations)!;
        });

        this.canEnter = (locations, items) => {
            return items.has('RescueZelda')
                && items.has('MoonPearl')
                && this.world.getRegion('North West Dark World').canEnter(locations, items);
        };

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
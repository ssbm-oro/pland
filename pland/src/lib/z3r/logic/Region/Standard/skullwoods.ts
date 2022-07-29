import Item from "../../item";
import { BigKey, Compass, Key, Map } from "../../item";
import { Chest } from "../../Location/chest";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type World from "../../world";
import { Boss } from "../../boss";
import { BigChest } from "../../Location/bigchest";
import { Drop } from "../../Location/drop";
import { Crystal } from "../../Location/Prize/crystal";

export class SkullWoods extends Region {
    override region_items: Item[] = [
        Item.get('BigKey', this.world)!,
        Item.get('BigKeyD3', this.world)!,
        Item.get('Compass', this.world)!,
        Item.get('CompassD3', this.world)!,
        Item.get('Key', this.world)!,
        Item.get('KeyD3', this.world)!,
        Item.get('Map', this.world)!,
        Item.get('MapD3', this.world)!
    ];

    public constructor(world: World, messages: string[]|null = null) {
        super("Skull Woods", world, messages);

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

        this.can_complete = (locations, items) => {
            return this.locations.get('Skull Woods - Boss')?.canAccess(items, locations)!;
        };

        this.locations.get("Skull Woods - Boss")?.setRequirements((locations, items) => {
            return this.canEnter(locations, items)
                && items.has('MoonPearl') && items.has('FireRod')
                && items.hasSword()
                && items.has('KeyD3', 3)
                && this.boss?.canBeat(items, locations)!;
        });

        this.can_enter = (locations, items) => {
            return items.has('RescueZelda')
                && items.has('MoonPearl')
                && this.world.getRegion('North West Dark World')!.canEnter(locations, items);
        };

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
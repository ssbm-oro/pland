import { Boss } from "../../Boss";
import Item from "../../item";
import { Pendant } from "../../Location/Prize/pendant";
import { BigChest } from "../../Location/bigchest";
import { Chest } from "../../Location/chest";
import { Drop } from "../../Location/drop";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type World from "../../world";
import type { Prize } from "../../Location/prize";
import { BigKey, Compass, Key, Map } from "../../item";

export class EasternPalace extends Region {
    override region_items: Item[] = [
        Item.get('BigKey', this.world)!,
        Item.get('BigKeyP1', this.world)!,
        Item.get('Compass', this.world)!,
        Item.get('CompassP1', this.world)!,
        Item.get('Map', this.world)!,
        Item.get('MapP1', this.world)!,
        Item.get('Key', this.world)!,
        Item.get('KeyP1', this.world)!
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
        this.locations.get("Eastern Palace - Big Chest")?.setRequirements((locations, items) => {
            return items.has('BigKeyP1');
        });

        this.locations.get("Eastern Palace - Big Key Chest")?.setRequirements((locations, items) => {
            return items.has('Lamp');
        });

        this.can_complete = (locations, items) => {
            return this.locations.get("Eastern Palace - Boss")?.canAccess(items, locations)!;
        }

        this.locations.get("Eastern Palace - Boss")?.setRequirements((locations, items) => {
            return items.canShootArrows(this.world)
                && items.canLightTorches()
                && items.has('BigKeyP1')
                && this.boss?.canBeat(items, locations)!;
        });

        this.can_enter = (locations, items) => {
            return items.has('RescueZelda');
        };

        return this;
    }
}
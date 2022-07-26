import { Item } from "../../item";
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

export class ThievesTown extends Region {
    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyD4', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassD4', this.world),
        new Key('Key', this.world),
        new Key('KeyD4', this.world),
        new Map('Map', this.world),
        new Map('MapD4', this.world)
    ];

    public constructor(world: World) {
        super("Thieves Town", world);

        this.boss = Boss.get("Blind", world);

        this.locations = new LocationCollection([
            new Chest("Thieves' Town - Attic", this),
            new Chest("Thieves' Town - Big Key Chest", this),
            new Chest("Thieves' Town - Map Chest", this),
            new Chest("Thieves' Town - Compass Chest", this),
            new Chest("Thieves' Town - Ambuss Chest", this),
            new BigChest("Thieves' Town - Big Chest", this),
            new Chest("Thieves' Town - Blind's Cell", this),
            new Drop("Thieves' Town - Boss", this),

            new Crystal("Thieves' Town - Prize", this)
        ]);
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Thieves' Town - Prize")!;
    }

    public override initialize(): Region {
        this.locations.get("Thieves' Town - Attic")?.setRequirements((locations, items) => {
            return items.has('KeyD4') && items.has('BigKeyD4');
        });

        this.locations.get("Thieves' Town - Big Chest")?.setRequirements((locations, items) => {
            if (locations.get("Thieves' Town - Big Chest")?.hasItem(Item.get('KeyD4', this.world))) {
                return items.has("Hammer") && items.has("BigKeyD4");
            }
            return items.has("Hammer") && items.has('KeyD4') && items.has('BigKeyD4');
        });

        this.locations.get("Thieves' Town - Blind's Cell")?.setRequirements((locations, items) => {
            return items.has('BigKeyD4');
        });

        this.canComplete = (locations, items) => {
            return this.locations.get("Thieves' Town - Boss")?.canAccess(items, locations)!
        }

        this.locations.get("Thieves' Town - Boss")?.setRequirements((locations, items) => {
            return this.canEnter(locations, items)
                && items.has("KeyD4") && items.has("BigKeyD4")
                && this.boss?.canBeat(items, locations)!
        });

        this.canEnter = (locations, items) => {
            return items.has("RescueZelda")
                && items.has("MoonPearl")
                && this.world.getRegion("North West Dark World").canEnter(locations, items);
        };

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
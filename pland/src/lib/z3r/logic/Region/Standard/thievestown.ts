import Item, { BigKey, Compass, Key, Map } from "../../item";
import { Chest } from "../../Location/chest";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type World from "../../world";
import { Boss } from "../../Boss";
import { BigChest } from "../../Location/bigchest";
import { Drop } from "../../Location/drop";
import { Crystal } from "../../Location/Prize/crystal";

export class ThievesTown extends Region {
    override region_items: Item[] = [
        Item.get('BigKey', this.world)!,
        Item.get('BigKeyD4', this.world)!,
        Item.get('Compass', this.world)!,
        Item.get('CompassD4', this.world)!,
        Item.get('Key', this.world)!,
        Item.get('KeyD4', this.world)!,
        Item.get('Map', this.world)!,
        Item.get('MapD4', this.world)!
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

        this.can_complete = (locations, items) => {
            return this.locations.get("Thieves' Town - Boss")?.canAccess(items, locations)!
        }

        this.locations.get("Thieves' Town - Boss")?.setRequirements((locations, items) => {
            return this.canEnter(locations, items)
                && items.has("KeyD4") && items.has("BigKeyD4")
                && this.boss?.canBeat(items, locations)!
        });

        this.can_enter = (locations, items) => {
            return items.has("RescueZelda")
                && items.has("MoonPearl")
                && this.world.getRegion("North West Dark World")!.canEnter(locations, items);
        };

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
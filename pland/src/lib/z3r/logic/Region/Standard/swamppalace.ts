import type Item from "../../item";
import { BigKey, Compass, Key, Map } from "../../item";
import { Chest } from "../../Location/chest";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type World from "../../world";
import { Boss } from "../../boss";
import { BigChest } from "../../Location/bigchest";
import { Drop } from "../../Location/drop";
import { Crystal } from "../../Location/Prize/crystal";

export class SwampPalace extends Region {
    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyD2', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassD2', this.world),
        new Key('Key', this.world),
        new Key('KeyD2', this.world),
        new Map('Map', this.world),
        new Map('MapD2', this.world)
    ];

    public constructor(world: World) {
        super("Swamp Palace", world);

        this.boss = Boss.get("Arrghus", world);

        this.locations = new LocationCollection([
            new Chest("Swamp Palace - Entrance", this),
            new BigChest("Swamp Palace - Big Chest", this),
            new Chest("Swamp Palace - Big Key Chest", this),
            new Chest("Swamp Palace - Map Chest", this),
            new Chest("Swamp Palace - West Chest", this),
            new Chest("Swamp Palace - Compass Chest", this),
            new Chest("Swamp Palace - Flooed Room - Left", this),
            new Chest("Swamp Palace - Flooed Room - Right", this),
            new Chest("Swamp Palace - Waterfall Room", this),
            new Drop("Swamp Palace - Boss", this),

            new Crystal("Swamp Palace - Prize", this)
        ]);
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Swamp Palace - Prize")!;
    }

    public override initialize(): Region {
        this.locations.get("Swamp Palace - Entrance")?.setRequirements((locations, items) => {
            return items.has("KeyD2");
        });

        this.locations.get("Swamp Palace - Big Chest")?.setRequirements((locations, items) => {
            return items.has("KeyD2")
                && items.has("Hammer")
                && items.has("BigKeyD2");
        });

        this.locations.get("Swamp Palace - Big Key Chest")?.setRequirements((locations, items) => {
            return items.has("KeyD2")
                && items.has("Hammer");
        });

        this.locations.get("Swamp Palace - Map Chest")?.setRequirements((locations, items) => {
            return items.has("KeyD2")
                && items.canBombThings();
        });

        this.locations.get("Swamp Palace - West Chest")?.setRequirements((locations, items) => {
            return items.has("KeyD2")
                && items.has("Hammer");
        });

        this.locations.get("Swamp Palace - Compass Chest")?.setRequirements((locations, items) => {
            return items.has("KeyD2")
                && items.has("Hammer");
        });

        this.locations.get("Swamp Palace - Compass Chest")?.setRequirements((locations, items) => {
            return items.has("Hookshot")
                && items.has("KeyD2")
                && items.has("Hammer")
        });

        this.locations.get("Swamp Palace - Flooded Room - Left")?.setRequirements((locations, items) => {
            return items.has("Hookshot")
                && items.has("KeyD2")
                && items.has("Hammer")
        });

        this.locations.get("Swamp Palace - Flooded Room - Right")?.setRequirements((locations, items) => {
            return items.has("Hookshot")
                && items.has("KeyD2")
                && items.has("Hammer")
        });

        this.locations.get("Swamp Palace - Waterfall Room")?.setRequirements((locations, items) => {
            return items.has("Hookshot")
                && items.has("KeyD2")
                && items.has("Hammer")
        });

        this.canComplete = (locations, items) => {
            return this.locations.get("Swamp Palace - Boss")?.canAccess(items)!;
        }

        this.locations.get("Swamp Palace - Boss")?.setRequirements((locations, items) => {
            return items.has("Hookshot")
                && items.has("KeyD2")
                && items.has("Hammer")
                && this.boss?.canBeat(items, locations)!;
        });

        this.canEnter = (locations, items) => {
            return items.has("RescueZelda")
                && items.has("Flippers")
                && this.world.getRegion("South Dark World")!.canEnter(locations, items)
                && items.has("MoonPearl")
                && items.has("Mirror");
        }

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
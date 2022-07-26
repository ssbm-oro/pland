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
import type { ItemCollection } from "../../Support/itemcollection";
import { Location } from "../../location";

export class TurtleRock extends Region {
    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyD7', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassD7', this.world),
        new Key('Key', this.world),
        new Key('KeyD7', this.world),
        new Map('Map', this.world),
        new Map('MapD7', this.world)
    ];

    public constructor(world: World) {
        super("Turtle Rock", world);

        this.boss = Boss.get("Trinexx", world);

        this.locations = new LocationCollection([
            new Chest("Turtle Rock - Chain Chomps", this),
            new Chest("Turtle Rock - Compass Chest", this),
            new Chest("Turtle Rock - Roller Room - Left", this),
            new Chest("Turtle Rock - Roller Room - Right", this),
            new BigChest("Turtle Rock - Big Chest", this),
            new Chest("Turtle Rock - Big Key Chest", this),
            new Chest("Turtle Rock - Crystalroller Room", this),
            new Chest("Turtle Rock - Eye Bridge - Botom Left", this),
            new Chest("Turtle Rock - Eye Bridge - Botom Right", this),
            new Chest("Turtle Rock - Eye Bridge - Top Left", this),
            new Chest("Turtle Rock - Eye Bridge - Top Right", this),
            new Drop("Turtle Rock - Boss", this),

            new Crystal("Turtle Rock - Prize", this)
        ]);
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Turtle Rock - Prize")!;
    }

    public override initialize(): Region {
        const upper = (locations: LocationCollection, items: ItemCollection) => {
            return ((items.has(locations.get('Turtle Rock Medallion')?.item?.name!))
                && items.hasSword()
                && items.has("MoonPearl")
                && items.has("CaneOfSomaria")
                && (items.has("Hammer") && items.canLiftDarkRocks()
                    && this.world.getRegion("East Death Mountain").canEnter(locations, items)));
        };

        this.locations.get("Turtle Rock - Chain Chomps")?.setRequirements((locations, items) => {
            return(upper(locations, items) && items.has("KeyD7"));
        });

        const rollerRoom = (locations: LocationCollection, items: ItemCollection) => {
            return items.has("FireRod") && items.has("CaneOfSomaria") && upper(locations, items);
        };

        this.locations.get("Turtle Rock - Roller Room - Left")?.setRequirements(rollerRoom);
        this.locations.get("Turtle Rock - Roller Room - Right")?.setRequirements(rollerRoom);

        this.locations.get("Turtle Rock - Compass Chest")?.setRequirements((locations, items) => {
            return items.has("Cane of Somaria") && upper(locations, items);
        });

        this.locations.get("Turtle Rock - Big Chest")?.setRequirements((locations, items) => {
            return items.has("BigKeyD7")
                && upper(locations, items) && items.has("KeyD7", 2);
        });

        this.locations.get("Turtle Rock - Big Key Chest")?.setRequirements((locations, items) => {
            if (!this.locations.get("Turtle Rock - Big Key Chest")?.hasItem(Item.get("BigKeyD7", this.world))) {
                return this.locations.get("Turtle Rock - Big Key Chest")?.hasItem(Item.get("KeyD7", this.world)) ? items.has("KeyD7", 3) : items.has("KeyD7", 4);
            }
            return items.has("KeyD7", 2);
        });

        this.locations.get("Turtle Rock - Crystal Roller Room")?.setRequirements((locations, items) => {
            return (items.has("BigKeyD7") && upper(locations, items) && items.has("KeyD7", 2));
        });

        const laserBridgeRequirements = (locations: LocationCollection, items: ItemCollection) => {
            return (upper(locations, items) && items.has("Lamp") && items.has("CaneOfSomaria") && items.has("BigKeyD7") && items.has("KeyD7", 3));
        }

        this.locations.get("Turtle Rock - Eye Bridge - Top Left")?.setRequirements(laserBridgeRequirements);
        this.locations.get("Turtle Rock - Eye Bridge - Top Right")?.setRequirements(laserBridgeRequirements);
        this.locations.get("Turtle Rock - Eye Bridge - Bottom Left")?.setRequirements(laserBridgeRequirements);
        this.locations.get("Turtle Rock - Eye Bridge - Bottom Right")?.setRequirements(laserBridgeRequirements);

        this.canComplete = (locations: LocationCollection, items: ItemCollection) => {
            return this.locations.get("Turtle Rock - Boss")?.canAccess(items, locations)!;
        }

        this.locations.get("Turtle Rock - Boss")?.setRequirements((locations, items) => {
            return this.canEnter(locations, items)
                && items.has("KeyD7", 4)
                && items.has("BigKeyD7") && items.has("CaneOfSomaria")
                && this.boss?.canBeat(items, locations)!
        });

        this.canEnter = (locations: LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda")
                && upper(locations, items);
        };

        this.prize = this.locations.get("Turtle Rock - Prize")!;

        return this;
    }
}
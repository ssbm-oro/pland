import Item from "../../Item";
import { Chest, BigChest, Drop, Crystal } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import { Bosses } from "../../Boss";
import type { ItemCollection } from "../../Support/ItemCollection";
import { log } from "../../Logic";

export class TurtleRock extends Dungeon {
    public constructor(world: World) {
        super("Turtle Rock", world,);

        this.region_items = [
            Item.get('BigKey', this.world)!,
            Item.get('BigKeyD7', this.world)!,
            Item.get('Compass', this.world)!,
            Item.get('CompassD7', this.world)!,
            Item.get('Key', this.world)!,
            Item.get('KeyD7', this.world)!,
            Item.get('Map', this.world)!,
            Item.get('MapD7', this.world)!
        ];

        this.boss = Bosses.get("Trinexx", world);

        this.locations = new LocationCollection([
            new Chest("Turtle Rock - Chain Chomps", this),
            new Chest("Turtle Rock - Compass Chest", this),
            new Chest("Turtle Rock - Roller Room - Left", this),
            new Chest("Turtle Rock - Roller Room - Right", this),
            new BigChest("Turtle Rock - Big Chest", this),
            new Chest("Turtle Rock - Big Key Chest", this),
            new Chest("Turtle Rock - Crystaroller Room", this),
            new Chest("Turtle Rock - Eye Bridge - Bottom Left", this),
            new Chest("Turtle Rock - Eye Bridge - Bottom Right", this),
            new Chest("Turtle Rock - Eye Bridge - Top Left", this),
            new Chest("Turtle Rock - Eye Bridge - Top Right", this),
            new Drop("Turtle Rock - Boss", this),

            new Crystal("Turtle Rock - Prize", this)
        ]);
        this.locations.setChecksForWorld(world);

        this.prize = this.locations.get("Turtle Rock - Prize")!;
    }

    public override initialize() {
        const upper = (locations: LocationCollection, items: ItemCollection) => {
            let haveMedallion = false;
            let medallion = locations.get('Turtle Rock Medallion')
            if (!medallion || !medallion.item) {
                haveMedallion = items.has('Bombos') || items.has('Ether') || items.has('Quake')
                log(`Turtle Rock Medallion not set. HaveMedallion based on any medallion: ${haveMedallion}`);
            }
            else {
                haveMedallion = items.has(medallion.item.name);
                log(`Turtle Rock Medallion is ${medallion.item.name}. HaveMedallion: ${haveMedallion}`);
            }
            return (haveMedallion
                && items.hasSword()
                && items.has("MoonPearl")
                && items.has("CaneOfSomaria")
                && (items.has("Hammer") && items.canLiftDarkRocks()
                    && this.world.getRegion("East Death Mountain")!.canEnter(locations, items)));
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

        this.locations.get("Turtle Rock - Big Key Chest")?.setRequirements((_locations, items) => {
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

        this.can_complete = (locations: LocationCollection, items: ItemCollection) => {
            return this.locations.get("Turtle Rock - Boss")?.canAccess(items, locations)!;
        }

        this.locations.get("Turtle Rock - Boss")?.setRequirements((locations, items) => {
            return this.canEnter(locations, items)
                && items.has("KeyD7", 4)
                && items.has("BigKeyD7") && items.has("CaneOfSomaria") && items.has("Lamp")
                && this.boss?.canBeat(items, locations)!
        });

        this.can_enter = (locations: LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda")
                && upper(locations, items);
        };

        this.prize = this.locations.get("Turtle Rock - Prize")!;

        return this;
    }
}
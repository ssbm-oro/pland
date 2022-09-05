import Item, { type IItem } from "../../Item";
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
            Item.get('BigKey', this.world.id)!,
            Item.get('BigKeyD7', this.world.id)!,
            Item.get('Compass', this.world.id)!,
            Item.get('CompassD7', this.world.id)!,
            Item.get('Key', this.world.id)!,
            Item.get('KeyD7', this.world.id)!,
            Item.get('Map', this.world.id)!,
            Item.get('MapD7', this.world.id)!
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
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Turtle Rock - Prize");
    }

    public override initialize() {
        const upper = (item: IItem | null, locations: LocationCollection, items: ItemCollection, locations_checked: string[]) => {
            let haveMedallion = false;
            const medallion = locations.get('Turtle Rock Medallion')
            if (!medallion || !medallion.item) {
                haveMedallion = items.hasOrCanGet('Bombos', locations, item, locations_checked) || items.hasOrCanGet('Ether', locations, item, locations_checked) || items.hasOrCanGet('Quake', locations, item, locations_checked)
                log(`Turtle Rock Medallion not set. HaveMedallion based on any medallion: ${haveMedallion}`);
            }
            else {
                haveMedallion = items.hasOrCanGet(medallion.item.name, locations, item, locations_checked);
                log(`Turtle Rock Medallion is ${medallion.item.name}. HaveMedallion: ${haveMedallion}`);
            }
            return (haveMedallion
                && items.hasSword()
                && items.hasOrCanGet("MoonPearl", locations, item, locations_checked)
                && items.hasOrCanGet("CaneOfSomaria", locations, item, locations_checked)
                && (items.hasOrCanGet("Hammer", locations, item, locations_checked) && items.canLiftDarkRocks()
                    && this.world.getRegion("East Death Mountain")?.canEnter(locations, items, item, locations_checked) || false));
        };

        this.locations.get("Turtle Rock - Chain Chomps")?.setRequirements((item, locations, items, locations_checked) => {
            return(upper(item, locations, items, locations_checked) && items.has("KeyD7"));
        });

        const rollerRoom = (item: IItem | null, locations: LocationCollection, items: ItemCollection, locations_checked: string[]) => {
            return items.hasOrCanGet("FireRod", locations, item, locations_checked) && items.hasOrCanGet("CaneOfSomaria", locations, item, locations_checked) && upper(item, locations, items, locations_checked);
        };

        this.locations.get("Turtle Rock - Roller Room - Left")?.setRequirements(rollerRoom);
        this.locations.get("Turtle Rock - Roller Room - Right")?.setRequirements(rollerRoom);

        this.locations.get("Turtle Rock - Compass Chest")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("CaneOfSomaria", locations, item, locations_checked) && upper(item, locations, items, locations_checked);
        });

        this.locations.get("Turtle Rock - Big Chest")?.setRequirements((item, locations, items, locations_checked) => {
            return items.has("BigKeyD7")
                && upper(item, locations, items, locations_checked) && items.has("KeyD7", 2);
        });

        this.locations.get("Turtle Rock - Big Key Chest")?.setRequirements((_item, _locations, items, locations_checked) => {
            if (!this.locations.get("Turtle Rock - Big Key Chest")?.hasItem(Item.get("BigKeyD7", this.world.id))) {
                return this.locations.get("Turtle Rock - Big Key Chest")?.hasItem(Item.get("KeyD7", this.world.id)) ? items.has("KeyD7", 3) : items.has("KeyD7", 4);
            }
            return items.has("KeyD7", 2);
        });

        this.locations.get("Turtle Rock - Crystal Roller Room")?.setRequirements((_item, locations, items, locations_checked) => {
            return (items.has("BigKeyD7") && upper(_item, locations, items, locations_checked) && items.has("KeyD7", 2));
        });

        const laserBridgeRequirements = (item: IItem | null, locations: LocationCollection, items: ItemCollection, locations_checked: string[]) => {
            return (upper(item, locations, items, locations_checked) && items.hasOrCanGet("Lamp", locations, item, locations_checked) && items.hasOrCanGet("CaneOfSomaria", locations, item, locations_checked) && items.has("BigKeyD7") && items.has("KeyD7", 3));
        }

        this.locations.get("Turtle Rock - Eye Bridge - Top Left")?.setRequirements(laserBridgeRequirements);
        this.locations.get("Turtle Rock - Eye Bridge - Top Right")?.setRequirements(laserBridgeRequirements);
        this.locations.get("Turtle Rock - Eye Bridge - Bottom Left")?.setRequirements(laserBridgeRequirements);
        this.locations.get("Turtle Rock - Eye Bridge - Bottom Right")?.setRequirements(laserBridgeRequirements);

        this.can_complete = (locations: LocationCollection, items: ItemCollection) => {
            return this.locations.get("Turtle Rock - Boss").canAccess(items, locations);
        }

        this.locations.get("Turtle Rock - Boss")?.setRequirements((item, locations, items, locations_checked) => {
            return this.canEnter(locations, items, item, locations_checked)
                && items.has("KeyD7", 4)
                && items.has("BigKeyD7") && items.hasOrCanGet("CaneOfSomaria", locations, item, locations_checked) && items.hasOrCanGet("Lamp", locations, item, locations_checked)
                && !!this.boss && this.boss.canBeat(items, locations, item, locations_checked)
        });

        this.can_enter = (locations, items, item, locations_checked) => {
            return items.has("RescueZelda")
                && upper(item, locations, items, locations_checked);
        };

        this.prize = this.locations.get("Turtle Rock - Prize");

        return this;
    }
}
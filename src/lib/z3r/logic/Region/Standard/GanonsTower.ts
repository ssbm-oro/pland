import Item from "../../Item";
import type World from "../../World";
import { LocationCollection } from "../../Support/LocationCollection";
import type { ItemCollection } from "../../Support/ItemCollection";
import { Bosses, type Boss } from "../../Boss";
import Region from "../../Region";
import { Dash, Chest, BigChest, Event } from "../../Location";

export class GanonsTower extends Region {
    boss_top?: Boss;
    boss_middle?: Boss;
    boss_bottom?: Boss;

    public constructor(world: World) {
        super("Ganons Tower", world);

        this.region_items = [
            Item.get('BigKey', this.world)!,
            Item.get('BigKeyA2', this.world)!,
            Item.get('Compass', this.world)!,
            Item.get('CompassA2', this.world)!,
            Item.get('Key', this.world)!,
            Item.get('KeyA2', this.world)!,
            Item.get('Map', this.world)!,
            Item.get('MapA2', this.world)!
        ];

        this.boss = Bosses.get("Agahnim2", world);
        this.boss_top = Bosses.get("Moldorm", world);
        this.boss_middle = Bosses.get("Lanmolas", world);
        this.boss_bottom = Bosses.get("Armos Knights", world);

        this.locations = new LocationCollection([
            new Dash("Ganon's Tower - Bob's Torch", this),
            new Chest("Ganon's Tower - DMs Room - Top Left", this),
            new Chest("Ganon's Tower - DMs Room - Top Right", this),
            new Chest("Ganon's Tower - DMs Room - Bottom Left", this),
            new Chest("Ganon's Tower - DMs Room - Bottom Right", this),
            new Dash("Ganon's Tower - Bob's Torch", this),
            new Chest("Ganon's Tower - Randomizer Room - Top Left", this),
            new Chest("Ganon's Tower - Randomizer Room - Top Right", this),
            new Chest("Ganon's Tower - Randomizer Room - Bottom Left", this),
            new Chest("Ganon's Tower - Randomizer Room - Bottom Right", this),
            new Chest("Ganon's Tower - Map Chest", this),
            new BigChest("Ganon's Tower - Big Chest", this),
            new Chest("Ganon's Tower - Hope Room - Left", this),
            new Chest("Ganon's Tower - Hope Room - Right", this),
            new Chest("Ganon's Tower - Bob's Chest", this),
            new Chest("Ganon's Tower - Tile Room", this),
            new Chest("Ganon's Tower - Compass Room - Top Left", this),
            new Chest("Ganon's Tower - Compass Room - Top Right", this),
            new Chest("Ganon's Tower - Compass Room - Bottom Left", this),
            new Chest("Ganon's Tower - Compass Room - Bottom Right", this),
            new Chest("Ganon's Tower - Big Key Chest", this),
            new Chest("Ganon's Tower - Big Key Room - Left", this),
            new Chest("Ganon's Tower - Big Key Room - Right", this),
            new Chest("Ganon's Tower - Mini Helmasaur Room - Left", this),
            new Chest("Ganon's Tower - Mini Helmasaur Room - Right", this),
            new Chest("Ganon's Tower - Pre-Moldorm Chest", this),
            new Chest("Ganon's Tower - Moldorm Chest", this),
            new Event("Agahnim 2", this)
        ]);

        this.locations.setChecksForWorld(world);
        this.prize = this.locations.get("Agahnim 2")!;
        this.prize.setItem(Item.get("DefeatAgahnim2",  world)!);
    }

    public getBoss(level: string) {
        switch (level) {
            case '':
                return this.boss;
            case 'top':
                return this.boss_top;
            case 'middle':
                return this.boss_middle;
            case 'bottom':
                return this.boss_bottom;
        }

        throw `Unknown boss location: ${level}`;
    }

    public setBoss(boss: Boss, level?:string) {
        switch (level) {
            case undefined:
            case '':
                this.boss = boss;
                break;
            case 'top':
                this.boss_top = boss;
                break;
            case 'middle':
                this.boss_middle = boss;
                break;
            case 'bottom':
                this.boss_bottom = boss;
                break;
            default:
                throw `Unknown boss location: ${level}`;
        }

        return this;
    }

    public override initialize() {
        this.locations.get("Ganon's Tower - Bob's Torch")?.setRequirements((locations, items) => {
            return items.has('PegasusBoots');
        });

        const leftGtRequirements = (locations:LocationCollection, items:ItemCollection) => {
            return items.has('Hammer') && items.has('Hookshot');
        }
        const rightGtRequirements = (locations:LocationCollection, items:ItemCollection) => {
            return items.has('FireRod') && items.has('CaneOfSomaria');
        }

        this.locations.get("Ganon's Tower - DMs Room - Top Left")?.setRequirements(leftGtRequirements);
        this.locations.get("Ganon's Tower - DMs Room - Top Right")?.setRequirements(leftGtRequirements);
        this.locations.get("Ganon's Tower - DMs Room - Bottom Left")?.setRequirements(leftGtRequirements);
        this.locations.get("Ganon's Tower - DMs Room - Bottom Right")?.setRequirements(leftGtRequirements);

        this.locations.get("Ganon's Tower - Randomizer Room - Top Left")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return leftGtRequirements(locations, items)
                && (!items.has('BigKeyA2') || locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Randomizer Room - Top Right",
                    "Ganon's Tower - Randomizer Room - Bottom Left",
                    "Ganon's Tower - Randomizer Room - Bottom Right",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        this.locations.get("Ganon's Tower - Randomizer Room - Top Right")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return leftGtRequirements(locations, items)
                && (!items.has('BigKeyA2') || locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Randomizer Room - Top Left",
                    "Ganon's Tower - Randomizer Room - Bottom Left",
                    "Ganon's Tower - Randomizer Room - Bottom Right",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        this.locations.get("Ganon's Tower - Randomizer Room - Bottom Left")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return leftGtRequirements(locations, items)
                && (!items.has('BigKeyA2') || locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Randomizer Room - Top Left",
                    "Ganon's Tower - Randomizer Room - Top Right",
                    "Ganon's Tower - Randomizer Room - Bottom Right",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        this.locations.get("Ganon's Tower - Randomizer Room - Bottom Right")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return leftGtRequirements(locations, items)
                && (!items.has('BigKeyA2') || locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Randomizer Room - Top Left",
                    "Ganon's Tower - Randomizer Room - Top Right",
                    "Ganon's Tower - Randomizer Room - Bottom Left",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        this.locations.get("Ganon's Tower - Firesnake Room")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return leftGtRequirements(locations, items)
                && (!items.has('BigKeyA2') || locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Randomizer Room - Top Left",
                    "Ganon's Tower - Randomizer Room - Top Right",
                    "Ganon's Tower - Randomizer Room - Bottom Left",
                    "Ganon's Tower - Randomizer Room - Bottom Right",
                ])) || (locations.get("Ganon's Tower - Firesnake Room")?.hasItem(Item.get('KeyA2', this.world)) && items.has('KeyA2', 2))
                || (items.has('KeyA2', 3));
        });

        this.locations.get("Ganon's Tower - Map Chest")?.setRequirements((locations, items) => {
            return items.has('Hammer') && (items.has('Hookshot') || items.has('PegasusBoots')) 
                && [Item.get('BigKeyA2', this.world), Item.get('KeyA2', this.world)].includes(locations.get("Ganon's Tower - Map Chest")?.item!) ? items.has('KeyA2', 3) : items.has('KeyA2', 4);
        });

        this.locations.get("Ganon's Tower - Big Chest")?.setRequirements((locations, items) => {
            return items.has('BigKeyA2') && items.has('KeyA2', 3) &&
                (leftGtRequirements(locations,items) || rightGtRequirements(locations,items));
        });

        this.locations.get("Ganon's Tower - Bob's Chest")?.setRequirements((locations, items) => {
            return items.has('KeyA2', 3) &&
                (leftGtRequirements(locations,items) || rightGtRequirements(locations,items));
        });

        this.locations.get("Ganon's Tower - Tile Chest")?.setRequirements((_locations, items) => {
            return items.has('CaneOfSomaria');
        })

        this.locations.get("Ganon's Tower - Compass Room - Top Left")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return rightGtRequirements(locations, items)
                && (items.has('KeyA2', 4) || !items.has('BigKeyA2') || locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Compass Room - Top Right",
                    "Ganon's Tower - Compass Room - Bottom Left",
                    "Ganon's Tower - Compass Room - Bottom Right",
                ]) && items.has('KeyA2', 3));
        });

        this.locations.get("Ganon's Tower - Compass Room - Top Right")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return rightGtRequirements(locations, items)
                && (!items.has('BigKeyA2') || locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Compass Room - Top Left",
                    "Ganon's Tower - Compass Room - Bottom Left",
                    "Ganon's Tower - Compass Room - Bottom Right",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        this.locations.get("Ganon's Tower - Compass Room - Bottom Left")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return rightGtRequirements(locations, items)
                && (!items.has('BigKeyA2') || locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Compass Room - Top Left",
                    "Ganon's Tower - Compass Room - Top Right",
                    "Ganon's Tower - Compass Room - Bottom Right",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        this.locations.get("Ganon's Tower - Compass Room - Bottom Right")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return rightGtRequirements(locations, items)
                && (!items.has('BigKeyA2') || locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Compass Room - Top Left",
                    "Ganon's Tower - Compass Room - Top Right",
                    "Ganon's Tower - Compass Room - Bottom Left",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        const bigKeyRoomRequirements = (locations: LocationCollection, items: ItemCollection) => {
            return ((leftGtRequirements(locations, items) || (rightGtRequirements(locations, items)))
                && items.has('KeyA2', 3) && this.boss_bottom?.canBeat(items,locations)!);
        }

        this.locations.get("Ganon's Tower - Big Key Chest")?.setRequirements(bigKeyRoomRequirements);
        this.locations.get("Ganon's Tower - Big Key Room - Left")?.setRequirements(bigKeyRoomRequirements);
        this.locations.get("Ganon's Tower - Big Key Room - Right")?.setRequirements(bigKeyRoomRequirements);

        const upstairsGtRequiremets = (locations: LocationCollection, items: ItemCollection) => {
            return items.canShootArrows(this.world) && items.canLightTorches()
                && items.has('BigKeyA2') && items.has('KeyA2', 3)
                && this.boss_middle?.canBeat(items, locations)!;
        };

        this.locations.get("Ganon's Tower - Mini Helmasaur Room - Right")?.setRequirements(upstairsGtRequiremets);
        this.locations.get("Ganon's Tower - Mini Helmasaur Room - Left")?.setRequirements(upstairsGtRequiremets);
        this.locations.get("Ganon's Tower - Pre-Moldorm Chest")?.setRequirements(upstairsGtRequiremets);

        this.locations.get("Ganon's Tower - Moldorm Chest")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return items.has('Hookshot') && items.canShootArrows(this.world) && items.canLightTorches()
                && items.has('BigKeyA2') && items.has('KeyA2', 4)
                && this.boss_middle?.canBeat(items, locations)! && this.boss_top?.canBeat(items, locations)!;
        });

        this.can_complete = (locations: LocationCollection, items: ItemCollection) => {
            return this.canEnter(locations, items)
                && this.locations.get("Ganon's Tower - Moldorm Chest")?.canAccess(items, locations)!
                && this.boss?.canBeat(items, locations)!;
        };

        this.prize?.setRequirements(this.canComplete);

        this.can_enter = (locations:LocationCollection, items:ItemCollection) => {
            return items.has('RescueZelda')
                && this.canOpen(items, this.world)
                && this.world.getRegion('East Dark World Death Mountain')!.canEnter(locations, items);
        }

        return this;
    }

    canOpen(items: ItemCollection, world: World) {
        const crystals = items.getCrystals().getCount();

        return crystals >= world.config.crystals.tower;
    }

}
import { BigKey } from "../../Item/bigkey";
import { Compass } from "../../Item/compass";
import { Key } from "../../Item/key";
import { Region } from "../../region";
import { Item } from "../../item";
import { Map } from "../../Item/map";
import type { World } from "../../world";
import { Boss } from "../../boss";
import { LocationCollection } from "../../Support/locationcollection";
import { Location } from "../../location";
import { Dash } from "../../Location/dash";
import { Chest } from "../../Location/chest";
import { BigChest } from "../../Location/bigchest";
import { Event } from "../../Location/Prize/event";
import type { ItemCollection } from "../../Support/itemcollection";

export class GanonsTower extends Region {
    boss_top?: Boss;
    boss_middle?: Boss;
    boss_bottom?: Boss;

    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyP2', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassP2', this.world),
        new Key('Key', this.world),
        new Key('KeyP2', this.world),
        new Map('Map', this.world),
        new Map('MapP2', this.world)
    ]

    public constructor(world: World) {
        super("Ganons Tower", world);

        this.boss = Boss.get("Agahnim2", world);
        this.boss_top = Boss.get("Moldorm", world);
        this.boss_middle = Boss.get("Lanmolas", world);
        this.boss_bottom = Boss.get("Armos Knights", world);

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

        this.locations.setChecksForWorld(world.id);
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

    public override initialize(): void {
        this.locations.get("Ganon's Tower - Bob's Torch")?.setRequirement((locations, items) => {
            return items.has('PegasusBoots');
        });

        const leftGtRequirement = (locations:LocationCollection, items:ItemCollection) => {
            return items.has('Hammer') && items.has('Hookshot');
        }
        this.locations.get("Ganon's Tower - DMs Room - Top Left")?.setRequirement(leftGtRequirement);
        this.locations.get("Ganon's Tower - DMs Room - Top Right")?.setRequirement(leftGtRequirement);
        this.locations.get("Ganon's Tower - DMs Room - Bottom Left")?.setRequirement(leftGtRequirement);
        this.locations.get("Ganon's Tower - DMs Room - Top Right")?.setRequirement(leftGtRequirement);

        this.locations.get("Ganon's Tower - Randomizer Room - Top Left")?.setRequirement((locations: LocationCollection, items: ItemCollection) => {
            return leftGtRequirement(locations, items)
                && (locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Randomizer Room - Top Right",
                    "Ganon's Tower - Randomizer Room - Bottom Left",
                    "Ganon's Tower - Randomizer Room - Bottom Right",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        this.locations.get("Ganon's Tower - Randomizer Room - Top Right")?.setRequirement((locations: LocationCollection, items: ItemCollection) => {
            return leftGtRequirement(locations, items)
                && (locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Randomizer Room - Top Left",
                    "Ganon's Tower - Randomizer Room - Bottom Left",
                    "Ganon's Tower - Randomizer Room - Bottom Right",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        this.locations.get("Ganon's Tower - Randomizer Room - Bottom Left")?.setRequirement((locations: LocationCollection, items: ItemCollection) => {
            return leftGtRequirement(locations, items)
                && (locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Randomizer Room - Top Left",
                    "Ganon's Tower - Randomizer Room - Top Right",
                    "Ganon's Tower - Randomizer Room - Bottom Right",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        this.locations.get("Ganon's Tower - Randomizer Room - Bottom Right")?.setRequirement((locations: LocationCollection, items: ItemCollection) => {
            return leftGtRequirement(locations, items)
                && (locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Randomizer Room - Top Left",
                    "Ganon's Tower - Randomizer Room - Top Right",
                    "Ganon's Tower - Randomizer Room - Bottom Left",
                ]) && items.has('KeyA2', 3) || items.has('KeyA2', 4));
        });

        this.locations.get("Ganon's Tower - Firesnake Room")?.setRequirement((locations: LocationCollection, items: ItemCollection) => {
            return leftGtRequirement(locations, items)
                && (locations.itemInLocations(Item.get('BigKeyA2', this.world)!, [
                    "Ganon's Tower - Randomizer Room - Top Left",
                    "Ganon's Tower - Randomizer Room - Top Right",
                    "Ganon's Tower - Randomizer Room - Bottom Left",
                    "Ganon's Tower - Randomizer Room - Bottom Right",
                ])) || (locations.get("Ganon's Tower - Firesnake Room")?.hasItem(Item.get('KeyA2', this.world)) && items.has('KeyA2', 2))
                || (items.has('KeyA2', 3));
        });

        this.locations.get("Ganon's Tower - Map Chest")?.setRequirement((locations, items) => {
            return items.has('Hammer') && (items.has('Hookshot') || items.has('PegasusBoots')) 
        })
    }

}
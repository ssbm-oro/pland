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

export class MiseryMire extends Region {
    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyD6', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassD6', this.world),
        new Key('Key', this.world),
        new Key('KeyD6', this.world),
        new Map('Map', this.world),
        new Map('MapD6', this.world)
    ];

    public constructor(world: World) {
        super("MiseryMire", world);

        this.boss = Boss.get("Vitreous", world);

        this.locations = new LocationCollection([
            new BigChest("Misery Mire - Big Chest", this),
            new Chest("Misery Mire - Main Lobby", this),
            new Chest("Misery Mire - Big Key Chest", this),
            new Chest("Misery Mire - Compass Chest", this),
            new Chest("Misery Mire - Bridge Chest", this),
            new Chest("Misery Mire - Map Chest", this),
            new Chest("Misery Mire - Spike Chest", this),
            new Drop("Misery Mire - Boss", this),

            new Crystal("Misery Mire - Prize", this)
        ]);

        this.locations.setChecksForWorld(world.id);
        this.prize = this.locations.get("Misery Mire - Prize")!;
    }

    public override initialize(): Region {
        this.locations.get("Misery Mire - Big Chest")?.setRequirements((locations, items) => {
            return items.has('BigKeyD6');
        });

        this.locations.get("Misery Mire - Main Lobby")?.setRequirements((locations, items) => {
            return items.has('KeyD6') || items.has('BigKeyD6');
        });

        this.locations.get("Misery Mire - Map Chest")?.setRequirements((locations, items) => {
            return items.has('KeyD6') || items.has('BigKeyD6');
        });

        this.locations.get("Misery Mire - Big Key Chest")?.setRequirements((locations, items) => {
            return items.canLightTorches()
                && ((locations.get("Misery Mire - Compass Chest")?.hasItem(Item.get('BigKeyD6', this.world)) && items.has('KeyD6', 2)) || items.has('KeyD6', 3));
        });

        this.locations.get("Misery Mire - Compass Chest")?.setRequirements((locations, items) => {
            return items.canLightTorches()
                && ((locations.get("Misery Mire - Big Key Chest")?.hasItem(Item.get('BigKeyD6', this.world)) && items.has('KeyD6', 2)) || items.has('KeyD6', 3));
        });

        this.canComplete = (locations, items) => {
            return this.locations.get("Misery Mire - Boss")?.canAccess(items, locations)!;
        };

        this.locations.get("Misery Mire - Boss")?.setRequirements((locations, items) => {
            return this.canEnter(locations, items)
                && items.has('CaneOfSomaria') && (items.has('Lamp'))
                && items.has('BigKeyD6')
                && this.boss?.canBeat(items, locations)!
        });

        this.canEnter = (locations, items) => {
            return items.has('RescueZelda')
                && (items.has(locations.get('Misery Mire Medallion')?.item?.name!))
                && items.hasSword()
                && items.has('MoonPearl')
                && (items.has('HookShot') || items.has('PegasusBoots'))
                && items.canKillMostThings(this.world, 8)
                && this.world.getRegion('Mire').canEnter(locations, items);
        }

        this.prize?.setRequirements(this.canComplete)

        return this;
    }
}
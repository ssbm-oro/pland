import Item, { BigKey, Compass, Key, Map } from "../../item";
import { Chest } from "../../Location/chest";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type World from "../../world";
import { Boss } from "../../boss";
import { BigChest } from "../../Location/bigchest";
import { Drop } from "../../Location/drop";
import { Crystal } from "../../Location/Prize/crystal";

export class MiseryMire extends Region {
    override region_items: Item[] = [
        Item.get('BigKey', this.world)!,
        Item.get('BigKeyD6', this.world)!,
        Item.get('Compass', this.world)!,
        Item.get('CompassD6', this.world)!,
        Item.get('Key', this.world)!,
        Item.get('KeyD6', this.world)!,
        Item.get('Map', this.world)!,
        Item.get('MapD6', this.world)!
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

        this.can_complete = (locations, items) => {
            return this.locations.get("Misery Mire - Boss")?.canAccess(items, locations)!;
        };

        this.locations.get("Misery Mire - Boss")?.setRequirements((locations, items) => {
            return this.canEnter(locations, items)
                && items.has('CaneOfSomaria') && (items.has('Lamp'))
                && items.has('BigKeyD6')
                && this.boss?.canBeat(items, locations)!
        });

        this.can_enter = (locations, items) => {

            let haveMedallion = false;
            let medallion = locations.get('Misery Mire Medallion')
            if (!medallion || !medallion.item) {
                haveMedallion = items.has('Bombos') || items.has('Ether') || items.has('Quake')
                this.world.log(`Misery Mire Medallion not set. HaveMedallion based on any medallion: ${haveMedallion}`);
                console.log(`Misery Mire Medallion not set. HaveMedallion based on any medallion: ${haveMedallion}`);
            }
            else {
                haveMedallion = items.has(medallion.item.name);
                this.world.log(`Misery Mire Medallion is ${medallion.item.name}. HaveMedallion: ${haveMedallion}`);
            }

            return items.has('RescueZelda')
                && haveMedallion
                && items.hasSword()
                && items.has('MoonPearl')
                && (items.has('Hookshot') || items.has('PegasusBoots'))
                && items.canKillMostThings(this.world, 8)
                && this.world.getRegion('Mire')!.canEnter(locations, items);
        }

        this.prize?.setRequirements(this.canComplete)

        return this;
    }
}
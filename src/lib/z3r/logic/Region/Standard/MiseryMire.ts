import Item from "../../Item";
import { Chest, BigChest, Drop, Crystal } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import { Bosses } from "../../Boss";
import { log } from "../../Logic";

export class MiseryMire extends Dungeon {
    public constructor(world: World) {
        super("MiseryMire", world);

        this.region_items = [
            Item.get('BigKey', this.world.id)!,
            Item.get('BigKeyD6', this.world.id)!,
            Item.get('Compass', this.world.id)!,
            Item.get('CompassD6', this.world.id)!,
            Item.get('Key', this.world.id)!,
            Item.get('KeyD6', this.world.id)!,
            Item.get('Map', this.world.id)!,
            Item.get('MapD6', this.world.id)!
        ];

        this.boss = Bosses.get("Vitreous", world);

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
        this.prize = this.locations.get("Misery Mire - Prize");
    }

    public override initialize() {
        this.locations.get("Misery Mire - Big Chest")?.setRequirements((_item, _locations, items) => {
            return items.has('BigKeyD6');
        });

        this.locations.get("Misery Mire - Main Lobby")?.setRequirements((_item, _locations, items) => {
            return items.has('KeyD6') || items.has('BigKeyD6');
        });

        this.locations.get("Misery Mire - Map Chest")?.setRequirements((_item, _locations, items) => {
            return items.has('KeyD6') || items.has('BigKeyD6');
        });

        this.locations.get("Misery Mire - Big Key Chest")?.setRequirements((_item, locations, items) => {
            return items.canLightTorches()
                && ((locations.get("Misery Mire - Compass Chest")?.hasItem(Item.get('BigKeyD6', this.world.id)) && items.has('KeyD6', 2)) || items.has('KeyD6', 3));
        });

        this.locations.get("Misery Mire - Compass Chest")?.setRequirements((_item, locations, items) => {
            return items.canLightTorches()
                && ((locations.get("Misery Mire - Big Key Chest")?.hasItem(Item.get('BigKeyD6', this.world.id)) && items.has('KeyD6', 2)) || items.has('KeyD6', 3));
        });

        this.can_complete = (locations, items) => {
            return this.locations.get("Misery Mire - Boss")?.canAccess(items, locations);
        };

        this.locations.get("Misery Mire - Boss")?.setRequirements((item, locations, items) => {
            return this.canEnter(locations, items)
                && items.has('CaneOfSomaria') && (items.has('Lamp'))
                && items.has('BigKeyD6')
                && this.boss?.canBeat(items, locations, item) || false
        });

        this.can_enter = (locations, items) => {

            let haveMedallion = false;
            const medallion = locations.get('Misery Mire Medallion')
            if (!medallion || !medallion.item) {
                haveMedallion = items.has('Bombos') || items.has('Ether') || items.has('Quake')
                log(`Misery Mire Medallion not set. HaveMedallion based on any medallion: ${haveMedallion}`);
            }
            else {
                haveMedallion = items.has(medallion.item.name);
                log(`Misery Mire Medallion is ${medallion.item.name}. HaveMedallion: ${haveMedallion}`);
            }

            return items.has('RescueZelda')
                && haveMedallion
                && items.hasSword()
                && items.has('MoonPearl')
                && (items.has('Hookshot') || items.has('PegasusBoots'))
                && items.canKillMostThings(this.world, 8)
                && this.world.getRegion('Mire')?.canEnter(locations, items) || false;
        }

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items))

        return this;
    }
}
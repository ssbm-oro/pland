import Item, { BigKey, Compass, Key, Map } from "../../item";
import { Chest } from "../../Location/chest";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type World from "../../world";
import { Boss } from "../../boss";
import { BigChest } from "../../Location/bigchest";
import { Drop } from "../../Location/drop";
import { Crystal } from "../../Location/Prize/crystal";
import type { ItemCollection } from "../../Support/itemcollection";

export class PalaceOfDarkness extends Region {
    override region_items: Item[] = [
        Item.get('BigKey', this.world)!,
        Item.get('BigKeyD1', this.world)!,
        Item.get('Compass', this.world)!,
        Item.get('CompassD1', this.world)!,
        Item.get('Key', this.world)!,
        Item.get('KeyD1', this.world)!,
        Item.get('Map', this.world)!,
        Item.get('MapD1', this.world)!
    ];

    public constructor(world: World) {
        super("Dark Palace", world);

        this.boss = Boss.get("Helmasaur", world);

        this.locations = new LocationCollection([
            new Chest("Palace of Darkness - Shooter Room", this),
            new Chest("Palace of Darkness - Big Key Chest", this),
            new Chest("Palace of Darkness - Shooter Room", this),
            new Chest("Palace of Darkness - The Arena - Ledge", this),
            new Chest("Palace of Darkness - The Arena - Bridge", this),
            new Chest("Palace of Darkness - Stalfos Basement", this),
            new Chest("Palace of Darkness - Map Chest", this),
            new BigChest("Palace of Darkness - Big Chest", this),
            new Chest("Palace of Darkness - Compass Chest", this),
            new Chest("Palace of Darkness - Harmless Hellway", this),
            new Chest("Palace of Darkness - Dark Basement - Left", this),
            new Chest("Palace of Darkness - Dark Basement - Right", this),
            new Chest("Palace of Darkness - Dark Maze - Top", this),
            new Chest("Palace of Darkness - Dark Maze - Bottom", this),
            new Drop("Palace of Darkness - Boss", this),

            new Crystal("Palace of Darkness - Prize", this),
        ]);

        this.locations.setChecksForWorld(world.id);
        this.prize = this.locations.get("Palace of Darkness - Prize")!;
    }

    public override initialize(): Region {
        const bowLockedRequirements = (locations: LocationCollection, items: ItemCollection) => { return items.canShootArrows(this.world) };
        this.locations.get("Palace of Darkness - The Arena - Ledge")?.setRequirements(bowLockedRequirements);
        this.locations.get("Palace of Darkness - Map Chest")?.setRequirements(bowLockedRequirements);

        this.locations.get("Palace of Darkness - Big Key Chest")?.setRequirements((locations, items) => {
            if (locations.get("Palace of Darkness - Big Key Chest")?.hasItem(Item.get('KeyD1', this.world)))
                return items.has('KeyD1');

            return (((items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 6): items.has('KeyD1', 5) )));
        });

        this.locations.get("Palace of Darkness - The Arena - Bridge")?.setRequirements((locations, items) => {
            return items.has('KeyD1') || (items.canShootArrows(this.world) && items.has('Hammer'));
        })

        const darkMazeRequirements = (locations:LocationCollection, items: ItemCollection) => {
            return items.has('Lamp')
                && (items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 6): items.has('KeyD1', 5));
        };

        this.locations.get("Palace of Darkness - Big Chest")?.setRequirements((locations, items) => {
            return darkMazeRequirements(locations, items) && items.has('BigKeyD1');
        });

        this.locations.get("Palace of Darkness - Compass Chest")?.setRequirements((locations, items) => {
            return (items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 4): items.has('KeyD1', 3));
        });

        this.locations.get("Palace of Darkness - Harmless Hellway")?.setRequirements((locations, items) => {
            if (locations.get("Palace of Darkness - Harmless Hellway")?.hasItem(Item.get('KeyD1', this.world))) {
                return (items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 4) : items.has('KeyD1', 3));
            }

            return (items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 6) : items.has('KeyD1', 5));
        });

        this.locations.get("Palace of Darkness - Stalfos Basement")?.setRequirements((locations, items) => {
            return items.has('KeyD1') || (items.canShootArrows(this.world) && items.has('Hammer'));
        });

        const darkBasementRequirements = (locations: LocationCollection, items: ItemCollection) => items.canLightTorches() && (items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 4) : items.has('KeyD1', 3));

        this.locations.get("Palace of Darkness - Dark Basement - Left")?.setRequirements(darkBasementRequirements);
        this.locations.get("Palace of Darkness - Dark Basement - Right")?.setRequirements(darkBasementRequirements);

        this.locations.get("Palace of Darkness - Dark Maze - Top")?.setRequirements(darkMazeRequirements);
        this.locations.get("Palace of Darkness - Dark Maze - Bottom")?.setRequirements(darkMazeRequirements);

        this.can_complete = (locations, items) => {
            return this.locations.get("Palace of Darkness - Boss")?.canAccess(items, locations)!;
        };

        this.locations.get("Palace of Darkness - Boss")?.setRequirements((locations, items) => {
            return this.canEnter(locations, items)
                && this.boss?.canBeat(items, locations)!
                && items.has('Hammer') && items.has('Lamp') && items.canShootArrows(this.world)
                && items.has('BigKeyD6') && items.has('KeyD6', 6);
        });

        this.can_enter = (locations, items) => {
            return items.has('RescueZelda')
                && (items.has('MoonPearl') && this.world.getRegion('North East Dark World')!.canEnter(locations, items));
        };

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
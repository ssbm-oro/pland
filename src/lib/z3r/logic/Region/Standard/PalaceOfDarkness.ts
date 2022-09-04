import Item, { type IItem } from "../../Item";
import { Chest, BigChest, Drop, Crystal } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import { Bosses } from "../../Boss";
import type { ItemCollection } from "../../Support/ItemCollection";

export class PalaceOfDarkness extends Dungeon {
    public constructor(world: World) {
        super("Dark Palace", world);

        this.region_items = [
            Item.get('BigKey', this.world)!,
            Item.get('BigKeyD1', this.world)!,
            Item.get('Compass', this.world)!,
            Item.get('CompassD1', this.world)!,
            Item.get('Key', this.world)!,
            Item.get('KeyD1', this.world)!,
            Item.get('Map', this.world)!,
            Item.get('MapD1', this.world)!
        ];

        this.boss = Bosses.get("Helmasaur King", world);

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

        this.locations.setChecksForWorld(world);
        this.prize = this.locations.get("Palace of Darkness - Prize");
    }

    public override initialize() {
        const bowLockedRequirements = (_items: unknown, _locations: LocationCollection, items: ItemCollection) => { return items.canShootArrows(this.world) };
        this.locations.get("Palace of Darkness - The Arena - Ledge")?.setRequirements(bowLockedRequirements);
        this.locations.get("Palace of Darkness - Map Chest")?.setRequirements(bowLockedRequirements);

        this.locations.get("Palace of Darkness - Big Key Chest")?.setRequirements((_item, locations, items) => {
            if (locations.get("Palace of Darkness - Big Key Chest")?.hasItem(Item.get('KeyD1', this.world)))
                return items.has('KeyD1');

            return (((items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 6): items.has('KeyD1', 5) )));
        });

        this.locations.get("Palace of Darkness - The Arena - Bridge")?.setRequirements((_item, _locations, items) => {
            return items.has('KeyD1') || (items.canShootArrows(this.world) && items.has('Hammer'));
        })

        const darkMazeRequirements = (_item: IItem | null, _locations:LocationCollection, items: ItemCollection) => {
            return items.has('Lamp')
                && (items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 6): items.has('KeyD1', 5));
        };

        this.locations.get("Palace of Darkness - Big Chest")?.setRequirements((item, locations, items) => {
            return darkMazeRequirements(item, locations, items) && items.has('BigKeyD1');
        });

        this.locations.get("Palace of Darkness - Compass Chest")?.setRequirements((_item, _locations, items) => {
            return (items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 4): items.has('KeyD1', 3));
        });

        this.locations.get("Palace of Darkness - Harmless Hellway")?.setRequirements((_item, locations, items) => {
            if (locations.get("Palace of Darkness - Harmless Hellway")?.hasItem(Item.get('KeyD1', this.world))) {
                return (items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 4) : items.has('KeyD1', 3));
            }

            return (items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 6) : items.has('KeyD1', 5));
        });

        this.locations.get("Palace of Darkness - Stalfos Basement")?.setRequirements((_item, _locations, items) => {
            return items.has('KeyD1') || (items.canShootArrows(this.world) && items.has('Hammer'));
        });

        const darkBasementRequirements = (_item: unknown, _locations: LocationCollection, items: ItemCollection) => items.canLightTorches() && (items.has('Hammer') && items.canShootArrows(this.world) && items.has('Lamp') ? items.has('KeyD1', 4) : items.has('KeyD1', 3));

        this.locations.get("Palace of Darkness - Dark Basement - Left")?.setRequirements(darkBasementRequirements);
        this.locations.get("Palace of Darkness - Dark Basement - Right")?.setRequirements(darkBasementRequirements);

        this.locations.get("Palace of Darkness - Dark Maze - Top")?.setRequirements(darkMazeRequirements);
        this.locations.get("Palace of Darkness - Dark Maze - Bottom")?.setRequirements(darkMazeRequirements);

        this.can_complete = (locations, items) => {
            return this.locations.get("Palace of Darkness - Boss")?.canAccess(items, locations);
        };

        this.locations.get("Palace of Darkness - Boss")?.setRequirements((_item, locations, items) => {
            return this.canEnter(locations, items)
                && (this.boss?.canBeat(items, locations) || false)
                && items.has('Hammer') && items.has('Lamp') && items.canShootArrows(this.world)
                && items.has('BigKeyD1') && items.has('KeyD1', 6);
        });

        this.can_enter = (locations, items) => {
            return items.has('RescueZelda')
                && (items.has('MoonPearl') && this.world.getRegion('North East Dark World')?.canEnter(locations, items) || false);
        };

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items));

        return this;
    }
}
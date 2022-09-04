import Item from "../../Item";
import Region from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";
import { Bosses } from "../../Boss";
import { BigChest, Chest, Crystal, Drop } from "../../Location";

export class SkullWoods extends Region {
    public constructor(world: World) {
        super("Skull Woods", world);

        this.region_items = [
            Item.get('BigKey', this.world.id)!,
            Item.get('BigKeyD3', this.world.id)!,
            Item.get('Compass', this.world.id)!,
            Item.get('CompassD3', this.world.id)!,
            Item.get('Key', this.world.id)!,
            Item.get('KeyD3', this.world.id)!,
            Item.get('Map', this.world.id)!,
            Item.get('MapD3', this.world)!
        ];

        this.boss = Bosses.get("Mothula", world);

        this.locations = new LocationCollection([
            new BigChest("Skull Woods - Big Chest", this),
            new Chest("Skull Woods - Big Key Chest", this),
            new Chest("Skull Woods - Compass Chest", this),
            new Chest("Skull Woods - Map Chest", this),
            new Chest("Skull Woods - Bridge Chest", this),
            new Chest("Skull Woods - Pot Prison", this),
            new Chest("Skull Woods - Pinball Room", this),
            new Drop("Skull Woods - Boss", this),

            new Crystal("Skull Woods - Prize", this)
        ]);
        this.locations.setChecksForWorld(world);

        this.prize = this.locations.get("Skull Woods - Prize");
    }

    public override initialize() {
        this.locations.get("Skull Woods - Big Chest")?.setRequirements((_item, _locations, items) => {
            return items.has('BigKeyD3');
        });

        this.locations.get("Skull Woods - Bridge Room")?.setRequirements((_item, _locations, items) => {
            return items.has('MoonPearl') && items.has('FireRod');
        });

        this.can_complete = (locations, items) => {
            return this.locations.get('Skull Woods - Boss')?.canAccess(items, locations);
        };

        this.locations.get("Skull Woods - Boss")?.setRequirements((_item, locations, items) => {
            return this.canEnter(locations, items)
                && items.has('MoonPearl') && items.has('FireRod')
                && items.hasSword()
                && items.has('KeyD3', 3)
                && this.boss?.canBeat(items, locations) || false;
        });

        this.can_enter = (locations, items) => {
            return items.has('RescueZelda')
                && items.has('MoonPearl')
                && this.world.getRegion('North West Dark World')?.canEnter(locations, items) || false;
        };

        this.prize?.setRequirements((_item, locations, items) => this.canComplete(locations, items));

        return this;
    }
}
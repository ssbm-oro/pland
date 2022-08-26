import { Bosses } from "../../Boss";
import Item from "../../Item";
import type IItem from "../../Item";
import { Pendant, BigChest, Chest, Drop, Prize } from "../../Location";
import { Dungeon } from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";

export class EasternPalace extends Dungeon {

    public constructor(world: World) {
        super("Eastern Palace", world);

        this.region_items = [
            Item.get('BigKey', this.world)!,
            Item.get('BigKeyP1', this.world)!,
            Item.get('Compass', this.world)!,
            Item.get('CompassP1', this.world)!,
            Item.get('Map', this.world)!,
            Item.get('MapP1', this.world)!,
            Item.get('Key', this.world)!,
            Item.get('KeyP1', this.world)!
        ];

        this.boss = Bosses.get("Armos Knights", world);

        this.locations = new LocationCollection([
            new Chest("Eastern Palace - Compass Chest", this),
            new BigChest("Eastern Palace - Compass Chest", this),
            new Chest("Eastern Palace - Canonball Chest", this),
            new Chest("Eastern Palace - Big Key Chest", this),
            new Chest("Eastern Palace - Map Chest", this),
            new Drop("Eastern Palace - Boss", this),

            new Pendant("Eastern Palace - Prize", this)
        ]);

        this.locations.setChecksForWorld(world);
        this.setPrizeLocation(this.locations.get("Eastern Palace - Prize") as Prize);
    }

    public override initialize() {
        this.locations.get("Eastern Palace - Big Chest")?.setRequirements((_locations, items) => {
            return items.has('BigKeyP1');
        });

        this.locations.get("Eastern Palace - Big Key Chest")?.setRequirements((_locations, items) => {
            return items.has('Lamp');
        });

        this.can_complete = (locations, items) => {
            return this.locations.get("Eastern Palace - Boss")?.canAccess(items, locations)!;
        }

        this.locations.get("Eastern Palace - Boss")?.setRequirements((locations, items) => {
            return items.canShootArrows(this.world)
                && items.canLightTorches()
                && items.has('BigKeyP1')
                && this.boss?.canBeat(items, locations)!;
        });

        this.can_enter = (_locations, items) => {
            return items.has('RescueZelda');
        };

        return this;
    }
}
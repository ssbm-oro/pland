import Item from "../../Item";
import Region from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type { ItemCollection } from "../../Support/ItemCollection";
import { Chest, Uncle, Event } from "../../Location";
import type World from "../../World";

export class HyruleCastleEscape extends Region {
    override region_items: Item[] = [
        Item.get('BigKey', this.world)!,
        Item.get('BigKeyH2', this.world)!,
        Item.get('Compass', this.world)!,
        Item.get('CompassH2', this.world)!,
        Item.get('Key', this.world)!,
        Item.get('KeyH2', this.world)!,
        Item.get('Map', this.world)!,
        Item.get('MapH2', this.world)!
    ];

    public constructor(world: World) {
        super("Hyrule Castle", world);

        this.locations = new LocationCollection([
            new Chest("Sanctuary", this),
            new Chest("Sewers - Secret Room - Left", this),
            new Chest("Sewers - Secret Room - Middle", this),
            new Chest("Sewers - Secret Room - Right", this),
            new Chest("Sewers - Dark Cross", this),
            new Chest("Hyrule Castle - Boomerang Chest", this),
            new Chest("Hyrule Castle - Map Chest", this),
            new Chest("Hyrule Castle - Zelda's Cell", this),
            new Uncle("Link's Uncle", this),
            new Chest("Secret Passage", this),
            new Event("Zelda", this)
        ]);

        this.prize = this.locations.get("Zelda")!;
        this.prize.setItem(Item.get('RescueZelda', world)!);
    }

    public override initialize() {
        const backOfEscapeRequirements = (location: LocationCollection, items: ItemCollection) => {
            return items.canKillMostThings(this.world) && items.has('KeyH2');
        };

        this.locations.get("Sanctuary")?.setRequirements(backOfEscapeRequirements);
        this.locations.get("Sewers - Secret Room - Left")?.setRequirements(backOfEscapeRequirements);
        this.locations.get("Sewers - Secret Room - Middle")?.setRequirements(backOfEscapeRequirements);
        this.locations.get("Sewers - Secret Room - Right")?.setRequirements(backOfEscapeRequirements);
        
        this.locations.get("Sewers - Dark Cross")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return items.canKillMostThings(this.world);
        });

        this.locations.get("Hyrule Castle - Boomerang Chest")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return items.canKillMostThings(this.world);
        });
        this.locations.get("Hyrule Castle - Map Chest")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return items.canKillMostThings(this.world);
        });
        this.locations.get("Hyrule Castle - Zelda's Cell")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return items.canKillMostThings(this.world);
        });
        this.locations.get("Secret Passage")?.setRequirements((locations: LocationCollection, items: ItemCollection) => {
            return items.canKillMostThings(this.world);
        });

        this.can_complete = (locations: LocationCollection, items: ItemCollection) => {
            return this.locations.get("Sanctuary")?.canAccess(items, locations)!;
        }

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
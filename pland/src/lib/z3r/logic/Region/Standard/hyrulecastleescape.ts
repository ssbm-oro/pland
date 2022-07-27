import Item, { BigKey, Compass, Key, Map} from "../../item";
import { Region } from "../../region";
import type World from "../../world";
import { LocationCollection } from "../../Support/locationcollection";
import { Event } from "../../Location/Prize/event";
import { Uncle } from "../../Location/Npc/uncle";
import { Chest } from "../../Location/chest";
import type { ItemCollection } from "../../Support/itemcollection";

export class HyruleCastleEscape extends Region {
    override region_items: Item[] = [
        new BigKey('BigKey', this.world),
        new BigKey('BigKeyH2', this.world),
        new Compass('Compass', this.world),
        new Compass('CompassH2', this.world),
        new Key('Key', this.world),
        new Key('KeyH2', this.world),
        new Map('Map', this.world),
        new Map('MapH2', this.world)
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

    public override initialize(): Region {
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

        this.canComplete = (locations: LocationCollection, items: ItemCollection) => {
            return this.locations.get("Sanctuary")?.canAccess(items, locations)!;
        }

        this.prize?.setRequirements(this.canComplete);

        return this;
    }
}
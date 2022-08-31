import type { LocationCollection } from "../../Support/LocationCollection";
import type { ItemCollection } from "../../Support/ItemCollection";
import { HyruleCastleEscape } from "../Standard/HyruleCastleEscape";

export class OpenHyruleCastleEscape extends HyruleCastleEscape {
    public override initialize() {
        const secretRoomRequirements = (_locations: LocationCollection, items: ItemCollection) => {
            return items.canLiftRocks() || ((items.canLightTorches() && items.has("KeyH2") && (items.canKillMostThings(this.world))));
        }
        
        this.locations.get("Sewers - Secret Room - Left")?.setRequirements(secretRoomRequirements);
        this.locations.get("Sewers - Secret Room - Middle")?.setRequirements(secretRoomRequirements);
        this.locations.get("Sewers - Secret Room - Right")?.setRequirements(secretRoomRequirements);

        this.locations.get("Sewers - Dark Cross")?.setRequirements((_locations, items) => {
            return items.canLightTorches();
        });

        this.locations.get("Hyrule Castle - Boomerang Chest")?.setRequirements((_locations, items) => {
            return items.has("KeyH2") && items.canKillMostThings(this.world);
        });

        this.locations.get("Hyrule Castle - Zelda's Cell")?.setRequirements((_locations, items) => {
            return items.has("KeyH2") && items.canKillMostThings(this.world);
        });

        return this;
    }
}
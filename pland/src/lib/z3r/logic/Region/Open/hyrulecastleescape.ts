import type { Region } from "../../region";
import type { LocationCollection } from "../../Support/locationcollection";
import type { ItemCollection } from "../../Support/itemcollection";
import { HyruleCastleEscape } from "../Standard/hyrulecastleescape";

export class OpenHyruleCastleEscape extends HyruleCastleEscape {
    public override initialize(): Region {
        const secretRoomRequirements = (locations: LocationCollection, items: ItemCollection) => {
            return items.canLiftRocks() || ((items.canLightTorches() && items.has("KeyH2") && (items.canKillMostThings(this.world))));
        }
        
        this.locations.get("Sewers - Secret Room - Left")?.setRequirements(secretRoomRequirements);
        this.locations.get("Sewers - Secret Room - Middle")?.setRequirements(secretRoomRequirements);
        this.locations.get("Sewers - Secret Room - Right")?.setRequirements(secretRoomRequirements);

        this.locations.get("Sewers - Dark Cross")?.setRequirements((locations, items) => {
            return items.canLightTorches();
        });

        this.locations.get("Hyrule Castle - Boomerang Chest")?.setRequirements((locations, items) => {
            return items.has("KeyH2") && items.canKillMostThings(this.world);
        });

        this.locations.get("Hyrule Castle - Zelda's Cell")?.setRequirements((locations, items) => {
            return items.has("KeyH2") && items.canKillMostThings(this.world);
        });

        return this;
    }
}
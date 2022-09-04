import Item from "$lib/z3r/logic/Item";
import { Chest, Npc, Witch, Zora, Standing } from "$lib/z3r/logic/Location";
import Region from "$lib/z3r/logic/Region";
import type { ItemCollection } from "$lib/z3r/logic/Support/ItemCollection";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class NorthEast extends Region {
    public constructor(world: World) {
        super("Light World", world);

        this.locations = new LocationCollection([
            new Chest("Sahasrahla's Hut - Left", this),
            new Chest("Sahasrahla's Hut - Middle", this),
            new Chest("Sahasrahla's Hut - Right", this),
            new Npc("Sahasrahla", this),
            new Zora("King Zora", this),
            new Witch("Potion Shop", this),
            new Standing("Zora Ledge", this),
            new Chest("Waterfall Fairy - Left", this),
            new Chest("Waterfall Fairy - Right", this)
        ]);
        this.locations.setChecksForWorld(world.id);
    }

    public override initialize() {
        this.locations.get("Sahasrahla")?.setRequirements((_item, _locations, items) => {
            return items.has("PendantOfCourage");
        });

        this.locations.get("King Zora")?.setRequirements((item, locations, items) => {
            return items.canLiftRocks() || items.hasOrCanGet("Flippers", locations, item);
        });

        this.locations.get("Potion Shop")?.setRequirements((item, locations, items) => {
            return (items.hasOrCanGet("Mushroom", locations, item));
        });

        this.locations.get("Zora Ledge")?.setRequirements((item, locations, items) => {
            return items.hasOrCanGet("Flippers", locations, item);
        });

        this.locations.get("Waterfall Fairy - Left")?.setRequirements((item, locations, items) => {
            return items.hasOrCanGet("Flippers", locations, item);
        });

        this.locations.get("Waterfall Fairy - Right")?.setRequirements((item, locations, items) => {
            return items.hasOrCanGet("Flippers", locations, item);
        });

        this.can_enter = (_locations: LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda");
        }

        return this;
    }
}
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
        this.locations.setChecksForWorld(world);
    }

    public override initialize() {
        this.locations.get("Sahasrahla")?.setRequirements((_item, _locations, items) => {
            return items.has("PendantOfCourage");
        });

        this.locations.get("King Zora")?.setRequirements((_item, _locations, items) => {
            return items.canLiftRocks() || items.has("Flippers");
        });

        this.locations.get("Potion Shop")?.setRequirements((_item, _locations, items) => {
            return items.has("Mushroom");
        });

        this.locations.get("Zora Ledge")?.setRequirements((_item, _locations, items) => {
            return items.has("Flippers");
        });

        this.locations.get("Waterfall Fairy - Left")?.setRequirements((_item, _locations, items) => {
            return items.has("Flippers");
        });

        this.locations.get("Waterfall Fairy - Right")?.setRequirements((_item, _locations, items) => {
            return items.has("Flippers");
        });

        this.can_enter = (_locations: LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda");
        }

        return this;
    }
}
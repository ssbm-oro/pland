import type { IItem } from "$lib/z3r/logic/Item";
import { Chest, Npc, Standing, Dash, Dig, Bombos } from "$lib/z3r/logic/Location";
import Region from "$lib/z3r/logic/Region";
import type { ItemCollection } from "$lib/z3r/logic/Support/ItemCollection";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class South extends Region {
    public constructor(world: World) {
        super("Light World", world);

        this.locations = new LocationCollection([
            new Chest("Floodgate Chest", this),
            new Chest("Link's House", this),
            new Chest("Aginah's Cave", this),
            new Chest("Minimoldorm Cave - Far Left", this),
            new Chest("Minimoldorm Cave - Left", this),
            new Chest("Minimoldorm Cave - Right", this),
            new Chest("Minimoldorm Cave - Far Right", this),
            new Chest("Ice Rod Cave", this),
            new Npc("Hobo", this),
            new Bombos("Bombos Tablet", this),
            new Standing("Cave 45", this),
            new Standing("Checkerboard Cave", this),
            new Npc("Minimoldorm Cave - NPC", this),
            new Dash("Library", this),
            new Standing("Maze Race", this),
            new Standing("Desert Ledge", this),
            new Standing("Lake Hylia Island", this),
            new Standing("Sunken Treasure", this),
            new Dig("Flute Spot", this)
        ]);
        this.locations.setChecksForWorld(world.id);
    }

    override initialize() {
        this.locations.get("Aginah's Cave")?.setRequirements((_item, _locations, items) => {
            return items.canBombThings();
        });

        const miniMoldormCaveRequirements = (_item: IItem | null, _locations: LocationCollection, items: ItemCollection) => {
            return items.canBombThings() && items.canKillMostThings(this.world);
        }

        this.locations.get("Minimoldorm Cave - Far Left")?.setRequirements(miniMoldormCaveRequirements);
        this.locations.get("Minimoldorm Cave - Left")?.setRequirements(miniMoldormCaveRequirements);
        this.locations.get("Minimoldorm Cave - Right")?.setRequirements(miniMoldormCaveRequirements);
        this.locations.get("Minimoldorm Cave - Far Right")?.setRequirements(miniMoldormCaveRequirements);
        this.locations.get("Minimoldorm Cave - NPC")?.setRequirements(miniMoldormCaveRequirements);

        this.locations.get("Hobo")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("Flippers", locations, item, locations_checked);
        });

        this.locations.get("Bombos Tablet")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("BookOfMudora", locations, item, locations_checked) && items.hasSword(2)
                && (items.hasOrCanGet("MagicMirror", locations, item, locations_checked) && this.world.getRegion("South Dark World")?.canEnter(locations, items, item, locations_checked) || false);
        });

        this.locations.get("Cave 45")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("MagicMirror", locations, item, locations_checked) && this.world.getRegion("South Dark World")?.canEnter(locations, items, item, locations_checked) || false;
        });

        this.locations.get("Checkerboard Cave")?.setRequirements((item, locations, items, locations_checked) => {
            return items.canLiftRocks()
                && (items.hasOrCanGet("MagicMirror", locations, item, locations_checked) && this.world.getRegion("Mire")?.canEnter(locations, items, item, locations_checked) || false);
        });

        this.locations.get("Library")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("PegasusBoots", locations, item, locations_checked);
        });

        this.locations.get("Desert Ledge")?.setRequirements((item, locations, items, locations_checked) => {
            return this.world.getRegion("Desert Palace")?.canEnter(locations, items, item, locations_checked) || false;
        })

        this.locations.get("Lake Hylia Island")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("Flippers", locations, item, locations_checked) && items.hasOrCanGet("MagicMirror", locations, item, locations_checked)
                && this.world.getRegion("North East Dark World")?.canEnter(locations, items, item, locations_checked) || false;
        });

        this.locations.get("Flute Spot")?.setRequirements((item, locations, items, locations_checked) => {
            return items.hasOrCanGet("Shovel", locations, item, locations_checked);
        })

        this.can_enter = (_locations: LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda");
        }

        return this;
    }
}
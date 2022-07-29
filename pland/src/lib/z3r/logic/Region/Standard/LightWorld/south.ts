import { Chest } from "$lib/z3r/logic/Location/chest";
import { Npc } from "$lib/z3r/logic/Location/npc";
import { Standing } from "$lib/z3r/logic/Location/standing";
import { Region } from "$lib/z3r/logic/region";
import type { ItemCollection } from "$lib/z3r/logic/Support/itemcollection";
import { LocationCollection } from "$lib/z3r/logic/Support/locationcollection";
import type World from "$lib/z3r/logic/world";
import { Dash } from "$lib/z3r/logic/Location/dash";
import { Dig } from "$lib/z3r/logic/Location/dig";
import { Bombos } from "$lib/z3r/logic/Location/Drop/bombos";

export class South extends Region {
    public constructor(world: World, messages: string[]|null = null) {
        super("Light World", world, messages);

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

    override initialize(): Region {
        this.locations.get("Aginah's Cave")?.setRequirements((locations, items) => {
            return items.canBombThings();
        });

        const miniMoldormCaveRequirements = (locations: LocationCollection, items: ItemCollection) => {
            return items.canBombThings() && items.canKillMostThings(this.world);
        }

        this.locations.get("Minimoldorm Cave - Far Left")?.setRequirements(miniMoldormCaveRequirements);
        this.locations.get("Minimoldorm Cave - Left")?.setRequirements(miniMoldormCaveRequirements);
        this.locations.get("Minimoldorm Cave - Right")?.setRequirements(miniMoldormCaveRequirements);
        this.locations.get("Minimoldorm Cave - Far Right")?.setRequirements(miniMoldormCaveRequirements);
        this.locations.get("Minimoldorm Cave - NPC")?.setRequirements(miniMoldormCaveRequirements);

        this.locations.get("Hobo")?.setRequirements((locations, items) => {
            return items.has("Flippers");
        });

        this.locations.get("Bombos Tablet")?.setRequirements((locations, items) => {
            return items.has("BookOfMudora") && items.hasSword(2)
                && (items.has("MagicMirror") && this.world.getRegion("South Dark World")!.canEnter(locations, items));
        });

        this.locations.get("Cave 45")?.setRequirements((locations, items) => {
            return items.has("MagicMirror") && this.world.getRegion("South Dark World")!.canEnter(locations, items);
        });

        this.locations.get("Checkerboard Cave")?.setRequirements((locations, items) => {
            return items.canLiftRocks()
                && (items.has("MagicMirror") && this.world.getRegion("Mire")!.canEnter(locations, items));
        });

        this.locations.get("Library")?.setRequirements((locations, items) => {
            return items.has("PegasusBoots");
        });

        this.locations.get("Desert Ledge")?.setRequirements((locations, items) => {
            return this.world.getRegion("Desert Palace")!.canEnter(locations, items);
        })

        this.locations.get("Lake Hylia Island")?.setRequirements((locations, items) => {
            return items.has("Flippers") && items.has("MagicMirror")
                && this.world.getRegion("North East Dark World")!.canEnter(locations, items);
        });

        this.locations.get("Flute Spot")?.setRequirements((locations, items) => {
            return items.has("Shovel");
        })

        this.can_enter = (locations: LocationCollection, items: ItemCollection) => {
            return items.has("RescueZelda");
        }

        return this;
    }
}
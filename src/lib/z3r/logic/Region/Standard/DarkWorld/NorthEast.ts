import Item, { type IItem } from "$lib/z3r/logic/Item";
import { Chest, Event, Standing } from "$lib/z3r/logic/Location";
import  Region from "$lib/z3r/logic/Region";
import type { ItemCollection } from "$lib/z3r/logic/Support/ItemCollection";
import { LocationCollection } from "$lib/z3r/logic/Support/LocationCollection";
import type World from "$lib/z3r/logic/World";

export class NorthEast extends Region {
    public constructor(world: World) {
        super("Dark World", world);

        this.locations = new LocationCollection([
            new Standing("Catfish", this),
            new Standing("Pyramid", this),
            new Chest("Pyramid Fairy - Left", this),
            new Chest("Pyramid Fairy - Right", this),
            new Event("Ganon", this)
        ]);
        this.locations.setChecksForWorld(world.id);

        this.prize = this.locations.get("Ganon");
        this.prize.setItem(Item.get("DefeatGanon", world.id)!);
    }

    override initialize() {
        this.locations.get("Catfish")?.setRequirements((item, locations, items, items_checked) => {
            return items.hasOrCanGet('MoonPearl', locations, item, items_checked) && items.canLiftRocks();
        });

        const pyramidRequirements = (item: IItem | null, locations: LocationCollection, items: ItemCollection, items_checked: string[]) => {
            return items.has("Crystal5") && items.has("Crystal6")
                && (!!this.world.getRegion("South Dark World")?.canEnter(locations, items))
                && items.hasOrCanGet("MoonPearl", locations, item, items_checked) && (items.hasOrCanGet("Hammer", locations, item, items_checked)
                    || (items.hasOrCanGet("MagicMirror", locations, item, items_checked) && (items.canDefeatAgahnim(this.world))))
        }

        this.locations.get("Pyramid Fairy - Left")?.setRequirements(pyramidRequirements);
        this.locations.get("Pyramid Fairy - Right")?.setRequirements(pyramidRequirements);

        this.can_enter = (_locations, items) => {
            return items.has("RescueZelda")
                && (items.canDefeatAgahnim(this.world)
                    || (items.has("Hammer") && items.canLiftRocks() && items.has("MoonPearl"))
                    || (items.canLiftDarkRocks() && items.has("MoonPearl") && (items.has("Hammer") || items.has("Flippers"))))
        }

        // TODO: Add ganon logic


        return this;
    }
}
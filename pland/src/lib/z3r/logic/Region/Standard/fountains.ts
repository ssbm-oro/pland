import { Fountain } from "../../Location";
import Region from "../../Region";
import { LocationCollection } from "../../Support/LocationCollection";
import type World from "../../World";

export class Fountains extends Region {
    public constructor(world: World) {
        super("Special", world);

        this.locations = new LocationCollection([
            new Fountain("Waterfall Bottle", this),
            new Fountain("Pyramid Bottle", this)
        ]);
    }
}
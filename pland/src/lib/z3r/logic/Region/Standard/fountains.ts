import { Fountain } from "../../Location/fountain";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type World from "../../world";

export class Fountains extends Region {
    public constructor(world: World) {
        super("Special", world);

        this.locations = new LocationCollection([
            new Fountain("Waterfall Bottle", this),
            new Fountain("Pyramid Bottle", this)
        ]);
    }
}
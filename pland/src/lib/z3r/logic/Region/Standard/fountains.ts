import { Fountain } from "../../Location/fountain";
import { Region } from "../../region";
import { LocationCollection } from "../../Support/locationcollection";
import type World from "../../world";

export class Fountains extends Region {
    public constructor(world: World, messages: string[]|null = null) {
        super("Special", world, messages);

        this.locations = new LocationCollection([
            new Fountain("Waterfall Bottle", this),
            new Fountain("Pyramid Bottle", this)
        ]);
    }
}
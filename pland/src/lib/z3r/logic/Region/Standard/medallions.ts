import { Region } from "../../region";
import type World from "../../world";
import { Medallion as LocationMedallion } from "../../Location/medallion"
import { LocationCollection } from "../../Support/locationcollection";

export class Medallion extends Region {
    public constructor(world: World) {
        super("Special", world);

        this.locations = new LocationCollection([
            new LocationMedallion("Turtle Rock Medallion", this),
            new LocationMedallion("Misery Mire Medallion", this)
        ]);
    }
}
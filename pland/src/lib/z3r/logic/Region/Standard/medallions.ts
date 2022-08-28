import Region from "../../Region";
import type World from "../../World";
import { LocationCollection } from "../../Support/LocationCollection";
import { Medallion as MedallionLocation } from "../../Location";

export class Medallion extends Region {
    public constructor(world: World) {
        super("Special", world);

        this.locations = new LocationCollection([
            new MedallionLocation("Turtle Rock Medallion", this),
            new MedallionLocation("Misery Mire Medallion", this)
        ]);
    }

    public override initialize() {
        this.locations.get("Turtle Rock Medallion")?.setFillCriteria((item, _locations) => {
            return ['Ether','Bombos','Quake'].includes(item.name);
        });
        this.locations.get("Misery Mire Medallion")?.setFillCriteria((item, _locations) => {
            return ['Ether','Bombos','Quake'].includes(item.name);
        });
        return this;
    }
}
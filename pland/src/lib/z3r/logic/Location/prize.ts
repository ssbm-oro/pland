import Location from "../location";
import type Item from "../item";
import type { Crystal, Pendant } from "../item";

export class Prize extends Location {
    public override setItem(item: Item | null) {
        if (!(item as Crystal) || !(item as Pendant)) {
            throw "Trying to set non-Pendant/Crystal in a prize location: " + this.getName() + " item: " + item?.name;
        }

        this.item = item!;
        return this;
    }

}
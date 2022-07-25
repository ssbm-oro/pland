import { Location } from "../location"
import type { Medallion as MedallionItem } from "../Item/medallion"
import type { Item } from "../item"

export class Medallion extends Location { 
    public override setItem(item: Item | null) {
        if (!(item as MedallionItem)) {
            throw "Trying to set non-medallion to medallion location";
        }
        this.item = item!;
        return this;
    }
}
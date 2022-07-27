import { Prize } from "../prize";
import type Item from "../../item";
import type { Event as ItemEvent } from "../../item";

export class Event extends Prize { 
    public override setItem(item: Item | null) {
        if (!(item as ItemEvent)) {
            throw `Trying to set non-event in an event Prize location: ${item}`;
        }

        this.item = item!;
        return this;
    }
}
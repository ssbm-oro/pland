import type { Boss } from "../Boss";
import { Collection } from "./Collection";
import type { ItemCollection } from "./ItemCollection";

export default class BossCollection extends Collection {
    protected override items: Map<string, Boss> = new Map();

    public constructor(bosses:Boss[] = [])
    {
        super();
        bosses.forEach(boss => {
            this.items.set(boss.name, boss);
        });
    }

    public override filter(f: (boss: Boss) => boolean): Boss[] { 
        return Array.from(this.items.values()).filter(f);
    }

    public override addItem(boss: Boss) {
        this.items.set(boss.name, boss);
        return this;
    }

    public canBeat(items: ItemCollection) {
        return (this.filter((boss: Boss) => {
            if (boss.canBeat) return boss.canBeat(items, null);
            else return true;
        }));
    }
}
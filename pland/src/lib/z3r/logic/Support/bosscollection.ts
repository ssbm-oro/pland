import type { Boss } from "../Boss";
import { Collection } from "./collection";
import type { ItemCollection } from "./itemcollection";

export default class BossCollection extends Collection {
    override items: Map<string, Boss> = new Map();

    public constructor(bosses:Boss[] = [])
    {
        super();
        bosses.forEach(boss => {
            this.items.set(boss.name, boss);
        });
    }

    public addItem(boss: Boss) {
        this.items.set(boss.name, boss);
    }

    public canBeat(items: ItemCollection) {
        return (this.filter((boss: Boss) => {
            if (boss.canBeat) return boss.canBeat(items, null);
            else return true;
        }));
    }
}
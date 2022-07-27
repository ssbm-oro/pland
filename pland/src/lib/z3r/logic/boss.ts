import type { ItemCollection } from "./Support/itemcollection";
import type { LocationCollection } from "./Support/locationcollection";
import BossCollection from "./Support/bosscollection";
import type World from "./world";
import { Entry } from "./Support/collection";

export class Boss extends Entry {
    protected static bosses: BossCollection;

    constructor(name: string, can_beat:(items:ItemCollection, locations?:LocationCollection) => boolean) {
        super(name)
        this.canBeat = can_beat;
    }

    static get(key: string, world: World): Boss {
        Boss.bosses = Boss.all(world);
        return this.bosses.get(key)! as Boss;
    }

    static all(world: World): BossCollection {
        if (Boss.bosses) {
            return Boss.bosses;
        }

        Boss.bosses = new BossCollection([
            new Boss("Armos Knights", (items) => {
                return items.hasSword() || items.has('Hammer') || items.canShootArrows(world) || items.has('Boomerang')
                    || items.has('RedBoomerang') || (items.canExtendMagic(world, 4) && items.has('FireRod') || items.has('IceRod'))
                    || (items.canExtendMagic(world, 2) && (items.has('CaneOfSomaria') || items.has('CaneOfByrna')))
            }),
            new Boss("Lanmolas", (items) => {
                return items.hasSword() || items.has('Hammer') || items.canShootArrows(world) || items.has('FireRod') || items.has('IceRod')
                    || items.has('CaneOfSomaria') || items.has('CaneOfByrna');
            }),
            new Boss("Moldorm", (items) => {
                return items.hasSword() || items.has('Hammer');
            }),
            new Boss("Helmasaur King", (items) => {
                return (items.canBombThings() || items.has('Hammer'))
                    && items.hasSword() || items.canShootArrows(world);
            }),
            // TODO this is wrong but the logic looked complicated
            new Boss("Arrghus", (items) => {
                return items.has('Hookshot') && (items.has('Hammer') || items.hasSword() || world.config.weapons == 'swordless')
            }),
            new Boss("Mothula", (items) => {
                return items.hasSword() || items.has('Hammer') 
                    || (items.canExtendMagic(world, 2) && items.has('FireRod') || items.has('CaneOfSomaria') || (items.has('CaneOfByrna')))
                    || items.canGetGoodBee();
            }),
            new Boss("Blind", (items) => {
                return items.hasSword() || items.has('Hammer') || items.has('CaneOfSomaria') || items.has('CaneOfByrna');
            }),
            // TODO this is also very simplified
            new Boss("Kholdstare", (items) => {
                return items.canMeltThings(world) && (items.has('Hammer') || items.hasSword());
            }),
            new Boss("Vitreous", (items) => {
                return items.hasSword() || items.has('Hammer') || items.canShootArrows(world)
            }),
            // TODO check if this is right
            new Boss("Trinexx", (items) => {
                return items.has('FireRod') && items.has('IceRod')
                    && ((items.has('Hammer') || items.hasSword(3))
                        || (items.hasSword(2) && items.canExtendMagic(world, 2)
                        || (items.hasSword() && items.canExtendMagic(world, 4))));
            }),
            new Boss("Agahnim2", (items) => {
                return items.hasSword() || items.has('Hammer') || items.has('BugCatchingNet');
            }),
        ]);

        return Boss.bosses;
    }

    canBeat(items: ItemCollection, locations?: LocationCollection): boolean {
        throw new Error("Method not implemented.");
    }
}
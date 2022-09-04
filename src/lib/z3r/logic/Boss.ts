import type { Entry } from "./Support/Collection";
import type { ItemCollection } from "./Support/ItemCollection";
import type { LocationCollection } from "./Support/LocationCollection";
import BossCollection from "./Support/BossCollection";
import type World from "./World";
import { log } from "./Logic";
import type { IItem } from "./Item";

export interface Boss extends Entry {
    canBeat: (items: ItemCollection, locations: LocationCollection | null, item: IItem | null) => boolean;
}

export class Bosses {
    private static bosses: BossCollection;

    public static get(key: string, world: World): Boss {
        return Bosses.all(world).get(key) as Boss;
    }
    
    public static all(world: World): BossCollection {
        if (Bosses.bosses) {
            return Bosses.bosses;
        }
    
        Bosses.bosses = new BossCollection([
            {name: "Armos Knights", canBeat: items => {
                return items.hasSword() || items.has('Hammer') || items.canShootArrows(world) || items.has('Boomerang')
                    || items.has('RedBoomerang') || (items.canExtendMagic(world, 4) && items.has('FireRod') || items.has('IceRod'))
                    || (items.canExtendMagic(world, 2) && (items.has('CaneOfSomaria') || items.has('CaneOfByrna')))}
            },
            {name: "Lanmolas", canBeat: (items, locations) => {
                return items.hasSword() || items.has('Hammer') || items.canShootArrows(world) || items.hasOrCanGet('FireRod', locations, null) || items.hasOrCanGet('IceRod', locations)
                    || items.has('CaneOfSomaria') || items.has('CaneOfByrna')}
            },
            {name:"Moldorm", canBeat:items => {
                return items.hasSword() || items.has('Hammer');
            }},
            {name: "Helmasaur King", canBeat: items => {
                return (items.canBombThings() || items.has('Hammer'))
                    && items.hasSword() || items.canShootArrows(world);
            }},
            // TODO this is wrong but the logic looked complicated
            {name: "Arrghus", canBeat: items => {
                return items.has('Hookshot') && (items.has('Hammer') || items.hasSword() || world.config.weapons == 'swordless')
            }},
            {name: "Mothula", canBeat: (items, locations) => {
                return items.hasSword() || items.has('Hammer') 
                    || (items.canExtendMagic(world, 2) && items.hasOrCanGet('FireRod', locations) || items.has('CaneOfSomaria') || (items.has('CaneOfByrna')))
                    || items.canGetGoodBee();
            }},
            {name: "Blind", canBeat: items => {
                return items.hasSword() || items.has('Hammer') || items.has('CaneOfSomaria') || items.has('CaneOfByrna');
            }},
            // TODO this is also very simplified
            {name: "Kholdstare", canBeat: items => {
                return items.canMeltThings(world) && (items.has('Hammer') || items.hasSword());
            }},
            {name: "Vitreous", canBeat: (items) => {
                return items.hasSword() || items.has('Hammer') || items.canShootArrows(world)
            }},
            // TODO check if this is right
            {name: "Trinexx", canBeat: (items, locations, item) => {
                log(`checking if we can beat Trinexx `);
                return items.hasOrCanGet('FireRod', locations, item) && items.hasOrCanGet('IceRod', locations, item)
                    && ((items.has('Hammer') || items.hasSword(3))
                        || (items.hasSword(2) && items.canExtendMagic(world, 2)
                        || (items.hasSword() && items.canExtendMagic(world, 4))));
            }},
            {name: "Agahnim2", canBeat: items => {
                return items.hasSword() || items.has('Hammer') || items.has('BugCatchingNet');
            }},
        ]);
    
        return Bosses.bosses;
    }
}
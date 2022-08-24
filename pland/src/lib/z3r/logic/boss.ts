import type { ItemCollection } from "./Support/itemcollection";
import type { LocationCollection } from "./Support/locationcollection";
import BossCollection from "./Support/bosscollection";
import type World from "./world";
import type { Entry } from "./Support/collection";


let bosses: BossCollection;
export interface Boss extends Entry {
    canBeat?: (items: ItemCollection, locations: LocationCollection | null) => boolean;
}

function get(key: string, world: World): Boss {
    return all(world).get(key)! as Boss;
}

function all(world: World): BossCollection {
    if (bosses) {
        return bosses;
    }

    bosses = new BossCollection([
        {name: "Armos Knights", canBeat: items => {
            return items.hasSword() || items.has('Hammer') || items.canShootArrows(world) || items.has('Boomerang')
                || items.has('RedBoomerang') || (items.canExtendMagic(world, 4) && items.has('FireRod') || items.has('IceRod'))
                || (items.canExtendMagic(world, 2) && (items.has('CaneOfSomaria') || items.has('CaneOfByrna')))}
        },
        {name: "Lanmolas", canBeat: items => {
            return items.hasSword() || items.has('Hammer') || items.canShootArrows(world) || items.has('FireRod') || items.has('IceRod')
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
        {name: "Mothula", canBeat: items => {
            return items.hasSword() || items.has('Hammer') 
                || (items.canExtendMagic(world, 2) && items.has('FireRod') || items.has('CaneOfSomaria') || (items.has('CaneOfByrna')))
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
        {name: "Trinexx", canBeat: items => {
            return items.has('FireRod') && items.has('IceRod')
                && ((items.has('Hammer') || items.hasSword(3))
                    || (items.hasSword(2) && items.canExtendMagic(world, 2)
                    || (items.hasSword() && items.canExtendMagic(world, 4))));
        }},
        {name: "Agahnim2", canBeat: items => {
            return items.hasSword() || items.has('Hammer') || items.has('BugCatchingNet');
        }},
    ]);

    return bosses;
}

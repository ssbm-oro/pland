import { ItemCollection } from "./Support/itemcollection";
import type { Entry } from "./Support/collection";
import type World from "./world";
import type { Region } from "./region";

export default interface Item extends Entry {
    world: World;
    //public static world: World;
}

export function getNiceName(item: Item) {
    return item.name + ':' + item.world.id;
}

let items = new Map<World, ItemCollection>()

export function allItems(world: World) {
    if (items.has(world)) return items.get(world);

    const allItems = new ItemCollection([
        {name: 'Nothing', world},
        
        { name: 'L1Sword', world},
        { name: 'L1SwordAndShield', world},
        { name: 'L2Sword', world},
        { name: 'MasterSword', world},
        { name: 'L3Sword', world},
        { name: 'L4Sword', world},
        { name: 'BlueShield', world: world },
        { name: 'RedShield', world: world },
        { name: 'MirrorShield', world: world },
        { name: 'FireRod', world: world },
        { name: 'IceRod', world: world },
        { name: 'Hammer', world: world },
        { name: 'Hookshot', world: world },
        { name: 'Bow', world: world },
        { name: 'Boomerang', world: world },
        { name: 'Powder', world: world },
        //new BottleContents('Bee', [0x0E], $world),
        { name: 'Bombos', world: world },
        { name: 'Ether', world: world },
        { name: 'Quake', world: world },
        { name: 'Lamp', world: world },
        { name: 'Shovel', world: world },
        { name: 'OcarinaInactive', world: world },
        { name: 'CaneOfSomaria', world: world },
        { name: 'Bottle', world: world },
        { name: 'PieceOfHeart', world: world },
        { name: 'CaneOfByrna', world: world },
        { name: 'Cape', world: world },
        { name: 'MagicMirror', world: world },
        { name: 'PowerGlove', world: world },
        { name: 'TitansMitt', world: world },
        { name: 'BookOfMudora', world: world },
        { name: 'Flippers', world: world },
        { name: 'MoonPearl', world: world },
        { name: 'BugCatchingNet', world: world },
        { name: 'BlueMail', world: world },
        { name: 'RedMail', world: world },
        { name: 'Key', world: world },
        { name: 'Compass', world: world },
        { name: 'HeartContainerNoAnimation', world: world },
        { name: 'Bomb', world: world },
        { name: 'ThreeBombs', world: world },
        { name: 'Mushroom', world: world },
        { name: 'RedBoomerang', world: world },
        { name: 'BottleWithRedPotion', world: world },
        { name: 'BottleWithGreenPotion', world: world },
        { name: 'BottleWithBluePotion', world: world },
        //new Item\BottleContents('RedPotion', [0x2E], $world),
        // new Item\BottleContents('GreenPotion', [0x2F], $world),
        // new Item\BottleContents('BluePotion', [0x30], $world),
        { name: 'TenBombs', world: world },
        { name: 'BigKey', world: world },
        { name: 'Map', world: world },
        { name: 'OneRupee', world: world },
        { name: 'FiveRupees', world: world },
        { name: 'TwentyRupees', world: world },
        { name: 'PendantOfCourage', world: world },
        { name: 'PendantOfWisdom', world: world },
        { name: 'PendantOfPower', world: world },
        { name: 'BowAndArrows', world: world },
        { name: 'BowAndSilverArrows', world: world },
        { name: 'BottleWithBee', world: world },
        { name: 'BottleWithFairy', world: world },
        { name: 'BottleWithRandom', world: world },
        { name: 'BossHeartContainer', world: world },
        { name: 'HeartContainer', world: world },
        { name: 'OneHundredRupees', world: world },
        { name: 'FiftyRupees', world: world },
        { name: 'Heart', world: world },
        { name: 'Arrow', world: world },
        { name: 'TenArrows', world: world },
        { name: 'SmallMagic', world: world },
        { name: 'ThreeHundredRupees', world: world },
        { name: 'TwentyRupees2', world: world },
        { name: 'BottleWithGoldBee', world: world },
        { name: 'OcarinaActive', world: world },
        { name: 'PegasusBoots', world: world },
        { name: 'BombUpgrade5', world: world },
        { name: 'BombUpgrade10', world: world },
        { name: 'BombUpgrade50', world: world },
        { name: 'ArrowUpgrade5', world: world },
        { name: 'ArrowUpgrade10', world: world },
        { name: 'ArrowUpgrade70', world: world },
        { name: 'HalfMagic', world: world },
        { name: 'QuarterMagic', world: world },
        { name: 'Programmable1', world: world },
        { name: 'Programmable2', world: world },
        { name: 'Programmable3', world: world },
        { name: 'SilverArrowUpgrade', world: world },
        { name: 'Rupoor', world: world },
        { name: 'RedClock', world: world },
        { name: 'BlueClock', world: world },
        { name: 'GreenClock', world: world },
        { name: 'ProgressiveSword', world: world },
        { name: 'ProgressiveShield', world: world },
        { name: 'ProgressiveArmor', world: world },
        { name: 'ProgressiveGlove', world: world },
        { name: 'singleRNG', world: world },
        { name: 'multiRNG', world: world },
        { name: 'ProgressiveBow', world: world },
        { name: 'ProgressiveBowAlternate', world: world },
        { name: 'Triforce', world: world },
        { name: 'PowerStar', world: world },
        { name: 'TriforcePiece', world: world },
        { name: 'MapLW', world: world },
        { name: 'MapDW', world: world },
        { name: 'MapA2', world: world },
        { name: 'MapD7', world: world },
        { name: 'MapD4', world: world },
        { name: 'MapP3', world: world },
        { name: 'MapD5', world: world },
        { name: 'MapD3', world: world },
        { name: 'MapD6', world: world },
        { name: 'MapD1', world: world },
        { name: 'MapD2', world: world },
        { name: 'MapA1', world: world },
        { name: 'MapP2', world: world },
        { name: 'MapP1', world: world },
        { name: 'MapH1', world: world },
        { name: 'MapH2', world: world },
        { name: 'CompassA2', world: world },
        { name: 'CompassD7', world: world },
        { name: 'CompassD4', world: world },
        { name: 'CompassP3', world: world },
        { name: 'CompassD5', world: world },
        { name: 'CompassD3', world: world },
        { name: 'CompassD6', world: world },
        { name: 'CompassD1', world: world },
        { name: 'CompassD2', world: world },
        { name: 'CompassA1', world: world },
        { name: 'CompassP2', world: world },
        { name: 'CompassP1', world: world },
        { name: 'CompassH1', world: world },
        { name: 'CompassH2', world: world },
        { name: 'BigKeyA2', world: world },
        { name: 'BigKeyD7', world: world },
        { name: 'BigKeyD4', world: world },
        { name: 'BigKeyP3', world: world },
        { name: 'BigKeyD5', world: world },
        { name: 'BigKeyD3', world: world },
        { name: 'BigKeyD6', world: world },
        { name: 'BigKeyD1', world: world },
        { name: 'BigKeyD2', world: world },
        { name: 'BigKeyA1', world: world },
        { name: 'BigKeyP2', world: world },
        { name: 'BigKeyP1', world: world },
        { name: 'BigKeyH1', world: world },
        { name: 'BigKeyH2', world: world },
        { name: 'KeyH2', world: world },
        { name: 'KeyH1', world: world },
        { name: 'KeyP1', world: world },
        { name: 'KeyP2', world: world },
        { name: 'KeyA1', world: world },
        { name: 'KeyD2', world: world },
        { name: 'KeyD1', world: world },
        { name: 'KeyD6', world: world },
        { name: 'KeyD3', world: world },
        { name: 'KeyD5', world: world },
        { name: 'KeyP3', world: world },
        { name: 'KeyD4', world: world },
        { name: 'KeyD7', world: world },
        { name: 'KeyA2', world: world },
        { name: 'KeyGK', world: world },
        { name: 'Crystal1', world: world },
        { name: 'Crystal2', world: world },
        { name: 'Crystal3', world: world },
        { name: 'Crystal4', world: world },
        { name: 'Crystal5', world: world },
        { name: 'Crystal6', world: world },
        { name: 'Crystal7', world: world },
        { name: 'RescueZelda', world: world },
        { name: 'DefeatAgahnim', world: world },
        { name: 'BigRedBomb', world: world },
        { name: 'DefeatAgahnim2', world: world },
        { name: 'DefeatGanon', world }
    ]);

    return allItems;
}

export function getItem(name: string, world: World) {
    return allItems(world)!.get(name) as Item | undefined;
}


export interface Armor extends Item {
    // purposefully empty interface
}

export interface Arrow extends Item {
    // purposefully empty interface
}

export interface Sword extends Item {
    // purposefully empty interface
}


export interface Medallion extends Item {
    // purposefully empty interface
}

export interface IDungeonItem extends Item {
    dungeon: Region;
}

export interface Key extends IDungeonItem {
}


export interface Compass extends IDungeonItem {
}

export interface Map extends IDungeonItem {
}


export interface Bottle extends Item {
    is_bottle: boolean;
}


export interface BigKey extends IDungeonItem {
}

export interface IPrize extends Item {
    // purposefully empty interface
}


export interface Pendant extends IPrize {
    // purposefully empty interface
}

export interface Crystal extends IPrize {
    // purposefully empty interface
}


export interface Bow extends Item {
    // purposefully empty interface
}


export interface Upgrade extends Item {
    // purposefully empty interface
}


export interface HealthUpgrade extends Upgrade {
    // purposefully empty interface
}


export interface BombUpgrade extends Upgrade {
    // purposefully empty interface
}


export interface MagicUpgrade extends Upgrade {
    // purposefully empty interface
}


export interface ArrowUpgrade extends Upgrade {
    // purposefully empty interface
}

export interface Programmable extends Item {
    // purposefully empty interface
}

export interface Event extends Item {
    // purposefully empty interface
}

export interface Shield extends Item {
    // purposefully empty interface
}
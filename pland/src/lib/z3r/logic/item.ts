import { ItemCollection } from "./Support/itemcollection";
import { Entry } from "./Support/collection";
import type World from "./world";

export default class Item extends Entry {
    nice_name: string;
    world: World;
    is_dungeon_item = false;
    is_bottle = false;

    public static items: ItemCollection;
    public static world: World;

    constructor(name: string, world: World) {
        super(name);
        this.nice_name = "item." + name;
        this.world = world;
    }

    public static all(world: World) {
        if (Item.items) return Item.items;

        Item.world = world;
        this.items = new ItemCollection([
            new Item('Nothing', world),
            
            new Sword('L1Sword', world),
            new Sword('L1SwordAndShield', world),
            new Sword('L2Sword', world),
            new Sword('MasterSword', world),
            new Sword('L3Sword', world),
            new Sword('L4Sword', world),
            new Item('BlueShield', world),
            new Item('RedShield', world),
            new Item('MirrorShield', world),
            new Item('FireRod', world),
            new Item('IceRod', world),
            new Item('Hammer', world),
            new Item('Hookshot', world),
            new Item('Bow', world),
            new Item('Boomerang', world),
            new Item('Powder', world),
            //new BottleContents('Bee', [0x0E], $world),
            new Medallion('Bombos', world),
            new Medallion('Ether', world),
            new Medallion('Quake', world),
            new Item('Lamp', world),
            new Item('Shovel', world),
            new Item('OcarinaInactive', world),
            new Item('CaneOfSomaria', world),
            new Bottle('Bottle', world),
            new HealthUpgrade('PieceOfHeart', world),
            new Item('CaneOfByrna', world),
            new Item('Cape', world),
            new Item('MagicMirror', world),
            new Item('PowerGlove', world),
            new Item('TitansMitt', world),
            new Item('BookOfMudora', world),
            new Item('Flippers', world),
            new Item('MoonPearl', world),
            new Item('BugCatchingNet', world),
            new Armor('BlueMail', world),
            new Armor('RedMail', world),
            new Key('Key', world),
            new Compass('Compass', world),
            new HealthUpgrade('HeartContainerNoAnimation', world),
            new Item('Bomb', world),
            new Item('ThreeBombs', world),
            new Item('Mushroom', world),
            new Item('RedBoomerang', world),
            new Bottle('BottleWithRedPotion', world),
            new Bottle('BottleWithGreenPotion', world),
            new Bottle('BottleWithBluePotion', world),
            //new Item\BottleContents('RedPotion', [0x2E], $world),
            // new Item\BottleContents('GreenPotion', [0x2F], $world),
            // new Item\BottleContents('BluePotion', [0x30], $world),
            new Item('TenBombs', world),
            new BigKey('BigKey', world),
            new Map('Map', world),
            new Item('OneRupee', world),
            new Item('FiveRupees', world),
            new Item('TwentyRupees', world),
            new Pendant('PendantOfCourage', world),
            new Pendant('PendantOfWisdom', world),
            new Pendant('PendantOfPower', world),
            new Bow('BowAndArrows', world),
            new Bow('BowAndSilverArrows', world),
            new Bottle('BottleWithBee', world),
            new Bottle('BottleWithFairy', world),
            new Bottle('BottleWithRandom', world),
            new HealthUpgrade('BossHeartContainer', world),
            new HealthUpgrade('HeartContainer', world),
            new Item('OneHundredRupees', world),
            new Item('FiftyRupees', world),
            new Item('Heart', world),
            new Arrow('Arrow', world),
            new Arrow('TenArrows', world),
            new Item('SmallMagic', world),
            new Item('ThreeHundredRupees', world),
            new Item('TwentyRupees2', world),
            new Bottle('BottleWithGoldBee', world),
            new Item('OcarinaActive', world),
            new Item('PegasusBoots', world),
            new BombUpgrade('BombUpgrade5', world),
            new BombUpgrade('BombUpgrade10', world),
            new BombUpgrade('BombUpgrade50', world),
            new ArrowUpgrade('ArrowUpgrade5', world),
            new ArrowUpgrade('ArrowUpgrade10', world),
            new ArrowUpgrade('ArrowUpgrade70', world),
            new MagicUpgrade('HalfMagic', world),
            new MagicUpgrade('QuarterMagic', world),
            new Programmable('Programmable1', world),
            new Programmable('Programmable2', world),
            new Programmable('Programmable3', world),
            new Item('SilverArrowUpgrade', world),
            new Item('Rupoor', world),
            new Item('RedClock', world),
            new Item('BlueClock', world),
            new Item('GreenClock', world),
            new Sword('ProgressiveSword', world),
            new Shield('ProgressiveShield', world),
            new Armor('ProgressiveArmor', world),
            new Item('ProgressiveGlove', world),
            new Item('singleRNG', world),
            new Item('multiRNG', world),
            new Bow('ProgressiveBow', world),
            new Bow('ProgressiveBowAlternate', world),
            new Event('Triforce', world),
            new Item('PowerStar', world),
            new Item('TriforcePiece', world),
            new Map('MapLW', world),
            new Map('MapDW', world),
            new Map('MapA2', world),
            new Map('MapD7', world),
            new Map('MapD4', world),
            new Map('MapP3', world),
            new Map('MapD5', world),
            new Map('MapD3', world),
            new Map('MapD6', world),
            new Map('MapD1', world),
            new Map('MapD2', world),
            new Map('MapA1', world),
            new Map('MapP2', world),
            new Map('MapP1', world),
            new Map('MapH1', world),
            new Map('MapH2', world),
            new Compass('CompassA2', world),
            new Compass('CompassD7', world),
            new Compass('CompassD4', world),
            new Compass('CompassP3', world),
            new Compass('CompassD5', world),
            new Compass('CompassD3', world),
            new Compass('CompassD6', world),
            new Compass('CompassD1', world),
            new Compass('CompassD2', world),
            new Compass('CompassA1', world),
            new Compass('CompassP2', world),
            new Compass('CompassP1', world),
            new Compass('CompassH1', world),
            new Compass('CompassH2', world),
            new BigKey('BigKeyA2', world),
            new BigKey('BigKeyD7', world),
            new BigKey('BigKeyD4', world),
            new BigKey('BigKeyP3', world),
            new BigKey('BigKeyD5', world),
            new BigKey('BigKeyD3', world),
            new BigKey('BigKeyD6', world),
            new BigKey('BigKeyD1', world),
            new BigKey('BigKeyD2', world),
            new BigKey('BigKeyA1', world),
            new BigKey('BigKeyP2', world),
            new BigKey('BigKeyP1', world),
            new BigKey('BigKeyH1', world),
            new BigKey('BigKeyH2', world),
            new Key('KeyH2', world),
            new Key('KeyH1', world),
            new Key('KeyP1', world),
            new Key('KeyP2', world),
            new Key('KeyA1', world),
            new Key('KeyD2', world),
            new Key('KeyD1', world),
            new Key('KeyD6', world),
            new Key('KeyD3', world),
            new Key('KeyD5', world),
            new Key('KeyP3', world),
            new Key('KeyD4', world),
            new Key('KeyD7', world),
            new Key('KeyA2', world),
            new Key('KeyGK', world),
            new Crystal('Crystal1', world),
            new Crystal('Crystal2', world),
            new Crystal('Crystal3', world),
            new Crystal('Crystal4', world),
            new Crystal('Crystal5', world),
            new Crystal('Crystal6', world),
            new Crystal('Crystal7', world),
            new Event('RescueZelda', world),
            new Event('DefeatAgahnim', world),
            new Event('BigRedBomb', world),
            new Event('DefeatAgahnim2', world),
            new Event('DefeatGanon', world)
        ]);


        return Item.items;
    }

    public static get(name: string, world: World) {
        return Item.all(world).get(name) as Item | undefined;
    }
}

export class Armor extends Item {
    // purposefully empty class
}

export class Arrow extends Item {
    // purposefully empty class
}

export class Sword extends Item {
    // purposefully empty class
}


export class Medallion extends Item {
    // purposefully empty class
}


export class Key extends Item {
    override is_dungeon_item = true;
}


export class Compass extends Item {
    override is_dungeon_item = true;
}

export class Map extends Item {
    override is_dungeon_item = true;
}


export class Bottle extends Item {
    override is_bottle = true;
}


export class BigKey extends Item {
    override is_dungeon_item = true;
}


export class Pendant extends Item {
    // purposefully empty class
}

export class Crystal extends Item {
    // purposefully empty class
}


export class Bow extends Item {
    // purposefully empty class
}


export class Upgrade extends Item {
    // purposefully empty class
}


export class HealthUpgrade extends Upgrade {
    // purposefully empty class
}


export class BombUpgrade extends Upgrade {
    // purposefully empty class
}


export class MagicUpgrade extends Upgrade {
    // purposefully empty class
}


export class ArrowUpgrade extends Upgrade {
    // purposefully empty class
}

export class Programmable extends Item {
    // purposefully empty class
}

export class Event extends Item {
    // purposefully empty class
}

export class Shield extends Item {
    // purposefully empty class
}
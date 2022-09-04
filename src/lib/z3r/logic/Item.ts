import type { Entry } from "./Support/Collection";
import { ItemCollection } from "./Support/ItemCollection";

export interface IItem extends Entry {
    world_id: number;
    value: string;
    pretty_name?: string;
}

export default class Item implements IItem {
    name: string;
    world_id: number;
    value: string;
    pretty_name: string;

    public constructor(name: string, world_id: number) {
        this.name = name;
        this.world_id = world_id;
        this.value = name.replace('item.', '');
        this.pretty_name = name;
    }

    public getNiceName() {
        return this.name + ':' + this.world_id;
    }

    public static items: ItemCollection;

    public static allItems(world_id: number) {
        if (Item.items) return Item.items;

        const allItems = new ItemCollection([
            new Item('Nothing', world_id),
            
            new Sword('L1Sword', world_id),
            new Sword('L1SwordAndShield', world_id),
            new Sword('L2Sword', world_id),
            new Sword('MasterSword', world_id),
            new Sword('L3Sword', world_id),
            new Sword('L4Sword', world_id),
            new Shield('BlueShield', world_id),
            new Shield('RedShield', world_id),
            new Shield('MirrorShield', world_id),
            new Item('FireRod', world_id),
            new Item('IceRod', world_id),
            new Item('Hammer', world_id),
            new Item('Hookshot', world_id),
            new Item('Bow', world_id),
            new Item('Boomerang', world_id),
            new Item('Powder', world_id),
            //new BottleContents('Bee', [0x0E], $world_id),
            new Medallion('Bombos', world_id),
            new Medallion('Ether', world_id),
            new Medallion('Quake', world_id),
            new Item('Lamp', world_id),
            new Item('Shovel', world_id),
            new Item('OcarinaInactive', world_id),
            new Item('CaneOfSomaria', world_id),
            new Bottle('Bottle', world_id),
            new HealthUpgrade('PieceOfHeart', world_id),
            new Item('CaneOfByrna', world_id),
            new Item('Cape', world_id),
            new Item('MagicMirror', world_id),
            new Item('PowerGlove', world_id),
            new Item('TitansMitt', world_id),
            new Item('BookOfMudora', world_id),
            new Item('Flippers', world_id),
            new Item('MoonPearl', world_id),
            new Item('BugCatchingNet', world_id),
            new Armor('BlueMail', world_id),
            new Armor('RedMail', world_id),
            new Key('Key', world_id),
            new Compass('Compass', world_id),
            new HealthUpgrade('HeartContainerNoAnimation', world_id),
            new Item('Bomb', world_id),
            new Item('ThreeBombs', world_id),
            new Item('Mushroom', world_id),
            new Item('RedBoomerang', world_id),
            new Bottle('BottleWithRedPotion', world_id),
            new Bottle('BottleWithGreenPotion', world_id),
            new Bottle('BottleWithBluePotion', world_id),
            //new Item\BottleContents('RedPotion', [0x2E], $world_id),
            // new Item\BottleContents('GreenPotion', [0x2F], $world_id),
            // new Item\BottleContents('BluePotion', [0x30], $world_id),
            new Item('TenBombs', world_id),
            new BigKey('BigKey', world_id),
            new Map('Map', world_id),
            new Item('OneRupee', world_id),
            new Item('FiveRupees', world_id),
            new Item('TwentyRupees', world_id),
            new Pendant('PendantOfCourage', world_id),
            new Pendant('PendantOfWisdom', world_id),
            new Pendant('PendantOfPower', world_id),
            new Bow('BowAndArrows', world_id),
            new Bow('BowAndSilverArrows', world_id),
            new Bottle('BottleWithBee', world_id),
            new Bottle('BottleWithFairy', world_id),
            new Bottle('BottleWithRandom', world_id),
            new HealthUpgrade('BossHeartContainer', world_id),
            new HealthUpgrade('HeartContainer', world_id),
            new Item('OneHundredRupees', world_id),
            new Item('FiftyRupees', world_id),
            new Item('Heart', world_id),
            new Arrow('Arrow', world_id),
            new Arrow('TenArrows', world_id),
            new Item('SmallMagic', world_id),
            new Item('ThreeHundredRupees', world_id),
            new Item('TwentyRupees2', world_id),
            new Bottle('BottleWithGoldBee', world_id),
            new Item('OcarinaActive', world_id),
            new Item('PegasusBoots', world_id),
            new BombUpgrade('BombUpgrade5', world_id),
            new BombUpgrade('BombUpgrade10', world_id),
            new BombUpgrade('BombUpgrade50', world_id),
            new ArrowUpgrade('ArrowUpgrade5', world_id),
            new ArrowUpgrade('ArrowUpgrade10', world_id),
            new ArrowUpgrade('ArrowUpgrade70', world_id),
            new MagicUpgrade('HalfMagic', world_id),
            new MagicUpgrade('QuarterMagic', world_id),
            new Programmable('Programmable1', world_id),
            new Programmable('Programmable2', world_id),
            new Programmable('Programmable3', world_id),
            new Item('SilverArrowUpgrade', world_id),
            new Item('Rupoor', world_id),
            new Item('RedClock', world_id),
            new Item('BlueClock', world_id),
            new Item('GreenClock', world_id),
            new Sword('ProgressiveSword', world_id),
            new Shield('ProgressiveShield', world_id),
            new Armor('ProgressiveArmor', world_id),
            new Item('ProgressiveGlove', world_id),
            new Item('singleRNG', world_id),
            new Item('multiRNG', world_id),
            new Bow('ProgressiveBow', world_id),
            new Bow('ProgressiveBowAlternate', world_id),
            new Event('Triforce', world_id),
            new Item('PowerStar', world_id),
            new Item('TriforcePiece', world_id),
            new Map('MapLW', world_id),
            new Map('MapDW', world_id),
            new Map('MapA2', world_id),
            new Map('MapD7', world_id),
            new Map('MapD4', world_id),
            new Map('MapP3', world_id),
            new Map('MapD5', world_id),
            new Map('MapD3', world_id),
            new Map('MapD6', world_id),
            new Map('MapD1', world_id),
            new Map('MapD2', world_id),
            new Map('MapA1', world_id),
            new Map('MapP2', world_id),
            new Map('MapP1', world_id),
            new Map('MapH1', world_id),
            new Map('MapH2', world_id),
            new Compass('CompassA2', world_id),
            new Compass('CompassD7', world_id),
            new Compass('CompassD4', world_id),
            new Compass('CompassP3', world_id),
            new Compass('CompassD5', world_id),
            new Compass('CompassD3', world_id),
            new Compass('CompassD6', world_id),
            new Compass('CompassD1', world_id),
            new Compass('CompassD2', world_id),
            new Compass('CompassA1', world_id),
            new Compass('CompassP2', world_id),
            new Compass('CompassP1', world_id),
            new Compass('CompassH1', world_id),
            new Compass('CompassH2', world_id),
            new BigKey('BigKeyA2', world_id),
            new BigKey('BigKeyD7', world_id),
            new BigKey('BigKeyD4', world_id),
            new BigKey('BigKeyP3', world_id),
            new BigKey('BigKeyD5', world_id),
            new BigKey('BigKeyD3', world_id),
            new BigKey('BigKeyD6', world_id),
            new BigKey('BigKeyD1', world_id),
            new BigKey('BigKeyD2', world_id),
            new BigKey('BigKeyA1', world_id),
            new BigKey('BigKeyP2', world_id),
            new BigKey('BigKeyP1', world_id),
            new BigKey('BigKeyH1', world_id),
            new BigKey('BigKeyH2', world_id),
            new Key('KeyH2', world_id),
            new Key('KeyH1', world_id),
            new Key('KeyP1', world_id),
            new Key('KeyP2', world_id),
            new Key('KeyA1', world_id),
            new Key('KeyD2', world_id),
            new Key('KeyD1', world_id),
            new Key('KeyD6', world_id),
            new Key('KeyD3', world_id),
            new Key('KeyD5', world_id),
            new Key('KeyP3', world_id),
            new Key('KeyD4', world_id),
            new Key('KeyD7', world_id),
            new Key('KeyA2', world_id),
            new Key('KeyGK', world_id),
            new Crystal('Crystal1', world_id),
            new Crystal('Crystal2', world_id),
            new Crystal('Crystal3', world_id),
            new Crystal('Crystal4', world_id),
            new Crystal('Crystal5', world_id),
            new Crystal('Crystal6', world_id),
            new Crystal('Crystal7', world_id),
            new Event('RescueZelda', world_id),
            new Event('DefeatAgahnim', world_id),
            new Event('BigRedBomb', world_id),
            new Event('DefeatAgahnim2', world_id),
            new Event('DefeatGanon', world_id)
        ]);

        allItems.setChecksForWorld(world_id);

        return allItems;
    }

    public static get(name: string, world_id: number) {
        return Item.allItems(world_id).get(name);
    }

    static isPrize(item: IItem) {
        return item instanceof IPrize;
    }
}


export class Armor extends Item {
    // purposefully empty interface
}

export class Arrow extends Item {
    // purposefully empty interface
}

export class Sword extends Item {
    // purposefully empty interface
}


export class Medallion extends Item {
    // purposefully empty interface
}

export class IDungeonItem extends Item {
    public dungeon?: string;
    constructor(name: string, world_id: number) {
        super(name, world_id);
        this.dungeon = name.slice(-2)
    }
}

export class Key extends IDungeonItem {
}


export class Compass extends IDungeonItem {
}

export class Map extends IDungeonItem {
}

export const BottleContents = {
    random: {
        icon: "mdi:beaker-question",
        color: "#ccc",
        name: 'Bottle with Random',
        value: 'random'
    },
    empty: {
        icon: "mdi:bottle-tonic-outline",
        color: "#ccc",
        name: 'Empty Bottle',
        value: 'none'
    },
    red: {
        icon: "mdi:bottle-tonic",
        color: "#c00",
        name: 'Bottle with Red Potion',
        value: 'red'
    },
    green: {
        icon: "mdi:bottle-tonic",
        color: "#0c0",
        name: 'Bottle with Green Potion',
        value: 'green'
    },
    blue: {
        icon: "mdi:bottle-tonic",
        color: "#00c",
        name: 'Bottle with Blue Potion',
        value: 'blue'
    },
    fairy: {
        icon: "noto:fairy",
        name: 'Bottle with a Fairy',
        color: '',
        value: 'fairy'
    },
    bee: {
        icon: "mdi:bee",
        name: 'Bottle with a Bee',
        color: '#cc0',
        value: 'bee'
    },
    goodbee: {
        icon: "mdi:bee-flower",
        name: 'Bottle with a Good Bee',
        color: '#cc0',
        value: 'goodbee'
    }
}

export class Bottle extends Item {
    contents = 'random';
    constructor(name:string, world_id: number, contents = 'random') {
        super(name, world_id);
        this.contents = contents;
    }
}


export class BigKey extends IDungeonItem {
}

export class IPrize extends Item {
    // purposefully empty interface
}


export class Pendant extends IPrize {
    // purposefully empty interface
}

export class Crystal extends IPrize {
    // purposefully empty interface
}


export class Bow extends Item {
    // purposefully empty interface
}


export class Upgrade extends Item {
    // purposefully empty interface
}


export class HealthUpgrade extends Upgrade {
    // purposefully empty interface
}


export class BombUpgrade extends Upgrade {
    // purposefully empty interface
}


export class MagicUpgrade extends Upgrade {
    // purposefully empty interface
}


export class ArrowUpgrade extends Upgrade {
    // purposefully empty interface
}

export class Programmable extends Item {
    // purposefully empty interface
}

export class Event extends Item {
    event: string;
    constructor(name: string, world_id: number) {
        super(name, world_id);
        this.event = name;
    }
}

export class Shield extends Item {
    // purposefully empty interface
}

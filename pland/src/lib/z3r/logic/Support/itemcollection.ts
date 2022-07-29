import type Item from "../item";
import type World from "../world";
import { Collection } from "./collection";

export class ItemCollection extends Collection {
    //items: Map<string, Item> = new Map();
    item_counts : Map<string, number> = new Map();
    checksForWorld?: World;

    public constructor(items:Item[] = []) {
        super();
        items.forEach(item => this.addItem(item));
    }

    clone(): ItemCollection {
        let items_clone = new ItemCollection([]);
        this.items.forEach(item => {
            for (let i = 0; i < this.item_counts.get(item.name)!; i++) {
                items_clone.addItem(item as Item)
            }
        });

        if (this.checksForWorld) {
            items_clone.setChecksForWorld(this.checksForWorld);
        }

        return items_clone;
    }

    public setChecksForWorld(world: World) {
        this.checksForWorld = world;
    }

    public addItem(item: Item) {
        let count = this.item_counts.get(item.name) || 0;

        this.item_counts.set(item.name, count+1);
        this.items.set(item.name, item);

        return this;
    }

    public removeItem(item: Item) {
        if (!this.item_counts.has(item.name)) {
            return this;
        }

        let count = this.item_counts.get(item.name)! - 1;
        if (count == 0) {
            this.items.delete(item.name);
            this.item_counts.delete(item.name);
        }
        else {
            this.item_counts.set(item.name, count);
        }
        

        return this;
    }

    public diff(items: ItemCollection) {
        let difference = this.clone();
        items.items.forEach((entry, key) => {
            difference.removeItem(entry as Item);
        });

        return difference;
    }

    has(key: string, count: number = 1) {
        this.log(`checking if we have at least ${count} of ${key} item.`);
        this.log(`Do we have a ${key}?: ${this.items.has(key)}, Do we have a count of ${key}: ${this.item_counts.has(key)}, the count of ${key}: ${this.item_counts.get(key)!}`);

        return this.items.has(key) && this.item_counts.has(key) && this.item_counts.get(key)! >= count;
    }

    override get(name: string) {
        return this.items.get(name);
    }

    // public filter(predicate: (value: Item, index: number, array: Item[]) => value is Item){
    //     return new ItemCollection([...this.items.values()].filter(predicate));
    // }

    public values() {
        this.items.values();
    }

    // public diff(items:ItemCollection) {
    //     if (!this.items.size) {
    //         return new ItemCollection([...this.items.values()]);
    //     }

    //     let merged = new ItemCollection([...items.items.values()]);
    //     this.items.forEach(item => { merged.addItem(item) });

    //     return merged;
    // }

    canKillMostThings(world:World, enemies: number = 5, messages: string[]|null = null): boolean {
        return this.hasSword()
            || this.has('CaneOfSomaria')
            || (this.canBombThings() && enemies < 6
                && world.config.enemizer.enemy_health == 'default')
            || (this.has('CaneOfByrna') && (enemies < 6 || this.canExtendMagic())
                && world.config.enemizer.enemy_health == 'default')
            || this.canShootArrows(world)
            || this.has('Hammer')
            || this.has('FireRod');
    }

    canLightTorches(): boolean {
        this.log(`Checking CanLightTorches: Lamp: ${this.has('Lamp')}, FireRod: ${this.has('FireRod')}`);
        return this.has('Lamp') || this.has('FireRod');
    }

    canLiftRocks(): boolean {
        this.log(`Checking CanLiftDarkRocks: ProgressiveGlove Count: ${this.item_counts.get('ProgressiveGlove')}, TitansMitts: ${this.has('TitansMitts')}, PowerGlove: ${this.has('PowerGlove')}`);
        return this.has('PowerGlove') || this.has('ProgressiveGlove') || this.has('TitansMitts');
    }

    canLiftDarkRocks(): boolean {
        this.log(`Checking CanLiftDarkRocks: ProgressiveGlove Count: ${this.item_counts.get('ProgressiveGlove')}, TitansMitts: ${this.has('TitansMitts')}`);
        return this.has('ProgressiveGlove', 2) || this.has('TitansMitts');
    }

    canShootArrows(world: World, min_level = 1): boolean{
        switch(min_level) {
            case 2:
                return this.has('BowAndSilverArrows')
                    || this.has('ProgressiveBow', 2)
                        && (world.config.custom && !world.config.custom["rom.rupeeBow"] || this.has('ShopArrow'))
                    || this.has('SilverArrowUpgrade')
                        && (this.has('Bow') || this.has('BowAndArrows') || this.has('ProgressiveBow'));
            case 1:
            default:
                return this.has('Bow') || this.has('ProgressiveBow')
                        && (world.config.custom && !world.config.custom["rom.rupeeBow"] || this.has('ShopArrow'))
                    || this.has('BowAndArrows') || this.has('ProgressiveBow');

        }
    }

    hasSword(min_level: number = 1): boolean {
        switch(min_level) {
            case 4:
                return this.has('ProgressiveSword', 4)
                    || (this.has('UncleSword') && this.has('ProgressiveSword', 3))
                    || this.has('L4Sword');
            case 3:
                return this.has('ProgressiveSword', 3)
                    || (this.has('UncleSword') && this.has('ProgressiveSword', 2))
                    || this.has('L4Sword')
                    || this.has('L3Sword');
            case 2:
                return this.has('ProgressiveSword', 2)
                    || (this.has('UncleSword') && this.has('ProgressiveSword'))
                    || this.has('L2Sword')
                    || this.has('MasterSword')
                    || this.has('L4Sword')
                    || this.has('L3Sword')
            case 1:
            default:
                return this.has('ProgressiveSword')
                    || this.has('UncleSword')
                    || this.has('L1Sword')
                    || this.has('L1SwordAndShield')
                    || this.has('L2Sword')
                    || this.has('MasterSword')
                    || this.has('L4Sword')
                    || this.has('L3Sword')
        }
    }
    
    canMeltThings(world: World): boolean {
        return this.has('FireRod') || (this.has('Bombos') && (this.hasSword() || world.config.weapons == 'swordless'));
    }

    canBombThings(): boolean {
        return true;
    }

    hasABottle(at_least = 1): boolean {
        return this.bottleCount() > at_least;
    }

    canFly(world: World): boolean {
        this.log(`Checking CanFly: Have OcarinaActive: ${this.has('OcarinaActive')}, Have OcarinaInactive: ${this.has('OcarinaInactive')}`);
        return this.has('OcarinaActive') || (this.has('OcarinaInactive') && this.canActivateOcarina(world));
    }

    canActivateOcarina(world: World): boolean {
        if (world.inverted) {
            this.log(`Checking if activate ocarina inverted: MoonPearl: ${this.has('MoonPear')}, DefeatAgahnim: ${this.has('DefeatAgahnim')}, Hammer: ${this.has('Hammer')}`)
            return this.has('MoonPearl') && (this.has('DefeatAgahnim') || ((this.has('Hammer') && this.canLiftRocks()) || (this.canLiftDarkRocks())));
        }
        return true;
    }

    canExtendMagic(world?: World, bars:number = 2): boolean {
        let baseMagic = (this.has('QuarterMagic') ? 4 : (this.has('HalfMagic') ? 2 : 1));
        let bottleMagic = baseMagic * this.bottleCount();
        return baseMagic + bottleMagic >= bars;
    }

    bottleCount(): number {
        return this.filter(item => item.is_bottle).length;
    }

    canGetGoodBee(): boolean {
        return this.has('BugCatchingNet')
            && this.hasABottle()
            && this.has('PegasusBoots') || (this.hasSword() && this.has('Quake'));
    }

    log(message:string) {
        if (this.checksForWorld && this.checksForWorld.messages) this.checksForWorld.messages.push(message);
    }
}
import type { IItem } from "../Item";
import { log } from "../Logic";
import type World from "../World";
import { Collection } from "./Collection";
import { LocationCollection } from "./LocationCollection";

export class ItemCollection extends Collection {
    override items: Map<string, IItem> = new Map();
    item_counts : Map<string, number> = new Map();

    public constructor(items:IItem[] = []) {
        super(items);
        items.forEach(item => this.addItem(item));
    }

    clone(): ItemCollection {
        const items_clone = new ItemCollection([]);
        this.items.forEach(item => {
            for (let i = 0; i < this.item_counts.get(item.name)!; i++) {
                items_clone.addItem(item as IItem)
            }
        });

        items_clone.world_id = this.world_id;

        return items_clone;
    }

    public override addItem(item: IItem) {
        const count = this.item_counts.get(item.name) || 0;

        this.item_counts.set(item.name, count+1);
        this.items.set(item.name, item);

        return this;
    }

    public override removeItem(item: IItem) {
        if (!this.item_counts.has(item.name)) {
            return this;
        }

        const count = this.item_counts.get(item.name)! - 1;
        if (count == 0) {
            this.items.delete(item.name);
            this.item_counts.delete(item.name);
        }
        else {
            this.item_counts.set(item.name, count);
        }
        

        return this;
    }
    merge(items: ItemCollection) {
        const merged = this.clone();
        items.items.forEach((entry, key) => {
            for (let i = 0; i < items.item_counts.get(key)!; i++) {
                merged.addItem(entry as IItem);
            }
        })

        return merged;
    }

    public diff(items: ItemCollection) {
        const difference = this.clone();
        items.items.forEach((entry, key) => {
            for (let i = 0; i < items.item_counts.get(key)!; i++) {
                difference.removeItem(entry as IItem);
            }
        });

        return difference;
    }

    public override has(key: string, count = 1) {
        log(`checking if we have at least ${count} of ${key} item.`);
        log(`Do we have a ${key}?: ${this.items.has(key)}, Do we have a count of ${key}: ${this.item_counts.has(key)}, the count of ${key}: ${this.item_counts.get(key)!}`);

        return this.items.has(key) && this.item_counts.has(key) && this.item_counts.get(key)! >= count;
    }

    public hasOrCanGet(key: string, locations: LocationCollection | null, item: IItem | null = null, locations_checked: string[]): boolean {
        log(`has or can get: ${key}, ${item?.name}, locations_checked: ${locations_checked.join(', ')}`)

        return this.has(key) || locations?.CanGet(key, item, this, locations_checked) || false;
    }

    override get(name: string) {
        return this.items.get(name);
}

public override filter(f: (item: IItem) => boolean): IItem[] { 
    return Array.from(this.items.values()).filter(f);
}

    public values() {
        this.items.values();
    }

    public canKillMostThings(world:World, enemies = 5): boolean {
        log(`Checking if we can kill at least ${enemies} enemies`);
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

    public canLightTorches(): boolean {
        log(`Checking CanLightTorches: Lamp: ${this.has('Lamp')}, FireRod: ${this.has('FireRod')}`);
        return this.has('Lamp') || this.has('FireRod');
    }

    public canLiftRocks(): boolean {
        log(`Checking CanLiftDarkRocks: ProgressiveGlove Count: ${this.item_counts.get('ProgressiveGlove')}, TitansMitts: ${this.has('TitansMitts')}, PowerGlove: ${this.has('PowerGlove')}`);
        return this.has('PowerGlove') || this.has('ProgressiveGlove') || this.has('TitansMitts');
    }

    public canLiftDarkRocks(): boolean {
        log(`Checking CanLiftDarkRocks: ProgressiveGlove Count: ${this.item_counts.get('ProgressiveGlove')}, TitansMitts: ${this.has('TitansMitts')}`);
        return this.has('ProgressiveGlove', 2) || this.has('TitansMitts');
    }

    public canShootArrows(world: World, min_level = 1): boolean{
        log(`Checking if we can shoot arrows`);
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

    public hasSword(min_level = 1): boolean {
        log(`Checking if we have at least a Level ${min_level} Sword`);
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
    
    public canMeltThings(world: World): boolean {
        return this.has('FireRod') || (this.has('Bombos') && (this.hasSword() || world.config.weapons == 'swordless'));
    }

    public canBombThings(): boolean {
        return true;
    }

    public hasABottle(at_least = 1): boolean {
        return this.bottleCount() > at_least;
    }

    public canFly(world: World): boolean {
        log(`Checking CanFly: Have OcarinaActive: ${this.has('OcarinaActive')}, Have OcarinaInactive: ${this.has('OcarinaInactive')}`);
        return this.has('OcarinaActive') || (this.has('OcarinaInactive') && this.canActivateOcarina(world));
    }

    public canActivateOcarina(world: World): boolean {
        if (world.inverted) {
            log(`Checking if activate ocarina inverted: MoonPearl: ${this.has('MoonPear')}, DefeatAgahnim: ${this.has('DefeatAgahnim')}, Hammer: ${this.has('Hammer')}`)
            return this.has('MoonPearl') && (this.canDefeatAgahnim(world) || ((this.has('Hammer') && this.canLiftRocks()) || (this.canLiftDarkRocks())));
        }
        return true;
    }

    public canExtendMagic(world?: World, bars = 2): boolean {
        const baseMagic = (this.has('QuarterMagic') ? 4 : (this.has('HalfMagic') ? 2 : 1));
        const bottleMagic = baseMagic * this.bottleCount();
        return baseMagic + bottleMagic >= bars;
    }

    public bottleCount(): number {
        return  0//this.filter(item => item.is_bottle).length;
    }

    public canGetGoodBee(): boolean {
        return this.has('BugCatchingNet')
            && this.hasABottle()
            && this.has('PegasusBoots') || (this.hasSword() && this.has('Quake'));
    }

    getCrystals() {
        const crystals = new ItemCollection();
        this.items.forEach(entry => {
            if (entry.name.startsWith('Crystal')) {
                crystals.addItem(entry as IItem);
            }
        })

        return crystals;
    }

    public canDefeatAgahnim(world: World): boolean {
        log(`Checking if we have or can defeat Agahnim.`)
        return this.has('DefeatAgahnim') || world.getRegion('Hyrule Castle Tower')?.canComplete(new LocationCollection([]), this) || false;
    }
}
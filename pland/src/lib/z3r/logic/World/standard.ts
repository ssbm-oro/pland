import { East as EastDarkWorldDeathMountain } from "../Region/Standard/DarkWorld/DeathMountain/east";
import { West as WestDarkWorldDeathMountain } from "../Region/Standard/DarkWorld/DeathMountain/west";
import { DesertPalace } from "../Region/Standard/desertpalace";
import { EasternPalace } from "../Region/Standard/easternpalace";
import { HyruleCastleEscape } from "../Region/Standard/hyrulecastleescape";
import { HyruleCastleTower } from "../Region/Standard/hyrulecastletower";
import { West as WestDeathMountain} from "../Region/Standard/LightWorld/DeathMountain/west";
import { East as EastDeathMountain} from "../Region/Standard/LightWorld/DeathMountain/east";
import { NorthEast as NorthEastLightWorld } from "../Region/Standard/LightWorld/northeast";
import { NorthWest as NorthWestLightWorld } from "../Region/Standard/LightWorld/northwest";
import { South as SouthLightWorld } from "../Region/Standard/LightWorld/south";
import { TowerOfHera } from "../Region/Standard/towerofhera";
import World from "../world";
import { NorthEast as NorthEastDarkWorld } from "../Region/Standard/DarkWorld/northeast";
import { NorthWest as NorthWestDarkWorld } from "../Region/Standard/DarkWorld/northwest";
import { South as SouthDarkWorld } from "../Region/Standard/DarkWorld/south";
import { Mire } from "../Region/Standard/DarkWorld/mire";
import { PalaceOfDarkness } from "../Region/Standard/palaceofdarkness";
import { SwampPalace } from "../Region/Standard/swamppalace";
import { SkullWoods } from "../Region/Standard/skullwoods";
import { ThievesTown } from "../Region/Standard/thievestown";
import { IcePalace } from "../Region/Standard/icepalace";
import { MiseryMire } from "../Region/Standard/miserymire";
import { TurtleRock } from "../Region/Standard/turtlerock";
import { GanonsTower } from "../Region/Standard/ganonstower";
import { Medallion } from "../Region/Standard/medallions";
import { Fountains } from "../Region/Standard/fountains";
import type { Config } from "../config";

export default class Standard extends World {
    public constructor (config:Config, messages: string[]|null = null) {
        super(config);
        this.regions.set("North East Light World", new NorthEastLightWorld(this, messages));
        this.regions.set("North West Light World", new NorthWestLightWorld(this, messages));
        this.regions.set("South Light World", new SouthLightWorld(this, messages));
        this.regions.set("Escape", new HyruleCastleEscape(this, messages));
        this.regions.set("Eastern Palace", new EasternPalace(this, messages));
        this.regions.set("Desert Palace", new DesertPalace(this, messages));
        this.regions.set("West Death Mountain", new WestDeathMountain(this, messages));
        this.regions.set("East Death Mountain", new EastDeathMountain(this, messages));
        this.regions.set("Tower of Hera", new TowerOfHera(this, messages));
        this.regions.set("Hyrule Castle Tower", new HyruleCastleTower(this, messages));
        this.regions.set("East Dark World Death Mountain", new EastDarkWorldDeathMountain(this, messages));
        this.regions.set("West Dark World Death Mountain", new WestDarkWorldDeathMountain(this, messages));
        this.regions.set("North East Dark World", new NorthEastDarkWorld(this, messages));
        this.regions.set("North West Dark World", new NorthWestDarkWorld(this, messages));
        this.regions.set("South Dark World", new SouthDarkWorld(this, messages));
        this.regions.set("Mire", new Mire(this, messages));
        this.regions.set("Palace of Darkness", new PalaceOfDarkness(this, messages));
        this.regions.set("Swamp Palace", new SwampPalace(this, messages));
        this.regions.set("Skull Woods", new SkullWoods(this, messages));
        this.regions.set("Thieves Town", new ThievesTown(this, messages));
        this.regions.set("Ice Palace", new IcePalace(this, messages));
        this.regions.set("Misery Mire", new MiseryMire(this, messages));
        this.regions.set("Turtle Rock", new TurtleRock(this, messages));
        this.regions.set("Ganons Tower", new GanonsTower(this, messages));
        this.regions.set("Medallions", new Medallion(this));
        this.regions.set("Fountains", new Fountains(this, messages));

        this.initialize();
    }
}
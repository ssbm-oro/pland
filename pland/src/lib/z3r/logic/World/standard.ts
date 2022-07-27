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
    public constructor (config:Config) {
        super(config);
        this.regions.set("North East Light World", new NorthEastLightWorld(this));
        this.regions.set("North West Light World", new NorthWestLightWorld(this));
        this.regions.set("South Light World", new SouthLightWorld(this));
        this.regions.set("Escape", new HyruleCastleEscape(this));
        this.regions.set("Eastern Palace", new EasternPalace(this));
        this.regions.set("Desert Palace", new DesertPalace(this));
        this.regions.set("West Death Mountain", new WestDeathMountain(this));
        this.regions.set("East Death Mountain", new EastDeathMountain(this));
        this.regions.set("Tower of Hera", new TowerOfHera(this));
        this.regions.set("Hyrule Castle Tower", new HyruleCastleTower(this));
        this.regions.set("East Dark World Death Mountain", new EastDarkWorldDeathMountain(this));
        this.regions.set("West Dark World Death Mountain", new WestDarkWorldDeathMountain(this));
        this.regions.set("North East Dark World", new NorthEastDarkWorld(this));
        this.regions.set("North West Dark World", new NorthWestDarkWorld(this));
        this.regions.set("South Dark World", new SouthDarkWorld(this));
        this.regions.set("Mire", new Mire(this));
        this.regions.set("Palace of Darkness", new PalaceOfDarkness(this));
        this.regions.set("Swamp Palace", new SwampPalace(this));
        this.regions.set("Skull Woods", new SkullWoods(this));
        this.regions.set("Thieves Town", new ThievesTown(this));
        this.regions.set("Ice Palace", new IcePalace(this));
        this.regions.set("Misery Mire", new MiseryMire(this));
        this.regions.set("Turtle Rock", new TurtleRock(this));
        this.regions.set("Ganons Tower", new GanonsTower(this));
        this.regions.set("Medallions", new Medallion(this));
        this.regions.set("Fountains", new Fountains(this));

        this.initialize();
    }
}
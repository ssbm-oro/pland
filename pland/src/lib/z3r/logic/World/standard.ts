import { East as EastDarkWorldDeathMountain } from "../Region/Standard/DarkWorld/DeathMountain/East";
import { West as WestDarkWorldDeathMountain } from "../Region/Standard/DarkWorld/DeathMountain/West";
import { DesertPalace } from "../Region/Standard/DesertPalace";
import { EasternPalace } from "../Region/Standard/EasternPalace";
import { HyruleCastleEscape } from "../Region/Standard/HyruleCastleEscape";
import { HyruleCastleTower } from "../Region/Standard/HyruleCastleTower";
import { West as WestDeathMountain} from "../Region/Standard/LightWorld/DeathMountain/West";
import { East as EastDeathMountain} from "../Region/Standard/LightWorld/DeathMountain/East";
import { NorthEast as NorthEastLightWorld } from "../Region/Standard/LightWorld/NorthEast";
import { NorthWest as NorthWestLightWorld } from "../Region/Standard/LightWorld/NorthWest";
import { South as SouthLightWorld } from "../Region/Standard/LightWorld/South";
import { TowerOfHera } from "../Region/Standard/TowerOfHera";
import World from "../World";
import { NorthEast as NorthEastDarkWorld } from "../Region/Standard/DarkWorld/NorthEast";
import { NorthWest as NorthWestDarkWorld } from "../Region/Standard/DarkWorld/NorthWest";
import { South as SouthDarkWorld } from "../Region/Standard/DarkWorld/South";
import { Mire } from "../Region/Standard/DarkWorld/Mire";
import { PalaceOfDarkness } from "../Region/Standard/PalaceOfDarkness";
import { SwampPalace } from "../Region/Standard/SwampPalace";
import { SkullWoods } from "../Region/Standard/SkullWoods";
import { ThievesTown } from "../Region/Standard/ThievesTown";
import { IcePalace } from "../Region/Standard/IcePalace";
import { MiseryMire } from "../Region/Standard/MiseryMire";
import { TurtleRock } from "../Region/Standard/TurtleRock";
import { GanonsTower } from "../Region/Standard/GanonsTower";
import { Medallion } from "../Region/Standard/Medallions";
import { Fountains } from "../Region/Standard/Fountains";
import type Config from "../Config";

export default class Standard extends World {
    public constructor (config:Config, messages: string[]|null = null) {
        super(config, messages);
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
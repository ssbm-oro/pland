export class Config {
    item: {
        pool: 'normal' | 'hard';
        functionality: 'normal' | 'hard';
    }
    lang: string = 'en';
    mode: 'open' | 'standard' | 'inverted' | 'retro' = 'standard';
    hints: 'on' | 'off' = 'off';
    weapons: 'randomized' | 'vanilla' | 'swordless' | 'assured' = 'randomized';
    crystals: {
        tower: number;
        ganon: number;
    };
    enemizer: {
        boss_shuffle: string;
        enemy_damage: string;
        enemy_health: string;
        enemy_shuffle: string;
    }
    glitches: string = "none";
    spoilers: string = "false";
    entrances: string = "none";
    tournament: boolean = true;
    accessibility: "items" | "locations" | "beatable" = "items";
    dungeon_items: string = "standard";
    item_placement: "basic" | "advanced" = "advanced";
    eq: any;
    l: any;
    drops: any
    custom: {
        canBombJump: boolean;
        canBootsClip: boolean;
        canBunnyRevive: boolean;
        canBunnySurf: boolean;
        canDungeonRevive: boolean;
        canFakeFlipper: boolean;
        canMirrorClip: boolean;
        canMirrorWrap: boolean;
        canOWYBA: boolean;
        canOneFrameClipOW: boolean;
        canSuperBunny: boolean;
        canSuperSpeed: boolean;
        canWaterFairyRevive: boolean;
        canWaterWalk: boolean;
        customPrizePacks: boolean;
        drop: any;
        item: any;
        "item.Goal.Required": string;
        "item.require.Lamp": boolean;
        "item.value.BlueClock": string;
        "item.value.GreenClock": string;
        "item.value.RedClock": string;
        "item.value.Rupoor": string;
        "prizes.crossworld": boolean;
        "prize.shuffleCrystals": boolean;
        "prize.shufflePendants": boolean;
        "region.bossNormalLocation": boolean;
        "region.wildBigKeys": boolean;
        "region.wildKeys": boolean;
        "region.wildMaps": boolean;
        "region.wildCompasses": boolean;
        "rom.dungeonCount": string;
        "rom.freeItemMenu": boolean;
        "rom.freeItemText": boolean;
        "rom.genericKeys": boolean;
        "rom.mapOnPickup": boolean;
        "rom.rupeeBow": boolean | undefined;
        "rom.timerMode": string;
        "rom.timerStart": string;
        "spoil.BootsLocation": boolean;
    }

    public constructor()
    {
        this.item = {pool:"normal", functionality:"normal"};
        this.crystals = {tower:7, ganon:7};
        this.enemizer = {boss_shuffle:"none", enemy_damage:"default", enemy_health:"default", enemy_shuffle:"none"};
        this.custom = {
            canBombJump: false,
            canBootsClip: false,
            canBunnyRevive: false,
            canBunnySurf: false,
            canDungeonRevive: false,
            canFakeFlipper: false,
            canMirrorClip: false,
            canMirrorWrap: false,
            canOWYBA: false,
            canOneFrameClipOW: false,
            canSuperBunny: false,
            canSuperSpeed: false,
            canWaterFairyRevive: false,
            canWaterWalk: false,
            customPrizePacks: false,
            drop: {},
            item: {},
            "item.Goal.Required": '',
            "item.require.Lamp": true,
            "item.value.BlueClock": '',
            "item.value.GreenClock": '',
            "item.value.RedClock": '',
            "item.value.Rupoor": '',
            "prizes.crossworld": true,
            "prize.shuffleCrystals": true,
            "prize.shufflePendants": true,
            "region.bossNormalLocation": true,
            "region.wildBigKeys": false,
            "region.wildKeys": false,
            "region.wildMaps": false,
            "region.wildCompasses": false,
            "rom.dungeonCount": '',
            "rom.freeItemMenu": false,
            "rom.freeItemText": false,
            "rom.genericKeys": false,
            "rom.mapOnPickup": false,
            "rom.rupeeBow": false,
            "rom.timerMode": '',
            "rom.timerStart": '',
            "spoil.BootsLocation": false
        }
    }

}
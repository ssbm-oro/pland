
// TODO: Add enumerable values where possible
export default interface Config {
    customizer: true;
    item: {
        pool: 'normal' | 'hard';
        functionality: 'normal' | 'hard';
    }
    lang: string;
    notes: string;
    mode: 'open' | 'standard' | 'inverted' | 'retro';
    hints: 'on' | 'off';
    weapons: 'randomized' | 'vanilla' | 'swordless' | 'assured';
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
    glitches: string;
    spoilers: string;
    entrances: string;
    tournament: boolean;
    accessibility: "items" | "locations" | "beatable";
    dungeon_items: string;
    item_placement: "basic" | "advanced";
    eq: string[]
    l: Record<string, string>
    drops: unknown
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
        drop?: Record<string, unknown>;
        item: {
            count: Record<string, number>;
        };
        "item.Goal.Required": string;
        "item.require.Lamp": boolean;
        "item.value.BlueClock": string;
        "item.value.GreenClock": string;
        "item.value.RedClock": string;
        "item.value.Rupoor": string;
        "prizes.crossworld"?: boolean;
        "prize.shuffleCrystals": boolean;
        "prize.shufflePendants": boolean;
        "region.bossNormalLocation"?: boolean;
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
}
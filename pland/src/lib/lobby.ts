import type { APIUser } from "discord-api-types/v10";

export const Lobbies = new Map<string, Lobby>();

export class Entrant {
    username: string;
    discriminator: string;
    discord_id: string;
    avatar: string | null;
    ready: boolean = false;
    plantedItems: string[];
    plantedLocations: string[];

    constructor(user: APIUser, maxPlants: number) {
        this.username = user.username;
        this.discriminator = user.discriminator;
        this.discord_id = user.id;
        this.avatar = user.avatar;

        this.plantedItems = Array(maxPlants);
        this.plantedLocations = Array(maxPlants);
    }
}

export default class Lobby {
    slug: string
    created_by: APIUser
    entrants: Entrant[] = []
    max_entrants: number = 2;
    max_plants: number = 2;
    preset: string;


    public constructor(created_by: APIUser, preset:string, max_entrants:number, max_plants:number, slug:string | null = null) {
        this.created_by = created_by;
        this.preset = preset;
        this.max_entrants = max_entrants;
        this.max_plants = max_plants;
        while ((!slug) || (Lobbies.has(slug))) {
            slug = Lobby.getRandomSlug();
        }

        this.slug = slug;

        Lobbies.set(this.slug, this);
    }

    public join(user: APIUser) {
        this.entrants.push(new Entrant(user, this.max_plants));
    }

    public leave(user: APIUser) {
        this.entrants.splice(this.entrants.findIndex(entrant => entrant.discord_id == user.id));
    }

    public plant(user: APIUser, plantedItems: string[], plantedLocations: string[]) {
        const entrant = this.entrants.find(entrant => entrant.discord_id == user.id);
        if (entrant) {
            for(let i = 0; i < this.max_plants; i++) {
                entrant.plantedItems[i] = plantedItems[i]!;
                entrant.plantedLocations[i] = plantedLocations[i]!;
            }
            entrant.ready = true;
        }
    }

    public unplant(user: APIUser) {
        const entrant = this.entrants.find(entrant => entrant.discord_id == user.id);
        if (entrant) {
            for (let i = 0; i < this.max_plants; i++) {
                entrant.plantedItems[i] = '';
                entrant.plantedLocations[i] = '';
            }
            entrant.ready = false;
        }
    }
    
    static getRandomSlug(): string {
        const descriptors = [
            'mad',
            'sane',
            'calm',
            'worried',
            'unplanned',
            'random',
            'happy',
            'very',
            'grooved',
            'peeved',
            'bad',
            'good',
            'perturbed',
            'electro',
            'lab',
            'cheesy',
            'underground',
            'passionate',
            'puny',
            'broken',
            'ecstatic',
            'manic',
            'powerful',
            'regal',
            'planted',
            'seeded',
            'lunar',
            'cruel',
            'clear',
            'unanticipated',
            'expected',
            'extra',
            'alarmed',
            'based',
            'defeated',
            'flush',
            'illicit',
            'dazed',
            'nervous',
            'neurotic',
            'oblivious',
            'tantric',
            'wild',
            'mottled',
            'plain',
            'teenage',
            'mutant',
            'ninja',
            'dark',
            'light',
            'imprisoned',
            'aging',
            'rolling',
            'potted',
            'stoned',
            'medium',
            'super',
            'killer',
            'virtual',
            'offbeat',
            '3d',
            'robo',
            'drunk',
            'future',
            'greedy',
            'the',
            'wounded',
            'silly',
            'noble',
            'lazy',
            'ultra',
            'sleepy',
            'dokidoki',
            'doomed',
            'solid',
            'liquid',
            'zap',
            'quilled',
            'neutral',
            'big',
            'cyber',
            'mecha',
            'sea',
            'earth',
            'shady',
            'untitled',
            'space',
            'were',
            'star',
            'dirty',
            'hot',
            'spiral',
            'lonely',
            //'horny', oro please, show some restraint
        ]
        
        const animals = [
            'rat',
            'cat',
            'slug',
            'tiger',
            'lion',
            'sloth',
            'pig',
            'wolf',
            'stoat',
            'stinkbug',
            'dog',
            'dragon',
            'fox',
            'wyvern',
            'otter',
            'raccoon',
            'koala',
            'bear',
            'turtle',
            'hamster',
            'rabbit',
            'panda',
            'cow',
            'frog',
            'horse',
            'snake',
            'goat',
            'mouse',
            'camel',
            'beaver',
            'dauchshund',
            'giraffe',
            'squid',
            'octopus',
            'fish',
            'mole',
            'crow',
            'termite',
            'llama',
            'bison',
            'chicken',
            'whale',
            'bee',
            'crab',
            'bat',
            'worm',
            'scarab',
            'badger',
            'duck',
            'goose',
            'shark',
            'moose',
            'newt',
            'squirrel',
            'urchin',
            'monkey',
            'elk',
            'donkey',
            'crocodile',
        ]

        const states = [
            'dead',
            'live',
            'eternity',
            'monday',
            'forever',
            'heaven',
            'nirvana',
            'friday',
            'decomposed',
            'returns',
            'angel',
            'devil',
            'middle',
            'finale',
            'purgatory',
            'limbo',
            'beta',
            'redux',
            'evil',
            'ghost',
            'sunday',
            'hell',
            'pluto',
            'skeleton',
            'revenge',
            'allstar',
            'heck',
            'thesis',
            'fried',
            'wired',
            'unready',
            'july',
            'september',
            'evolved',
            'tale',
            'zombie',
            'hero',
            'villain',
            'immortal',
            'boogaloo',
            'approved',
            'ohio',
            'freedom',
            'rising',
            'endgame',
            'world',
            'galaxy',
            'land',
            'odyssey',
            'homecoming',
            'ragnarok',
            'united',
            'apocalpyse',
            '2019',
            'xxx',
            'cage',
            'unleashed',
            'gemini',
            'energy',
            'crisis',
            'tuesday',
            'hut',
            'divided',
            'brunch',
            '64',
            'again',
            'storm',
            'zero',
            'self',
            'begins',
            'diet',
            'element',
            'everything',
            'soup',
            'jr',
            'kart',
            'deity',
            'story',
            'instinct',
            'timeline',
            'era',
            'escape',
            'mansion',
            'messiah',
            'country',
            'party',
            'cola',
            'empire',
            'week',
            'game',
            'style',
            'mode',
            'agenda',
            'direct',
            'club',
        ]

        let getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)] || '';
        return `${getRandom(descriptors)}-${getRandom(animals)}-${getRandom(states)}`;
    }
}
import type { APIUser } from "discord-api-types/v10";
import fs from 'fs';
import type { Config } from "./z3r/logic/config";
import Item from "./z3r/logic/item";
import type Z3rLocation from "./z3r/logic/location"
import type World from "./z3r/logic/world";
import Open from "./z3r/logic/World/open";
const presets = import.meta.glob('./data/presets/*.json');

export const Lobbies = new Map<string, Lobby>();

export async function reloadLobbies() {
    if (Lobbies.size == 0) {
        if (fs.existsSync('lobbies')) {
            fs.readdirSync('lobbies').forEach(async lobbyFile => {
                const lobby: ILobby = JSON.parse(fs.readFileSync(`lobbies/${lobbyFile}`).toString());


                // TODO: move this logic into a preset loader util
                const preset = await presets[`./data/presets/${lobby.preset}`]!() as any;
                const config = preset.settings 

                Lobbies.set(lobby.slug, new Lobby(lobby.created_by, lobby.preset, config, lobby.max_entrants, lobby.max_plants, lobby.slug));
                Lobbies.get(lobby.slug)!.entrants = lobby.entrants;
                lobby.entrants.forEach(entrant => {
                    entrant.plantedItems = Array(lobby.max_plants);
                    entrant.plantedLocations = Array(lobby.max_plants);
                });
            })
        }
        else {
            fs.mkdirSync('lobbies');
        }
    }
}

export interface Entrant {
    username: string;
    discriminator: string;
    discord_id: string;
    avatar: string | null;
    ready: boolean;
    plantedItems: Item[];
    plantedLocations: Z3rLocation[];
}

export interface ILobby {
    slug: string;
    created_by: APIUser;
    entrants: Entrant[];
    max_entrants: number;
    max_plants: number;
    preset: string;
}

export default class Lobby implements ILobby {
    slug: string
    created_by: APIUser
    entrants: Entrant[] = []
    max_entrants: number = 2;
    max_plants: number = 2;
    preset: string;
    world: World;


    public constructor(created_by: APIUser, preset:string, config: Config, max_entrants:number, max_plants:number, slug:string | null = null) {
        this.created_by = created_by;
        this.preset = preset;
        this.max_entrants = max_entrants;
        this.max_plants = max_plants;
        while ((!slug) || (Lobbies.has(slug))) {
            slug = Lobby.getRandomSlug();
        }

        this.slug = slug;

        Lobbies.set(this.slug, this);

        this.world = new Open(config, null);

        this.saveLobby();
    }

    public join(user: APIUser) {
        this.entrants.push({
            username: user.username,
            discriminator: user.discriminator,
            discord_id: user.id,
            avatar: user.avatar,
            ready: false,
            plantedItems: Array(this.max_plants),
            plantedLocations: Array(this.max_plants)
        });

        this.saveLobby();
    }

    public leave(user: APIUser) {
        this.entrants.splice(this.entrants.findIndex(entrant => entrant.discord_id == user.id));

        this.saveLobby();
    }

    saveLobby() {
        fs.writeFileSync(`lobbies/${this.slug}`, JSON.stringify(this));
    }

    public plant(user: APIUser, plantedItems: string[], plantedLocations: string[]) {
        const entrant = this.entrants.find(entrant => entrant.discord_id == user.id);
        if (entrant) {
            for(let i = 0; i < this.max_plants; i++) {
                entrant.plantedItems[i] = new Item(plantedItems[i]!, this.world)
                entrant.plantedLocations[i]! = this.world.locations.get(plantedLocations[i]!)!;
            }
            entrant.ready = true;
        }

        this.saveLobby();
    }

    public unplant(user: APIUser) {
        const entrant = this.entrants.find(entrant => entrant.discord_id == user.id);
        if (entrant) {
            
            entrant.plantedItems = Array(this.max_plants);
            entrant.plantedLocations = Array(this.max_plants);
            entrant.ready = false;
        }

        this.saveLobby();
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
            'grass',
            'fire',
            'water',
            'ice',
            'team',
            'zen',
            'brave',
            'full',
            'clown',
            'red',
            'blue',
            'green',
            'orange',
            'purple',
            'silver',
            'great',
            'paper',
            'pea',
            'quiet',
            'smart',
            'pseudo',
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
            'moth',
            'deer',
            'pug',
            'jaguar',
            'barracuda',
            'iguana',
            'parrot',
            'seal',
            'hawk',
            'owl',
            'lynx',
            'quokka',
            'gull',
            'sheep',
            'lamb',
            'hyena',
            'vulture',
            'falcon',
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
            'outside',
            'tshirt',
            'force',
            'season',
            'msu',
            'agent',
            'law',
            'queen',
            'monarch',
            'king',
            'wedding',
            'funeral',
            'graveyard',
            'gains',
            'signal',
            'attack',
            'punch',
            'quest',
        ]

        const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)] || '';
        return `${getRandom(descriptors)}-${getRandom(animals)}-${getRandom(states)}`;
    }
}
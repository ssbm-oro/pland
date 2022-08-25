import type { APIUser } from "discord-api-types/v10";
import fs from 'fs';
import type { IItem } from "./z3r/logic/Item";
import type { ILocation } from "./z3r/logic/Location"
import type World from "./z3r/logic/World";
import type { IWorld } from "./z3r/logic/World";
import Open from "./z3r/logic/World/Open";
const presets = import.meta.glob('./data/presets/*.json');
import { browser } from '$app/env'
import { checkPlants } from "./z3r/logic/Logic";

export const Lobbies = new Map<string, Lobby>();

export async function reloadLobbies() {
    if (Lobbies.size == 0) {
        if (fs.existsSync('lobbies')) {
            fs.readdirSync('lobbies').forEach(async lobbyFile => {
                let file = fs.readFileSync(`lobbies/${lobbyFile}`).toString();

                const lobby: ILobby = JSON.parse(file).lobby;

                const fullLobby = new Lobby(lobby.created_by, lobby.preset, lobby.max_entrants, lobby.max_plants, lobby.slug, lobby.entrants);

                Lobbies.set(lobby.slug, fullLobby);
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
    plantedItems: IItem[];
    plantedLocations: ILocation[];
}

export interface ILobby {
    slug: string;
    created_by: APIUser;
    entrants: Entrant[];
    max_entrants: number;
    max_plants: number;
    preset: string;
    ready_to_roll: boolean;
}

function saveLobby(lobby: Lobby) {
    if (!browser) {
        fs.writeFileSync(`lobbies/${lobby.lobby!.slug}`, JSON.stringify(lobby));
    }
}

export default class Lobby {
    lobby: ILobby | null = null;
    world: IWorld | null = null;
    initialized = false;


    public constructor(created_by: APIUser | null = null, preset:string | null = null, max_entrants:number | null = null, max_plants:number | null = null, slug:string | null = null, entrants: Entrant[]= []) {
        const save = slug == null;
        if (!slug) {
            do  {
                slug = Lobby.getRandomSlug();
            } while (Lobbies.has(slug))
        }
        
        // TODO: check and error if null or some other type safety >_<
        this.lobby = {
            created_by: created_by!,
            preset: preset!,
            max_entrants: max_entrants!,
            max_plants: max_plants!,
            slug:slug,
            entrants: entrants,
            ready_to_roll: false
        }

        if (save) saveLobby(this);

        Lobbies.set(this.lobby.slug, this);
    }

    public async initialize() {
        if (!this.initialized) {
            // TODO: move this logic into a preset loader util
            const preset = await presets[`./data/presets/${this.lobby!.preset}`]!() as any;
            const config = preset.settings

            this.initialized = true;
            this.world = new Open(config, Array());
        }
    }

    public join(user: APIUser) {
        this.lobby!.entrants.push({
            username: user.username,
            discriminator: user.discriminator,
            discord_id: user.id,
            avatar: user.avatar,
            ready: false,
            plantedItems: Array(this.lobby!.max_plants),
            plantedLocations: Array(this.lobby!.max_plants)
        });

        saveLobby(this);
    }

    public leave(user: APIUser) {
        this.lobby!.entrants.splice(this.lobby!.entrants.findIndex(entrant => entrant.discord_id == user.id));

        saveLobby(this);
    }

    public canPlant(plantedItems: IItem[], plantedLocations: ILocation[]) {
        return checkPlants(this.world as World, plantedItems, plantedLocations);
    }

    public plant(user: APIUser, plantedItems: IItem[], plantedLocations: ILocation[]) {
        const entrant = this.lobby!.entrants.find(entrant => entrant.discord_id == user.id);
        let plantable: boolean = false, messages: string[] = [];
        if (entrant) {
            const canPlant = this.canPlant(plantedItems, plantedLocations);
            plantable = canPlant.plantable;
            messages = canPlant.messages;

            if (plantable) {
                for(let i = 0; i < this.lobby!.max_plants; i++) {
                    const realWorld = this.world as World;
                    entrant.plantedItems[i] = plantedItems[i]!;

                    const z3rLocation = realWorld.locations.get(plantedLocations[i]!.name)!

                    entrant.plantedLocations[i]! = {
                        name: z3rLocation.name,
                        item: z3rLocation.item,
                        isCrystalPendant: z3rLocation.isCrystalPendant,
                        messages: z3rLocation.messages
                    };
                }
                entrant.ready = true;

                this.checkAllReady();
            }
        }

        saveLobby(this);

        return {plantable, messages};
    }

    async checkAllReady() {
        if (this.lobby?.entrants.every(entrant => entrant.ready)) {
            const allItemsPlanted = this.lobby.entrants.flatMap(entrant => entrant.plantedItems);
            const allLocationsPlanted = this.lobby.entrants.flatMap(entrant => entrant.plantedLocations);
            const {plantable, messages} = checkPlants(this.world as World, allItemsPlanted, allLocationsPlanted);
            if (plantable) {
                this.lobby.ready_to_roll = true;
                saveLobby(this);
            }
            else {
                console.log('could not plant');
                this.lobby.entrants.forEach(this.unplantEntrant)
            }
        }
    }

    public unplant(user: APIUser) {
        const entrant = this.lobby!.entrants.find(entrant => entrant.discord_id == user.id);
        if (entrant) {
            
            this.unplantEntrant(entrant);
        }

        saveLobby(this);
    }

    private unplantEntrant(entrant: Entrant) {
        entrant.plantedItems = Array(this.lobby!.max_plants);
        entrant.plantedLocations = Array(this.lobby!.max_plants);
        entrant.ready = false;
    }

    public toJSON() {
        return {
            lobby: this.lobby,
            world: this.world
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
import fetch from 'node-fetch'
import { locations } from '$lib/data/json/alttpr-customizer-schema.json';
import type { APIEmbed, APIEmbedField, RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/v10';
import { DISCORD_WEBHOOK_URI } from "$env/static/private";
import type Lobby from "$lib/lobby";
import type { ILobby } from "$lib/lobby";
import * as default_settings from '$lib/data/json/default-customizer.json'
import type Config from '$lib/z3r/logic/Config';
import { Bottle, BottleContents } from '$lib/z3r/logic/Item';
const presets = import.meta.glob('$lib/data/presets/*.json');
const preset_data = new Map(Object.entries(presets).map(entry => [entry[0].split('/').reverse()[0], entry[1]()]));

const customizer_url = 'https://alttpr.com/api/customizer';

enum discord_log_levels {
    info = 0xe4f2e8,
    success = 0x00ff85,
    error = 0xe11d62
}

export async function roll(lobby: Lobby, test = true) {
    if (!lobby.lobby.ready_to_roll) throw('Lobby should be ready before you try to roll!')

    if (!lobby.initialized) lobby.initialize();

    let hash_url = '';


    if (lobby.world) {
        const preset = await preset_data.get(lobby.lobby.preset) as Config;
        const defaults = JSON.parse(JSON.stringify(default_settings.settings));
        const settings: Config = { ...defaults, ...preset };
        lobby.lobby.entrants.forEach(({plantedLocations, plantedItems}) => {
            plantedLocations.forEach((location, index) =>  {
                const bottleItem = plantedItems[index] as Bottle;
                let plantedItemName = plantedItems[index]?.value || '';
                if (bottleItem.contents) {
                    plantedItemName = getBottleContents(bottleItem.contents);
                }
                addEntrantPlant(settings, location.name, plantedItemName)
            });
        });
        settings.customizer = true;
        settings.spoilers = 'generate';

        lobby.world.config.notes = `${lobby.lobby.preset.replace('.json','')} plando seed wrought to you by ${lobby.lobby.entrants.map(entrant => entrant.username).join(', ')}`;

        const embedFields = createDiscordEmbed(lobby.lobby);
        embedFields.push({name:"Test", value:String(test), inline:true});
        const embed: APIEmbed = {
            color: discord_log_levels.info,
            timestamp: new Date().toISOString(),
            author: {
                name: lobby.lobby.created_by.username,
            },
            fields: embedFields
        }
        let file = 'tested_settings.json';
        let resData: Record<string, unknown> = {};

        const endpoint = customizer_url + (test ? '/test' : '');
        try {
            if (test) {
                console.log(JSON.stringify(settings));
                return {ok:true, message:JSON.stringify(settings)}
            }
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (res.ok)
            {
                resData = await res.json() as Record<string, unknown>;
                let body = 'OK';
                embed.title = 'Settings tested successfully';
                embed.description = `The following settings were submitted to the customizer test and it said it'll roll! 🎲`;
                if (resData['hash']) {
                    body = resData['hash'] as string;
                    hash_url = `http://alttpr.com/en/h/${body}`;
                    embed.title = 'Seed rolled successfully';
                    embed.description = `The following settings were submitted to the customizer and it gave me this crap: ${hash_url}`
                    embed.color = discord_log_levels.success;
                }

                try {
                    if (!test) file = `${body}.json`;
                    delete resData['patch'];
                }
                catch(err) { console.log(err); }

                return({ok:res.ok, message:body, hash_url:hash_url});
            }
            else
            {
                const text = await res.text();
                embed.title = 'Settings failed to roll'
                embed.description = `The following settings were submitted to the customizer and it said no bones: ${text}`
                embed.color = discord_log_levels.error;
                
                return({ok:res.ok, message:text});
            }
        }
        catch(err) {
            console.log(err);
            return {ok:false, message:err}
        }
        finally {
            const payload_json: RESTPostAPIWebhookWithTokenJSONBody = {
                content: embed.title,
                embeds: [embed]
            }

            const webhook_data = new FormData();
            webhook_data.append('payload_json', JSON.stringify(payload_json));
            if (test) resData = {...settings}
            if (file) {
                webhook_data.append('files[0]', new Blob([JSON.stringify(resData)]), file)
            }

            await fetch(DISCORD_WEBHOOK_URI, {
                method: 'POST',
                body: webhook_data
            })
        }
    }
    return {ok:true, message:'Seed settings tested successfully.', hash_url:hash_url}
}

function addEntrantPlant(settings: Config, locationName: string, plantedItem: string) {
    const locationHash = locations.filter(l => l.name == `${locationName}:1`)[0]?.hash || '';
    if (plantedItem) {
        settings.l[locationHash] = plantedItem;
        removeItemFromPool(settings.custom.item.count, plantedItem);
    }
}

function createDiscordEmbed(lobby: ILobby): APIEmbedField[] {
    const embedFields: APIEmbedField[] = [];
    embedFields.push({name:"Preset", value:lobby.preset, inline:true});
    lobby.entrants.forEach(entrant => {
        entrant.plantedLocations.forEach((location, index) => {
            embedFields.push({name:`${entrant.username} Plant ${index+1}`, value:`${location.item?.pretty_name} - ${location.name}`})
        })
    })

    return embedFields;
}

function removeItemFromPool(itemcount: Record<string, number>, item:string) {
    const item_name = item.toLowerCase().includes('bottle') ?  'BottleWithRandom': item.slice(0,-2);
	if (itemcount[item_name] == null) {
        itemcount[item_name] = 0;
    }
    else {
        itemcount[item_name]--;
    }
}
function getBottleContents(plantedBottle: string | undefined): string {
    switch (plantedBottle) {
        case BottleContents.empty.value:
            return 'Bottle:1'
        case BottleContents.red.value:
            return 'BottleWithRedPotion:1';
        case BottleContents.green.value:
            return 'BottleWithGreenPotion:1';
        case BottleContents.blue.value:
            return 'BottleWithBluePotion:1';
        case BottleContents.bee.value:
            return 'BottleWithBee:1';
        case BottleContents.goodbee.value:
            return 'BottleWithGoldBee:1';
        case BottleContents.fairy.value:
            return 'BottleWithFairy:1';
        case BottleContents.random.value:
        default:
            return 'BottleWithRandom:1';
    }
}

import { json as json$1 } from '@sveltejs/kit';
import { fetchSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "@sveltejs/kit";
import log from "loglevel";
import fs from "fs";
import FormData from "form-data";
import * as tempy from "tempy";
import axios from "axios";
import { locations } from '../../../../static/json/alttpr-customizer-schema.json';
import type { FullUser } from "src/interfaces";
import type { APIEmbed, APIEmbedField } from 'discord-api-types/payloads/v10';
import { DISCORD_WEBHOOK_URI } from "$env/static/private";



const webhook_uri = DISCORD_WEBHOOK_URI;
const discord_avatar_uri = `https://cdn.discordapp.com/avatars/$userid/$useravatar.png`;
const customizer_url = 'https://alttpr.com/api/customizer';

enum discord_log_levels {
    info = 0xe4f2e8,
    success = 0x00ff85,
    error = 0xe11d62
}

export const POST: RequestHandler = async ( {request, url, locals} ) => {
    if (!locals.user) {
        return new Response('Unauthorized', { status: 401 })
    }

    let params = new URLSearchParams(await request.text());
    const presetName = params.get('preset');
    const plant1item1 = params.get('plant1item1');
    const plant1location1 = params.get('plant1location1');
    const plant1item2 = params.get('plant1item2');
    const plant1location2 = params.get('plant1location2');
    const plant2item1 = params.get('plant2item1');
    const plant2location1 = params.get('plant2location1');
    const plant2item2 = params.get('plant2item2');
    const plant2location2 = params.get('plant2location2');
    const test = params.get('test') == 'true' ?? false;

    if ((!presetName) || (!plant1item1) || (!plant1location1) || (!plant1item2) ||
        (!plant1location2) || (!plant2item1) || (!plant2location1) ||
        (!plant2item2) || (!plant2location2)) {
            return new Response('Missing parameter(s)', { status: 400 })
    }

    let user = fetchSession(locals.user.id);
    if (!user) {
        return new Response('Forbidden', { status: 403 })
    }
    
    let preset_res = await fetch(new URL(`/presets/${presetName}`, url.origin));
    let preset = await preset_res.json();

    let default_settings_uri = new URL(`/json/default-customizer.json`, url.origin);
    const default_settings = await (await fetch(default_settings_uri)).json();
    add_default_customizer(preset, default_settings);
    
    preset.customizer = true;
    preset.settings['spoilers'] = 'generate';

    plant(preset, plant1item1, plant1location1);
    plant(preset, plant1item2, plant1location2);
    plant(preset, plant2item1, plant2location1);
    plant(preset, plant2item2, plant1location2);

    let player1 = 'Player 1';
    let player2 = 'Player 2';
    preset.settings.notes = `${presetName.replace('.json','')} plando seed wrought to you by ${player1} and ${player2}`;

    let plant_fields: APIEmbedField[] = [];// = field_array(presetName, player1, plant1item1, plant1location1, plant1item2, plant1location2, player2, plant2item1, plant2location1, plant2item2, plant2location2, test)
    plant_fields.push({name:"Preset", value:presetName, inline:true});
    plant_fields.push({name:`${player1} Plant 1`, value:`${plant1item1} - ${getLocationName(plant1location1)}`, inline:true});
    plant_fields.push({name:`${player1} Plant 2`, value:`${plant1item2} - ${getLocationName(plant1location2)}`, inline:true});
    plant_fields.push({name:`${player2} Plant 1`, value:`${plant2item1} - ${getLocationName(plant2location1)}`, inline:true});
    plant_fields.push({name:`${player2} Plant 2`, value:`${plant2item2} - ${getLocationName(plant2location2)}`, inline:true});
    plant_fields.push({name:"Test", value:String(test), inline:true});

    let embed :APIEmbed =  {
        color: discord_log_levels.info,
        timestamp: new Date().toISOString(),
        author: {
            name: user.username
        },
        fields: plant_fields
    }
    if (user.avatar) {
        embed.author!.icon_url = discord_avatar_uri.replace('$userid', user.id).replace('$useravatar', user.avatar);
    }

    log.info("--- sending preset settings ---")
    log.info(preset.settings);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(preset.settings),
        retry: true
    }

    let endpoint = customizer_url + (test ? '/test' : '');

    let discord_webhook_data = new FormData();

    try {
        let res = await fetch(endpoint, options);
        if (res.ok)
        {
            let json = await res.json();
            let body = 'OK';
            embed.title = 'Settings tested successfully';
            embed.description = `The following settings were submitted to the customizer test and it said it'll roll! 🎲`;
            let hash_url;
            if (json['hash']) {
                body = json['hash'];
                hash_url = `http://alttpr.com/en/h/${body}`;
                embed.title = 'Seed rolled successfully';
                embed.description = `The following settings were submitted to the customizer and it gave me this crap: ${hash_url}`
                embed.color = discord_log_levels.success;
            }
            log.info(embed.title);
            log.info(JSON.stringify(json));
            try {
                let options;
                if (test) {
                    options = { extension: 'json' }
                }
                else {
                    options = { name: `${body}.json`}
                }
                delete json['patch'];
                let file = tempy.temporaryWriteSync(JSON.stringify(json), options);
                discord_webhook_data.append('files[0]', fs.createReadStream(file), {contentType: 'application/json'});
            }
            catch(err) { log.error(err); }

            return(new Response(JSON.stringify(body)));
        }
        else
        {
            let text = await res.text();
            embed.title = 'Settings failed to roll'
            embed.description = `The following settings were submitted to the customizer and it said no bones: ${text}`
            embed.color = discord_log_levels.error;
            
            return(new Response(text));
        }
    }
    catch(err) {
        log.error(err);
        return new Response(undefined, { status: 500 })
    }
    finally {
        let payload_json = {
            content: embed.title,
            embeds: [embed]
        }
        discord_webhook_data.append('payload_json', JSON.stringify(payload_json), {contentType: 'application/json'} );

        let discordres = await axios.post(webhook_uri, discord_webhook_data, { headers: discord_webhook_data.getHeaders() });
        log.debug(discordres);
    }
}

function removeItemFromPool(itemcount: { [key: string]: number; }, item:string) {
    let item_name = item.slice(0,-2);
	if (itemcount[item_name] == null) {
			itemcount[item_name] = 0;
		}
		else {
			itemcount[item_name]--;
		}
}

function add_default_customizer(preset_data:any, default_settings:any) {
    log.info("DEFAULT SETTINGS");
    log.info(default_settings["settings"]);
	if (!('l' in preset_data['settings'])) {
		preset_data['settings'] = { ...preset_data['settings'], ...default_settings["settings"] };
	}
    log.info("PRESET_DATA");
    log.info(preset_data);
	return preset_data;
}

function getLocationName(location_hash: string) {
    let location = locations.find(location => location.hash == location_hash);
    if (location) {
        return location.name;
    }

    return location_hash;
}

function plant(preset: any, item: string, location: string) {
    preset.settings.l[location] = item;
    removeItemFromPool(preset.settings.custom.item.count, item);
}
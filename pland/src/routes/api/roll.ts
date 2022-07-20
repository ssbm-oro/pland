import { fetchSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "@sveltejs/kit";
import log from "loglevel";
import fs from "fs";
import FormData from "form-data";
import * as tempy from "tempy";
import axios from "axios";
import path from 'path';

const webhook_uri = import.meta.env.VITE_DISCORD_WEBHOOK_URI;
const discord_avatar_uri = `https://cdn.discordapp.com/avatars/$userid/$useravatar.png`

enum discord_log_levels {
    info = 0xe4f2e8,
    success = 0x00ff85,
    error = 0xe11d62
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

async function add_default_customizer(preset_data:any, origin:string) {
	const default_settings = await (await fetch(`${origin}/json/default-customizer.json`)).json();
    log.info("DEFAULT SETTINGS");
    log.info(default_settings["settings"]);
	if (!('l' in preset_data['settings'])) {
		preset_data['settings'] = { ...preset_data['settings'], ...default_settings["settings"] };
	}
    log.info("PRESET_DATA");
    log.info(preset_data);
	return preset_data;
}

export const POST: RequestHandler = async ( {request, url, locals} ) => {
    let params = new URLSearchParams(await request.text());
    const presetName = params.get('preset') ?? '';
    const plant1item1 = params.get('plant1item1') ?? '';
    const plant1location1 = params.get('plant1location1') ?? '';
    const plant1item2 = params.get('plant1item2') ?? '';
    const plant1location2 = params.get('plant1location2') ?? '';
    const plant2item1 = params.get('plant2item1') ?? '';
    const plant2location1 = params.get('plant2location1') ?? '';
    const plant2item2 = params.get('plant2item2') ?? '';
    const plant2location2 = params.get('plant2location2') ?? '';
    const test = params.get('test') == 'true' ?? false;
    
    let uri = new URL(`/presets/${presetName}`, url.origin)
    log.info(uri);
    var res = await fetch(uri);
    log.info(res);
    let preset = await res.json();
    log.info(preset);
    await add_default_customizer(preset, url.origin);
    log.info(preset);
    
    preset.customizer = true;
    preset.settings['spoilers'] = 'generate';

	let itemcount = preset.settings.custom.item.count;

    preset.settings.l[plant1location1] = plant1item1;
    removeItemFromPool(itemcount, plant1item1);
    preset.settings.l[plant1location2] = plant1item2;
    removeItemFromPool(itemcount, plant1item2);
    preset.settings.l[plant2location1] = plant2item1;
    removeItemFromPool(itemcount, plant2item1);
    preset.settings.l[plant2location2] = plant2item2;
    removeItemFromPool(itemcount, plant2item2);

    let plant_fields = [
        {
            name: 'preset',
            value: presetName,
            inline: true
        },
        {
            name: 'player1plant1item',
            value: plant1item1,
            inline: true
        },
        {
            name: 'player1plant1location',
            value: plant1location1,
            inline: true
        },
        {
            name: 'player1plant2item',
            value: plant1item2,
            inline: true
        },
        {
            name: 'player1plant2location',
            value: plant1location2,
            inline: true
        },
        {
            name: 'player2plant1item',
            value: plant2item1,
            inline: true
        },
        {
            name: 'player2plant1location',
            value: plant2location1,
            inline: true
        },
        {
            name: 'player2plant2item',
            value: plant2item2,
            inline: true
        },
        {
            name: 'player2plant2location',
            value: plant2location2,
            inline: true
        },
        {
            name: 'test',
            value: test,
            inline: true
        }
    ]
    let user = fetchSession(locals.user?.id!);

    let embed = {
        title: '',
        description: '',
        color: discord_log_levels.info,
        timestamp: new Date(),
        author: {
            name: user?.username,
            icon_url: discord_avatar_uri.replace('$userid',user?.id!).replace('$useravatar',user?.avatar!)
        },
        fields: plant_fields
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

    let customizer_url = 'https://alttpr.com/api/customizer';

    if (test) {
        customizer_url = 'https://alttpr.com/api/customizer/test';
    }

    let discord_webhook_data = new FormData();

    try {
        let res = await fetch(customizer_url, options);
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
                embed.description = `The following settings were submitted to the customizer and it gave me this crap: ${hash_url}`;
                embed.color = discord_log_levels.success;
            }
            log.info(embed.title);
            log.info(JSON.stringify(json));
            try {
                let file = tempy.temporaryWriteSync(JSON.stringify(json), {extension:'json'});
                discord_webhook_data.append('files[0]', fs.createReadStream(file), {contentType: 'application/json'});
            }
            catch(err) { log.error(err); }
            return {
                status: res.status,
                body: body
            }
        }
        else
        {
            let text = await res.text();
            embed.title = 'Settings failed to roll'
            embed.description = `The following settings were submitted to the customizer and it said no bones: ${text}`
            embed.color = discord_log_levels.error;
            return {
                status: res.status,
                body: text
            }
        }
    }
    catch(err) {
        log.error(err);
        return {
            status: 500
        }
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
import { fetchSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "@sveltejs/kit";
import log from "loglevel";
import fs from "fs";
import FormData from "form-data";
import * as tempy from "tempy";
import axios from "axios";

const webhook_uri = import.meta.env.VITE_DISCORD_WEBHOOK_URI;

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

    try { 
        let res = await fetch(customizer_url, options);
        if (res.ok)
        {
            let json = await res.json();
            let body = 'OK';
            let user = fetchSession(locals.user?.id!);
            let message = `${new Date().toISOString()} - Settings tested successfully by ${user?.username}`
            if (json['hash']) {
                body = json['hash'];
                message = `${new Date().toISOString()} - Seed rolled successfully: ${body} by ${user?.username}`;
            }
            log.info(message);
            log.info(JSON.stringify(json));
            try {
                let formData = new FormData();
                formData.append('content',message);
                let file = tempy.temporaryWriteSync(JSON.stringify(json), {extension:'json'});
                log.debug(file);
                formData.append('file', fs.createReadStream(file));

                let discordres = await axios.post(webhook_uri, formData, { headers: formData.getHeaders() });
                log.debug(discordres);
            }
            catch(err) { log.error(err); }
            return {
                status: 200,
                body: body
            }
        }
        else
        {
            return {
                status: res.status,
                text: res.statusText
            }
        }
    }
    catch(err) {
        log.error(err);
        return {
            stauts: 500
        }
    }
}
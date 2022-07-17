import type { RequestHandler } from "@sveltejs/kit";
import YAML from "yamljs";
import fs from "fs";

function removeItemFromPool(itemcount: { [key: string]: number; }, item:string) {
    let item_name = item.slice(0,-2);
	if (itemcount[item_name] == null) {
			itemcount[item_name] = 0;
		}
		else {
			itemcount[item_name]--;
		}
}

function add_default_customizer(preset_data:any) {
    const options = {encoding:"utf-8"};
	const default_settings = JSON.parse(fs.readFileSync('src/lib/data/json/default-customizer.json', options));
    console.log(default_settings);
	if (!('l' in preset_data['settings'])) {
		preset_data['settings'] = { ...preset_data['settings'], ...default_settings["settings"] };
	}
	return preset_data;
}

export const post: RequestHandler = async ( {request, params, url} ) => {
    const presetName = url.searchParams.get('preset') ?? '';
    const plant1item1 = url.searchParams.get('plant1item1') ?? '';
    const plant1location1 = url.searchParams.get('plant1location1') ?? '';
    const plant2item1 = url.searchParams.get('plant2item1') ?? '';
    const plant2location1 = url.searchParams.get('plant2location1') ?? '';
    const test = url.searchParams.get('test') == 'true' ?? false;
    
    let preset =  YAML.load(`src/lib/data/presets/${presetName}`);
    add_default_customizer(preset);
    
    preset.customizer = true;
    preset.settings['spoilers'] = 'generate';

	let itemcount = preset.settings.custom.item.count;

    preset.settings.l[plant1location1] = plant1item1;
    removeItemFromPool(itemcount, plant1item1);
    preset.settings.l[plant2location1] = plant2item1;
    removeItemFromPool(itemcount, plant2item1);


    console.log("--- sending preset settings ---")
    console.log(preset.settings);

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
        console.log(res);
        console.log(res.ok);
        if (res.ok)
        {
            let json = await res.json();
            let body = 'OK';
            if (json['hash']) {
                body = json['hash'];
            }
            console.log(body);
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
        console.error(err);
        return {
            stauts: 500
        }
    }
}
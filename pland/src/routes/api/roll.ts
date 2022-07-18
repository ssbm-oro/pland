import type { RequestHandler } from "@sveltejs/kit";

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
    console.log("DEFAULT SETTINGS");
    console.log(default_settings["settings"]);
	if (!('l' in preset_data['settings'])) {
		preset_data['settings'] = { ...preset_data['settings'], ...default_settings["settings"] };
	}
    console.log("PRESET_DATA");
    console.log(preset_data);
	return preset_data;
}

export const POST: RequestHandler = async ( {request, params, url} ) => {
    const presetName = url.searchParams.get('preset') ?? '';
    const plant1item1 = url.searchParams.get('plant1item1') ?? '';
    const plant1location1 = url.searchParams.get('plant1location1') ?? '';
    const plant1item2 = url.searchParams.get('plant1item2') ?? '';
    const plant1location2 = url.searchParams.get('plant1location2') ?? '';
    const plant2item1 = url.searchParams.get('plant2item1') ?? '';
    const plant2location1 = url.searchParams.get('plant2location1') ?? '';
    const plant2item2 = url.searchParams.get('plant2item2') ?? '';
    const plant2location2 = url.searchParams.get('plant2location2') ?? '';
    const test = url.searchParams.get('test') == 'true' ?? false;
    
    let uri = new URL(`/presets/${presetName}`, url.origin)
    console.log(uri);
    var res = await fetch(uri);
    console.log(res);
    let preset = await res.json();
    console.log(preset);
    await add_default_customizer(preset, url.origin);
    console.log(preset);
    
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
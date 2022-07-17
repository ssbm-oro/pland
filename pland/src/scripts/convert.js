import fs from "fs";
import YAML from "yamljs"
import path from "path"

let presets = fs.readdirSync("static/presets/");
presets.forEach(preset => {
    console.log(preset);
    if (preset.endsWith('yaml')) {
        try{
            var config = YAML.load(`static/presets/${preset}`);
        }
        catch (err) { console.error(err); }

        console.log(config);
        var jsonConfig = JSON.stringify(config, null, 2);
        var jsonFileName = "static/presets/" + preset.replace('.yaml','.json');
        fs.writeFileSync(jsonFileName, jsonConfig);
    }
})
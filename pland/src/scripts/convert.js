import fs from "fs";
import YAML from "yamljs"
import path from "path"
import log from 'loglevel';

let presets = fs.readdirSync("static/presets/");
presets.forEach(preset => {
    log.debug(preset);
    if (preset.endsWith('yaml')) {
        try{
            var config = YAML.load(`static/presets/${preset}`);
        }
        catch (err) { log.error(err); }

        log.info(config);
        var jsonConfig = JSON.stringify(config, null, 2);
        var jsonFileName = "static/presets/" + preset.replace('.yaml','.json');
        fs.writeFileSync(jsonFileName, jsonConfig);
    }
})
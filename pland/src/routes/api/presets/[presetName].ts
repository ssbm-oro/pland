import type { RequestHandler } from '@sveltejs/kit';
import YAML from 'yamljs';

export const get: RequestHandler = async ( {params} ) => {
    const presetName = params.presetName;
    var preset =  YAML.load(`src/lib/data/presets/${presetName}`);
    console.log(preset.goal_name);
    return {
        body: { data: preset }
    }
}
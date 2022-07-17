import fs from 'fs';

export async function get() {
    var presets = fs.readdirSync('src/lib/data/presets/');
    return {
        body: { data: presets }
    }
}
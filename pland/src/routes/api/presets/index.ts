import path from "path"
const preset_data = import.meta.glob('../../../../static/presets/*.json');

export async function get() {
    var presets = Object.keys(preset_data).map(filepath => path.basename(filepath));
    return {
        body: { data: presets }
    }
}

import type { PageLoad } from "./$types";
const preset_data = import.meta.glob('../../../static/presets/*.json');

export const load :PageLoad = async () => {
    const presets = Object.keys(preset_data).map(filepath => filepath.split('/').reverse()[0] ?? 'error');
    return { presets: presets }
}
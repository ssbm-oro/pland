import type { PageLoad } from "./$types";
const preset_data = import.meta.glob('$lib/data/presets/*.json');

export const load :PageLoad = async () => {
    return { presets: preset_data }
}
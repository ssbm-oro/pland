import type { PageLoad } from "./$types";
const preset_data = import.meta.glob('$lib/data/presets/*.json');

export const load :PageLoad = async ({ parent, data }) => {
    const { user } = await parent();
    const lobbies = data.lobbies;
    const presets = Object.keys(preset_data).map(filepath => filepath.split('/').reverse()[0] ?? 'error');
    return { lobbies: lobbies, user: user, presets: presets }
}
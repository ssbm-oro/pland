import type { PageLoad } from "./$types";
const preset_data = import.meta.glob('$lib/data/presets/*.json');

export const load :PageLoad = async ({ parent, data, depends }) => {
    const user = (await parent()).user;
    const lobby = data.lobby;
    depends('/entrants')
    depends('/plants')
    return { lobby:lobby, user: user, presets: preset_data }
}
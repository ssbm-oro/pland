import { browser } from "$app/environment";
import { get_loading_message } from "$lib/utils/loadingMessages";
import type { PageLoad } from "./$types";
const preset_data = import.meta.glob('$lib/data/presets/*.json');

export const load :PageLoad = async ({ parent, data, depends }) => {
    const { user } = await parent();
    const lobby = data.lobby;
    const loading_message = browser ? '' : get_loading_message();
    return { lobby:lobby, user: user, presets: preset_data, loading_message:loading_message }
}
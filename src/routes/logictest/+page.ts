import type { PageLoad } from "./$types";
const preset_data = import.meta.glob('$lib/data/presets/*.json');
import { get_loading_message } from "$lib/utils/loadingMessages";
import { browser } from "$app/environment";

export const load :PageLoad = async () => {
    const loading_message = browser ? '' : get_loading_message();
    return { presets: preset_data, loading_message:loading_message }
}
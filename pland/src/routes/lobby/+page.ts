import type { PageLoad } from "./$types";

export const load :PageLoad = async ({ parent, data }) => {
    const user = (await parent()).user;
    const lobbies = data.lobbies;
    return { lobbies: lobbies, user: user }
}
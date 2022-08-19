import type { PageLoad } from "./$types";

export const load :PageLoad = async ({ parent, data }) => {
    let user = (await parent()).user;
    let lobbies = data.lobbies;
    return { lobbies: lobbies, user: user }
}
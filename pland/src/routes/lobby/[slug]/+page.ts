import type { PageLoad } from "./$types";

export const load :PageLoad = async ({ parent, data }) => {
    const user = (await parent()).user;
    const lobby = data.lobby;
    return { lobby:lobby, user: user }
}
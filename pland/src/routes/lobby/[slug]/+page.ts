import type { PageLoad } from "./$types";

export const load :PageLoad = async ({ parent, data, depends, url }) => {
    const user = (await parent()).user;
    const lobby = data.lobby;
    depends(url + '/entrants')
    depends(url + '/plants')
    return { lobby:lobby, user: user }
}
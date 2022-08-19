import type { PageLoad } from "./$types";

export const load :PageLoad = async ({ parent }) => {
    let user = (await parent()).user;
    return { user: user }
}
import type { LayoutServerLoad } from "./$types";
import type { APIUser } from "discord-api-types/v10";

export const load :LayoutServerLoad = async (event) => {
    if (event.locals.user) {
        return { user: {...event.locals.user} as APIUser };
    }
    return {user:null};
}
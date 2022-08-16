import Lobby, {Lobbies} from "$lib/lobby";
import { fetchClientSession } from "$lib/utils/sessionHandler";
import type { PageServerLoad, Action } from "@sveltejs/kit";
import type { APIUser } from "discord-api-types/v10";

export async function load() {
    const lobbies = Array.from(Lobbies.values())
    return { lobbies }
}

export const POST: Action = async ({locals, url}) => {
    if (locals.user) {
        const user = fetchClientSession(locals.user.id) as APIUser;
        const preset = url.searchParams.get("preset");
        const maxPlayers = +(url.searchParams.get("maxPlayers") || 2);
        const numPlants = +(url.searchParams.get("numPlants") || 2);
        if (user ) {
            if (!preset) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
            return { status: 409 }
            let newLobby = new Lobby(user, preset, maxPlayers, numPlants);
            console.log(`/lobby/${newLobby.slug}`);
            throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
            return {
                status: 302,
                headers: {
                    Location: '/lobby/' + newLobby.slug
                }
            }
        }
        throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
        return {
            status: 403
        }
    }
    throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
    return {
        status: 401
    }
}
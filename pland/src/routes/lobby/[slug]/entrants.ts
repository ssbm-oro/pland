import Lobby, {Lobbies} from "$lib/lobby";
import { fetchSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ( { params} ) => {
    const lobby = Lobbies.get(params.slug!);
    if (lobby) {
        let entrants = lobby.entrants;
        entrants.forEach(entrant => { entrant.plantedItems=[]; entrant.plantedLocations=[]; })
        return {
            status: 200,
            body: entrants
        }
    }

    return {
        status: 404
    };
}

export const POST: RequestHandler = async( {params, locals } ) => {
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return { status: 404 }
    if (!locals.user) return { status: 401 }
    const user = fetchSession(locals.user.id)
    if (!user) return { status: 403 }

    if (lobby.entrants.some(entrant => entrant.discord_id == user.id)) {
        lobby.leave(user);
    }
    else
    {
        lobby.join(user);
    }

    return {
        status: 200,
        body: lobby.entrants
    }
}
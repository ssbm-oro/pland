import Lobby, {Entrant, Lobbies} from "$lib/lobby";
import { fetchSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ( { params, locals } ) => {
    const lobby = Lobbies.get(params.slug!);
    let user = fetchSession(locals.user!.id);
    if (lobby) {
        const entrants: Entrant[] = JSON.parse(JSON.stringify(lobby.entrants));
        entrants.forEach(entrant => {
            if (user && user.id != entrant.discord_id) {
                entrant.plantedItems=[];
                entrant.plantedLocations=[]; 
            }
        })
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

    
    lobby.join(user);

    return {
        status: 200,
        body: lobby.entrants
    }
}

export const DELETE: RequestHandler = async( {params, locals} ) => {
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return { status: 404 }
    if (!locals.user) return { status: 401 }
    const user = fetchSession(locals.user.id)
    if (!user) return { status: 403 }

    lobby.leave(user);

    return {
        status: 200
    }
}
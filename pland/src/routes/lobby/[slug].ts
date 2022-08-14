import {Lobbies} from "$lib/lobby";
import { fetchClientSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "./__types/[slug].d";

export const GET: RequestHandler = async ( { params} ) => {
    const lobby = Lobbies.get(params.slug!);
    if (lobby) {
        return {
            status: 200,
            body: { lobby }
        }
    }
    
    return {
        status: 404
    };
}

export const DELETE: RequestHandler = async ( { params, locals } ) => {
    if (!locals.user) return { status: 401 }
    const user = fetchClientSession(locals.user.id)
    if (!user) return { status: 403 }
    
    Lobbies.delete(params.slug!)

    return {
        status: 204
    }
}
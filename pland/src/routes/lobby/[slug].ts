import Lobby, {Lobbies} from "$lib/lobby";
import { fetchClientSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "@sveltejs/kit";
import type { APIUser } from "discord-api-types/v10";

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

export const POST: RequestHandler = async ( { params, locals, request } ) => {
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return { status: 404 }
    if (!locals.user) return { status: 401 }
    const user = fetchClientSession(locals.user.id);
    if (!user) return { status: 403 }

    if (lobby.entrants.includes(user)) {
        lobby.leave(user);
    }
    else
    {
        if (lobby.entrants.length >= lobby.max_entrants) return { status: 409}
        lobby.join(user);
    }

    return {
        status: 200,
        body: { lobby }
    }
}

export const DELETE: RequestHandler = async ( { params, locals } ) => {
    if (!locals.user) return { status: 401 }
    const user = fetchClientSession(locals.user.id)
    if (!user) return { status: 403 }
    
    Lobbies.delete(params.slug!)

    const lobbies = Array.from(Lobbies.values())
    return {
        status: 200,
        body: { lobbies },
        headers: {}
    }
}
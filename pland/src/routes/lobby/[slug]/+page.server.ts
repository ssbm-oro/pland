import {Lobbies} from "$lib/lobby";
import { fetchClientSession } from "$lib/utils/sessionHandler";
import type { PageServerLoad, Action } from "../$types";
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ( { params} ) => {
    const lobby = Lobbies.get(params.slug!);
    if (lobby) {
        return { lobby }
    }
    
    throw error(404);
}

export const DELETE: Action = async ( { params, locals } ) => {
    if (!locals.user) throw error(401);
    const user = fetchClientSession(locals.user.id)
    if (!user) throw error(403);
    
    Lobbies.delete(params.slug!)

    return {
        status: 204
    }
}
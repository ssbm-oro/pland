import { Lobbies } from "$lib/Lobby";
import { fetchClientSession } from "$lib/utils/sessionHandler";
import type { PageServerLoad, Action } from "./$types";
import { error } from '@sveltejs/kit';
import fs from 'fs';

export const load: PageServerLoad = async ( { params } ) => {
    const lobby = Lobbies.get(params.slug!);

    if (lobby !== undefined) {
        return {lobby: lobby.lobby!};
    }
    
    throw error(404);
}

export const DELETE: Action = async ( { params, locals } ) => {
    if (!locals.session) throw error(401);
    const user = fetchClientSession(locals.session.id)
    if (!user) throw error(403);
    
    Lobbies.delete(params.slug!)

    try {
        fs.rmSync(`lobbies/${params.slug}`);
    }
    catch { }
}
import { Lobbies, type ILobby } from "$lib/lobby";
import { fetchClientSession } from "$lib/utils/sessionHandler";
import type { PageServerLoad, Action } from "./$types";
import { error } from '@sveltejs/kit';
import fs from 'fs';

export const load: PageServerLoad = async ( { params, locals } ) => {
    const fullLobby = Lobbies.get(params.slug)
    if (!fullLobby) throw error(404, `Lobby ${params.slug} not found`);
    const lobby: ILobby = JSON.parse(JSON.stringify(fullLobby)).lobby;

    lobby.entrants?.forEach(entrant => {
        if (entrant.discord_id != locals.user?.id) {
            entrant.plantedLocations = [];
            entrant.plantedItems = [];
            entrant.plantedBottles = [];
        }
    });

    return {lobby: lobby};
}

export const DELETE: Action = async ( { params, locals } ) => {
    if (!locals.session) throw error(401);
    const user = fetchClientSession(locals.session.id)
    if (!user) throw error(403);
    
    Lobbies.delete(params.slug)

    try {
        fs.rmSync(`lobbies/${params.slug}`);
    }
    finally {
        //intentionally empty finally block
    }
}
import { json } from '@sveltejs/kit';
import { type Entrant, Lobbies} from "$lib/lobby";
import { fetchClientSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ( { params, locals } ) => {
    const lobby = Lobbies.get(params.slug);
    const user = fetchClientSession(locals.session?.id || '');

    // TODO revisit this
    if (lobby) {
        const entrants: Entrant[] = JSON.parse(JSON.stringify(lobby.lobby.entrants));
        entrants.forEach(entrant => {
            if (user && user.id != entrant.discord_id) {
                entrant.plantedItems=[];
                entrant.plantedLocations=[]; 
            }
        })
        
        return json(entrants);
    }

    return new Response(undefined, { status: 404 });
}

export const POST: RequestHandler = async( {params, locals } ) => {
    const lobby = Lobbies.get(params.slug);
    if (!lobby) return new Response(undefined, { status: 404 })
    if (!locals.session) return new Response(undefined, { status: 401 })
    const user = fetchClientSession(locals.session.id)
    if (!user) return new Response(undefined, { status: 403 })

    
    lobby.join(user);
    return new Response(JSON.stringify(lobby.lobby.entrants));
}

export const DELETE: RequestHandler = async( {params, locals} ) => {
    const lobby = Lobbies.get(params.slug);
    if (!lobby) return new Response(undefined, { status: 404 })
    if (!locals.session) return new Response(undefined, { status: 401 })
    const user = fetchClientSession(locals.session.id)
    if (!user) return new Response(undefined, { status: 403 })

    lobby.leave(user);

    return new Response();
}
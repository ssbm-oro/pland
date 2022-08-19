import { json } from '@sveltejs/kit';
import Lobby, {Lobbies} from "$lib/lobby";
import { fetchSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ( { params, locals } ) => {
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return new Response(undefined, { status: 404 });
    if (!locals.session) return new Response(undefined, { status: 401 })
    const user = fetchSession(locals.session.id);
    if (!user) return new Response(undefined, { status: 403 })
    let entrant = lobby.entrants.find(entrant => entrant.discord_id == user.id);
    if (!entrant) return new Response(undefined, { status: 404 });

    return json({ 
    plantedItems: entrant.plantedItems,
    plantedLocations: entrant.plantedLocations,
    ready: entrant.ready
})
}

export const POST: RequestHandler = async( {params, locals, request } ) => {
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return new Response(undefined, { status: 404 });
    if (!locals.session) return new Response(undefined, { status: 401 })
    const user = fetchSession(locals.session.id);
    if (!user) return new Response(undefined, { status: 403 })
    let entrant = lobby.entrants.find(entrant => entrant.discord_id == user.id);
    if (!entrant) return new Response(undefined, { status: 404 });

    const f = await request.formData();
    
    let plantedItems = JSON.parse(f.get('plantedItems')!.toString());
    let plantedLocations = JSON.parse(f.get('plantedLocations')!.toString());
    if (!plantedItems || !plantedLocations) return new Response(undefined, { status: 409 });

    lobby.plant(user, plantedItems, plantedLocations);


    return json({
    plantedItems: entrant.plantedItems,
    plantedLocations: entrant.plantedLocations,
    ready: entrant.ready
})
}

export const DELETE: RequestHandler = async( {params, locals, request } ) => {
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return new Response(undefined, { status: 404 });
    if (!locals.session) return new Response(undefined, { status: 401 })
    const user = fetchSession(locals.session.id);
    if (!user) return new Response(undefined, { status: 403 })
    let entrant = lobby.entrants.find(entrant => entrant.discord_id == user.id);
    if (!entrant) return new Response(undefined, { status: 404 });

    lobby.unplant(user);

    return new Response(undefined);
}
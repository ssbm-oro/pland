import { json, type RequestHandler } from '@sveltejs/kit';
import Lobby, { Lobbies, type ILobby } from "$lib/Lobby";
import { fetchClientSession } from "$lib/utils/sessionHandler";
import type { ILocation } from '$lib/z3r/logic/Location';

export const GET: RequestHandler = async ( { params, locals } ) => {
    const lobby = Lobbies.get(params.slug!)!.lobby;
    if (!lobby) return new Response(undefined, { status: 404 });

    if (!locals.session) return new Response(undefined, { status: 401 })

    const user = fetchClientSession(locals.session.id);
    if (!user) return new Response(undefined, { status: 403 })

    const entrant = lobby.entrants.find(entrant => entrant.discord_id == user.id);
    if (!entrant) return new Response(undefined, { status: 404 });

    return json({ 
        plantedItems: entrant.plantedItems,
        plantedLocations: entrant.plantedLocations,
        ready: entrant.ready
    })
}

export const POST: RequestHandler = async( {params, locals, request } ) => {
    console.log('plant')
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return new Response(undefined, { status: 404 });

    if (!locals.session) return new Response(undefined, { status: 401 })
    const user = fetchClientSession(locals.session.id);

    if (!user) return new Response(undefined, { status: 403 })

    const entrant = lobby.lobby!.entrants.find(entrant => entrant.discord_id == user.id);
    if (!entrant) return new Response(undefined, { status: 404 });

    const f = await request.formData();
    
    const plantedItems = JSON.parse(f.get('plantedItems')!.toString());
    console.log(' planted locations: ' + f.get('plantedLocations'));
    const plantedLocations: ILocation[] = JSON.parse(f.get('plantedLocations')!.toString());
    console.log(`plantedLocations: ${plantedLocations[0]}`);
    if (!plantedItems || !plantedLocations) return new Response('You must define an item to plant and a location to plant it.', { status: 409 });

    await lobby.initialize();
    lobby.plant(user, plantedItems, plantedLocations);


    return json({
        plantedItems: entrant.plantedItems,
        plantedLocations: entrant.plantedLocations,
        ready: entrant.ready
    })
}

export const DELETE: RequestHandler = async( {params, locals } ) => {
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return new Response(undefined, { status: 404 });

    if (!locals.session) return new Response(undefined, { status: 401 })

    const user = fetchClientSession(locals.session.id);
    if (!user) return new Response(undefined, { status: 403 })
    
    const entrant = lobby.lobby!.entrants.find(entrant => entrant.discord_id == user.id);
    if (!entrant) return new Response(undefined, { status: 404 });

    await lobby.initialize();
    lobby.unplant(user);

    return new Response(undefined);
}
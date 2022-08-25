import { error, json, type RequestHandler } from '@sveltejs/kit';
import { Lobbies } from "$lib/Lobby";
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
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return new Response(undefined, { status: 404 });

    if (!locals.session) return new Response(undefined, { status: 401 })
    const user = fetchClientSession(locals.session.id);

    if (!user) return new Response(undefined, { status: 403 })

    const entrant = lobby.lobby!.entrants.find(entrant => entrant.discord_id == user.id);
    if (!entrant) return new Response(undefined, { status: 404 });

    const f = await request.formData();
    
    const plantedItems = JSON.parse(f.get('plantedItems')!.toString());
    const plantedLocations: ILocation[] = JSON.parse(f.get('plantedLocations')!.toString());
    if (!plantedItems || !plantedLocations) return new Response('You must define an item to plant and a location to plant it.', { status: 409 });

    await lobby.initialize();
    let {plantable, messages} = await lobby.plant(user, plantedItems, plantedLocations);

    if (plantable) {
        return json({
            plantedItems: entrant.plantedItems,
            plantedLocations: entrant.plantedLocations,
            ready: entrant.ready
        })
    }
    else {
        //messages.map(console.log);
        return json({
            plantedItems: Array(),
            plantedLocations: Array(),
            ready: false
        });
    }
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
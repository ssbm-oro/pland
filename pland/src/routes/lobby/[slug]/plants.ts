import Lobby, {Lobbies} from "$lib/lobby";
import { fetchSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ( { params, locals } ) => {
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return { status: 404 };
    if (!locals.user) return { status: 401 }
    const user = fetchSession(locals.user.id);
    if (!user) return { status: 403 }
    let entrant = lobby.entrants.find(entrant => entrant.discord_id == user.id);
    if (!entrant) return { status: 404 };

    return {
        status: 200,
        body: { 
            plantedItems: entrant.plantedItems,
            plantedLocations: entrant.plantedLocations,
            ready: entrant.ready
        }
    }
}

export const POST: RequestHandler = async( {params, locals, request } ) => {
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) return { status: 404 };
    if (!locals.user) return { status: 401 }
    const user = fetchSession(locals.user.id);
    if (!user) return { status: 403 }
    let entrant = lobby.entrants.find(entrant => entrant.discord_id == user.id);
    if (!entrant) return { status: 404 };

    const f = await request.formData();
    const plantedItemsData = f.get('plantedItems');
    const plantedLocationsData = f.get('plantedLocations');
    const readyData = f.get('ready');

    if (!plantedItemsData || !plantedLocationsData) {
        let ready = readyData!.toString() === "true";
        if (!ready) lobby.unplant(user);
    }
    else {
        let plantedItems = JSON.parse(plantedItemsData.toString());
        let plantedLocations = JSON.parse(plantedLocationsData.toString());
        if (!plantedItems || !plantedLocations) return { status: 409 };

        lobby.plant(user, plantedItems, plantedLocations);
    }


    return {
        status: 200,
        body: {
            plantedItems: entrant.plantedItems,
            plantedLocations: entrant.plantedLocations,
            ready: entrant.ready
        }
    }
}
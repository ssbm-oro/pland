import { error, json, type RequestHandler } from "@sveltejs/kit";
import { Lobbies } from "$lib/lobby";
import { roll } from "$lib/z3r/api/Api";

export const POST: RequestHandler = async ( { request, url, locals } ) => {
    if (!locals.session) {
        return new Response('Unauthorized', { status: 401 })
    }

    const slug = url.searchParams.get('slug');
    if (!slug) throw error(409, `Room not specified.`)
    const lobby = Lobbies.get(slug);
    if (!lobby) throw error(404, `Lobby ${slug} not found.`)
    if (lobby.lobby.seed) throw error(409, `Seed already rolled for this lobby.`)

    const seed = await roll(lobby, false);
    if (seed.ok) {
        lobby.lobby.seed = seed.hash_url
    }

    return json(seed);
}
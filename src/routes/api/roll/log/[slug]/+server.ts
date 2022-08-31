import { Lobbies } from '$lib/lobby';
import { fetchClientSession } from '$lib/utils/sessionHandler';
import { error, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';

export const GET: RequestHandler = async ({params, locals, setHeaders }) => {
    const lobby = Lobbies.get(params.slug!);
    if (!lobby) throw error(404, "Lobby not found");

    if (!locals.session) return new Response("Invalid session. You must be logged in to view a logic log.", { status: 401 })
    const user = fetchClientSession(locals.session.id);

    if (!user) throw error(403, "You must be logged in to view a logic log.");

    const entrant = lobby.lobby!.entrants.find(entrant => entrant.discord_id == user.id);
    if (!entrant) throw error(403, "You must be an entrant in to view a logic log.");

    if (lobby.lobby.ready_to_roll) {
        try {
            const messageBuffer = fs.readFileSync(`logs/${lobby.lobby.slug}.log`).toString();
            setHeaders({'Content-Type': 'text/plain'});

            return new Response(messageBuffer, { headers: { } });
        }
        catch(err) { throw error(500, 'Unknown error occurred')}
    }

    throw error(409, 'Lobby was not ready to roll.')
}

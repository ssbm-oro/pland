import Lobby, {Lobbies} from "$lib/lobby";
import { fetchClientSession } from "$lib/utils/sessionHandler";
import type { RequestHandler } from "@sveltejs/kit";
import type { APIUser } from "discord-api-types/v10";

export async function GET() {
    const lobbies = Array.from(Lobbies.values())
    return {
        body: { lobbies }
    }
}

export const POST: RequestHandler = async ({locals, url}) => {
    if (locals.user) {
        const user = fetchClientSession(locals.user.id) as APIUser;
        const preset = url.searchParams.get("preset");
        const maxPlayers = +(url.searchParams.get("maxPlayers") || 2);
        const numPlants = +(url.searchParams.get("numPlants") || 2);
        if (user ) {
            if (!preset) return { status: 409 }
            let newLobby = new Lobby(user, preset, maxPlayers, numPlants);
            console.log(`/lobby/${newLobby.slug}`);
            return {
                status: 302,
                headers: {
                    Location: '/lobby/' + newLobby.slug
                }
            }
        }
        return {
            status: 403
        }
    }
    return {
        status: 401
    }
}
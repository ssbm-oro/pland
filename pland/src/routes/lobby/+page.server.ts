import Lobby, {Lobbies} from "$lib/lobby";
import { fetchClientSession } from "$lib/utils/sessionHandler";
import type { Action } from "@sveltejs/kit";
import type { APIUser } from "discord-api-types/v10";
import { error, redirect } from '@sveltejs/kit'

export async function load() {
    const lobbies = Array.from(Lobbies.values())
    return { lobbies }
}

export const POST: Action = async ({locals, url}) => {
    if (locals.user) {
        const user = fetchClientSession(locals.user.id);
        const preset = url.searchParams.get("preset");
        const maxPlayers = +(url.searchParams.get("maxPlayers") || 2);
        const numPlants = +(url.searchParams.get("numPlants") || 2);
        if (user ) {
            if (!preset) throw error(409)
            let newLobby = new Lobby(user, preset, maxPlayers, numPlants);
            throw redirect(302, '/lobby/' + newLobby.slug);
        }
        throw error(403);
    }
    throw error(401);
}
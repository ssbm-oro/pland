import Lobby, {Lobbies} from "$lib/lobby";
import type { Action } from "@sveltejs/kit";
import { error, redirect } from '@sveltejs/kit'

export async function load() {
    const lobbies = Array.from(Lobbies.values())
    return { lobbies }
}

export const POST: Action = async ({locals, url}) => {
    if (locals.user) {
        const preset = url.searchParams.get("preset");
        const maxPlayers = +(url.searchParams.get("maxPlayers") || 2);
        const numPlants = +(url.searchParams.get("numPlants") || 2);
        if (!preset) throw error(409)
        const newLobby = new Lobby(locals.user, preset, maxPlayers, numPlants);
        throw redirect(302, '/lobby/' + newLobby.slug);
    }
    throw error(401);
}
<script lang="ts">
    import { goto } from "$app/navigation";
    import Presets from "$lib/components/Presets.svelte";

    import type Lobby from "$lib/lobby";
    import { UserStore } from "$lib/stores";
    import type PageData from './$types';

    export let data: PageData;
    $: lobbies = data as Lobby[];

    let selectedPreset: string = '';
    let maxPlayers: number = 2;
    let numPlants: number = 2;

    async function createLobby() {
        let res = await fetch(`/lobby?preset=${selectedPreset}&maxPlayers=${maxPlayers}&numPlants=${numPlants}`, { method:'POST' } );
        if (res.ok) {
            goto(res.url);
        }
    }

    async function deleteLobby(slug:string) {
        let res = await fetch(`/lobby/${slug}`, { method:'DELETE' } );
        res = await fetch(`/lobby/__data.json`);
        lobbies = (await res.json()).lobbies;
    }
</script>

<main>
    <Presets bind:selectedPreset></Presets>
    Max Entrants: <input bind:value="{maxPlayers}" type="number" min="2" max="8"><br/>
    Num Plants: <input bind:value="{numPlants}" type="number" min="1" max="2"><br/>
    <button on:click="{createLobby}">Create Lobby</button>
    <ul>
        {#each lobbies as lobby}
            <li>
                <a href='lobby/{lobby.slug}'>{lobby.slug}</a> - {lobby.preset} - {lobby.entrants.length} / {lobby.max_entrants} entrants.
                {#if $UserStore} <button on:click="{() => deleteLobby(lobby.slug)}">Delete</button>{/if}
            </li>
        {/each}
    </ul>
</main>
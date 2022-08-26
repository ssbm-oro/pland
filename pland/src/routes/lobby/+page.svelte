<script lang="ts">
    import { goto, invalidate } from "$app/navigation";
    import Presets from "$lib/components/Presets.svelte";
    import type { PageData} from './$types';
    import { page } from "$app/stores";
    import { get_loading_message } from "$lib/utils/loadingMessages";

    export let data: PageData;
    $: lobbies = data.lobbies;
    $: user = data.user;
    $: presets = data.presets;

    let selectedPreset: string = '';
    let maxPlayers: number = 2;
    let numPlants: number = 2;
    let loading_message = '';

    async function createLobby() {
        loading_message = get_loading_message();
        const res = await fetch(`/lobby?preset=${selectedPreset}&maxPlayers=${maxPlayers}&numPlants=${numPlants}`, { method:'POST' } );
        if (res.redirected) {
            goto(res.url);
        }
    }

    async function deleteLobby(slug:string) {
        await fetch(`/lobby/${slug}`, { method:'DELETE' } );
        invalidate($page.url.href);
    }
</script>

<main>
    <Presets bind:selectedPreset bind:presets></Presets>
    Max Entrants: <input bind:value="{maxPlayers}" type="number" min="2" max="8"><br/>
    Num Plants: <input bind:value="{numPlants}" type="number" min="1" max="2"><br/>
    {#if loading_message === ''}
        <button on:click="{createLobby}" disabled="{!user}">Create Lobby</button>
    {:else}
        {loading_message}
    {/if}
    <ul>
        {#each lobbies as lobby}
            <li>
                <a href='lobby/{lobby.slug}'>{lobby.slug}</a> - {lobby.preset} - {lobby.entrants.length} / {lobby.max_entrants} entrants.
                {#if user} <button on:click="{() => deleteLobby(lobby.slug)}">Delete</button>{/if}
            </li>
        {/each}
    </ul>
</main>
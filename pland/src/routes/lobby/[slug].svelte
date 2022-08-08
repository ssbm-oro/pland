<script lang="ts">
    import { page } from "$app/stores";
    import type Lobby from "$lib/lobby";
    import { UserStore } from "$lib/stores";

    export let lobby: Lobby;
    $: userInLobby = lobby.entrants.some(entrant => entrant.id == $UserStore.id)

    async function joinLobby() {
        let res = await fetch(`/lobby/${$page.params['slug']}/entrants`, { method: 'POST' });
        if (res.ok) {
            lobby.entrants = await res.json();
        }
    }
</script>

<main>
    <h1>{$page.params['slug']}</h1>
    <h2>Mode: {lobby.preset}</h2>
    <p>Created by: {lobby.created_by.username}#{lobby.created_by.discriminator}</p>
    {#if userInLobby}
        <button on:click='{joinLobby}'>Leave</button>
    {:else}
        <button on:click='{joinLobby}' disabled='{lobby.entrants.length >= lobby.max_entrants}'>Join</button>
    {/if}
    <p>Entrants: {lobby.entrants.length} / {lobby.max_entrants}</p>
        <ul>
            {#each lobby.entrants as entrant }
                <li>{entrant.username}#{entrant.discriminator}</li>
            {/each}
        </ul>
</main>
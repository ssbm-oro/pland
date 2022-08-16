<script lang="ts">
    import { page } from "$app/stores";
    import type Lobby from "$lib/lobby";
    import { UserStore } from "$lib/stores";
    import type World from "$lib/z3r/logic/world";
    import { onMount } from "svelte";
    import Open from "$lib/z3r/logic/World/open";
    import Inverted from "$lib/z3r/logic/World/inverted";
    import Retro from "$lib/z3r/logic/World/retro";
    import Standard from "$lib/z3r/logic/World/standard";
    import Plant from "$lib/components/Plant.svelte";
    import type PageData from './$types';

    export let data: PageData;
    $: lobby = data as Lobby;
    let selectedItems: any[] = new Array(lobby.max_plants);
    let selectedLocations: any[] = new Array(lobby.max_plants);
    let world: World;
    let logicTestMessages: string[] = [];

    $: userInLobby = $UserStore && lobby.entrants.some(entrant => entrant.discord_id == $UserStore.id)
    $: userAsEntrant = $UserStore ? lobby.entrants.find(entrant => entrant.discord_id == $UserStore.id): undefined;

    onMount(async () => {
        try {
            let preset_res = await fetch(`/presets/${lobby.preset}`);
            let selectedPresetData = await preset_res.json();
            switch(selectedPresetData.settings.mode) {
                case 'open':
                    world = new Open(selectedPresetData.settings, logicTestMessages);
                    break;
                case 'inverted':
                    world = new Inverted(selectedPresetData.settings, logicTestMessages);
                    break;
                case 'retro':
                    world = new Retro(selectedPresetData.settings, logicTestMessages);
                    break;
                case 'standard':
                default:
                    world = new Standard(selectedPresetData.settings, logicTestMessages);
                    break;
            }
            if (userAsEntrant) {
                selectedItems = userAsEntrant.plantedItems;
                selectedLocations = userAsEntrant.plantedLocations
            }
        }
        catch (err) {
            console.log(err);
        }
    });

    async function joinLobby() {
        let res = await fetch(`/lobby/${$page.params['slug']}/entrants`, { method: 'POST' });
        if (res.ok) {
            lobby.entrants = await res.json();
        }
    }

    async function leaveLobby() {
        let res = await fetch(`/lobby/${$page.params['slug']}/entrants`, { method: 'DELETE' });
        res = await fetch(`/lobby/${$page.params['slug']}/entrants`);
        if (res.ok) {
            lobby.entrants = await res.json();
        }
    }

    async function submitPlants() {
        if (userAsEntrant) {
            let params = new URLSearchParams();
            params.append('plantedItems', JSON.stringify(selectedItems));
            params.append('plantedLocations', JSON.stringify(selectedLocations));
            params.append('ready', 'true');
            let res = await fetch(`/lobby/${$page.params['slug']}/plants`, { method: 'POST', body: params });
            let data = await res.json();
            selectedItems = data.plantedItems;
            selectedLocations = data.plantedLocations;
            userAsEntrant.ready = data.ready;
        }
    }

    async function resetPlants() {
        if (userAsEntrant) {
            let res = await fetch(`/lobby/${$page.params['slug']}/plants`, { method: 'DELETE' });
            res = await fetch(`/lobby/${$page.params['slug']}/plants`);
            let data = await res.json();
            userAsEntrant.ready = data.ready;
        }
    }
</script>

<main>
    <h1>{$page.params['slug']}</h1>
    <h2>Mode: {lobby.preset}</h2>
    <p>Created by: {lobby.created_by.username}#{lobby.created_by.discriminator}</p>
    {#if userInLobby}
        <button on:click='{leaveLobby}'>Leave</button>
    {:else}
        <button on:click='{joinLobby}' disabled='{lobby.entrants.length >= lobby.max_entrants}'>Join</button>
    {/if}
    <p>Entrants: {lobby.entrants.length} / {lobby.max_entrants}</p>
    <ul>
        {#each lobby.entrants as entrant }{#key userAsEntrant}
            <li>{entrant.username}#{entrant.discriminator} - {#if entrant.ready}✅{:else}☑️{/if}</li>
        {/key}{/each}
    </ul>
    {#if userAsEntrant && world}
        <p>Plants</p>
        {#each selectedItems as selectedItem, index}
            <Plant bind:selectedItem="{selectedItem}" bind:selectedLocation="{selectedLocations[index]}" locations="{world.locations.to_array()}" disabled="{userAsEntrant.ready}"></Plant>
            <br/>
        {/each}
        {#if !userAsEntrant.ready}
            <button on:click="{submitPlants}">Submit</button>
        {:else}
            <button on:click="{resetPlants}">Reset</button>
        {/if}
    {/if}
</main>
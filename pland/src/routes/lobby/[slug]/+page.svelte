<script lang="ts">
    import { page } from "$app/stores";
    import type World from "$lib/z3r/logic/World";
    import { onMount } from "svelte";
    import Open from "$lib/z3r/logic/World/Open";
    import Inverted from "$lib/z3r/logic/World/Inverted";
    import Retro from "$lib/z3r/logic/World/Retro";
    import Standard from "$lib/z3r/logic/World/Standard";
    import Plant from "$lib/components/Plant.svelte";
    import type { PageData} from './$types';
    import { invalidate } from "$app/navigation";
    import type { ILocation } from '$lib/z3r/logic/Location';
    import type { IItem } from "$lib/z3r/logic/Item";
    import { checkPlants } from "$lib/z3r/logic/Logic";
    import DiscordAvatar from "$lib/components/DiscordAvatar.svelte";
    import { Badge, List, ListItem, Card, Button, Alert } from "@brainandbones/skeleton"


    export let data: PageData;
    $: lobby = data.lobby;
    $: user = data.user;

    let selectedItems: IItem[];
    let selectedLocations: ILocation[];
    let world: World;
    let logicTestMessages: string[] = [];

    $: userInLobby = user ? lobby.entrants.some(entrant => entrant.discord_id == user!.id): undefined;
    $: userAsEntrant = user ? lobby.entrants.find(entrant => entrant.discord_id == user!.id): undefined;

    onMount(async () => {
        try {
            selectedItems = new Array(lobby.max_plants);
            selectedLocations = new Array(lobby.max_plants);

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
                selectedItems = userAsEntrant.plantedItems; //.map(item => { return JSON.parse(item);});
                selectedLocations = userAsEntrant.plantedLocations; //.map(location => { return JSON.parse(location); });
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

    let conflictAlertVisible = false;
    let conflictAlertMessage: string;
    async function submitPlants() {
        if (userAsEntrant) {
            let {plantable, messages} = checkPlants(world, selectedItems, selectedLocations)
            if (plantable) {
                let params = new URLSearchParams();
                params.append('plantedItems', JSON.stringify(selectedItems));
                params.append('plantedLocations', JSON.stringify(selectedLocations));
                params.append('ready', 'true');
                await fetch(`/lobby/${$page.params['slug']}/plants`, { method: 'POST', body: params });
                invalidate();
            }
            else {
                conflictAlertVisible = true;
                conflictAlertMessage = messages[messages.length-1]!;
            }
        }
    }

    async function resetPlants() {
        if (userAsEntrant) {
            await fetch(`/lobby/${$page.params['slug']}/plants`, { method: 'DELETE' });
            invalidate();
        }
    }

    let rollAlertVisible = false;
    let rollAlertMessage = `It looks like this seed would roll. I haven't implemented
                            that because I want to test what's here so far more. 
                            Let's make another lobby and try again!`
    async function rollSeed() {
        rollAlertVisible = true;
    }
</script>

<main>
    <h1>{$page.params['slug']}</h1>
    <h2>Mode: {lobby.preset}</h2>
    <p>Created by: {lobby.created_by.username}#{lobby.created_by.discriminator}</p>
    {#if (lobby.ready_to_roll && !userAsEntrant) || (userAsEntrant && userAsEntrant.ready && lobby.ready_to_roll)}
        <Button variant="filled-primary" on:click='{rollSeed}'>Whoever Clicks Me First Gets to Roll the Seed</Button>
        <Alert bind:visible={rollAlertVisible}>
            <svelte:fragment slot="title">Thank you for helping me test</svelte:fragment>
            <svelte:fragment slot="message">{rollAlertMessage}</svelte:fragment>
            <svelte:fragment slot="trail"><Button on:click={() => {rollAlertVisible=false;}}>X</Button></svelte:fragment>
        </Alert>
    {/if}
    {#if userInLobby}
        <Button variant="ring-accent" on:click='{leaveLobby}'>Leave</Button>
    {:else}
        <Button variant="ring-primary" on:click='{joinLobby}' disabled='{!user || lobby.entrants.length >= lobby.max_entrants}'>Join</Button>
    {/if}
    <Card>
        <p>Entrants: {lobby.entrants.length} / {lobby.max_entrants}</p>
        <List>
            {#each lobby.entrants as entrant }{#key userAsEntrant}
                <ListItem>
                    <Card>
                        <Badge>
                            <DiscordAvatar user={{id:entrant.discord_id, ...entrant}} size="sm"/>
                            <svelte:fragment slot="trail">{#if entrant.ready}🟢{:else}⚪️{/if}</svelte:fragment>
                        </Badge>
                        {entrant.username}#{entrant.discriminator}
                    </Card>
                </ListItem>
            {/key}{/each}
        </List>
    </Card>
    {#if userAsEntrant && world}
    <br/><br/>
        <Card>
            <p>Plants</p>
            {#each selectedItems as selectedItem, index}
                <Plant bind:selectedItem bind:selectedLocation={selectedLocations[index]} locations={world.locations.to_array()} {world} disabled={userAsEntrant.ready}></Plant>
                <br/>
            {/each}
            {#if !userAsEntrant.ready}
                <Alert bind:visible={conflictAlertVisible} background="bg-warning-500/30">
                    <svelte:fragment slot="title">A conflict was detected</svelte:fragment>
                    <svelte:fragment slot="message">Check your plants, a conflict was detected: {conflictAlertMessage}</svelte:fragment>
                    <svelte:fragment slot="trail"><Button on:click={() => {conflictAlertVisible=false;}}>X</Button></svelte:fragment>
                </Alert>
                <Button variant="filled-primary" on:click="{submitPlants}">Submit</Button>
            {:else}
                <Button variant="ghost-accent" on:click="{resetPlants}">Reset</Button>
            {/if}
        </Card>
    {/if}
</main>
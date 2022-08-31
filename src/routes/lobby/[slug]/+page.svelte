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
    import { Bottle, type IItem } from "$lib/z3r/logic/Item";
    import { checkPlants } from "$lib/z3r/logic/Logic";
    import DiscordAvatar from "$lib/components/DiscordAvatar.svelte";
    import { Badge, List, ListItem, Card, Button, Alert } from "@brainandbones/skeleton"
    import Icon from "@iconify/svelte";


    export let data: PageData;
    $: lobby = data.lobby;
    $: user = data.user;
    const presets = new Map(Object.entries(data.presets).map(entry => [entry[0].split('/').reverse()[0]!, entry[1]()]));
    const loading_message = data.loading_message;

    let selectedItems: IItem[];
    let selectedLocations: ILocation[];
    let selectedBottles: string[];
    let world: World;
    let logicTestMessages: string[] = [];
    let plants: Plant[];

    $: userInLobby = user ? lobby.entrants.some(entrant => entrant.discord_id == user!.id): undefined;
    $: userAsEntrant = user ? lobby.entrants.find(entrant => entrant.discord_id == user!.id): undefined;

    onMount(async () => {
        try {
            selectedItems = new Array(lobby.max_plants);
            selectedLocations = new Array(lobby.max_plants);
            selectedBottles = new Array(lobby.max_plants);
            plants = new Array(lobby.max_plants);

            const selectedPresetData = await presets.get(lobby.preset) as any;
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
                selectedLocations = userAsEntrant.plantedLocations;
                for (let i = 0; i < lobby.max_plants; i++) {
                    selectedBottles[i] = (selectedItems[i] as Bottle).contents || 'random'
                }
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
    let opponentConflictAlertVisible = false;
    const opponentConflictAlertMessage = `You and your opponent conflicted.
                                        In the future, this message would be
                                        more specific. Please resubmit your picks.`
    async function submitPlants() {
        if (userAsEntrant) {
            let {plantable, messages} = checkPlants(world, selectedItems, selectedLocations)

            for (let i = 0; i < lobby.max_plants; i++) {
                if (selectedItems[i]?.name.toLowerCase().includes('bottle')) {
                    selectedItems[i] = new Bottle('BottleWithRandom:1', world, selectedBottles[i]);
                }
            }

            if (plantable) {
                let params = new URLSearchParams();
                params.append('plantedItems', JSON.stringify(selectedItems));
                params.append('plantedLocations', JSON.stringify(selectedLocations));
                params.append('ready', 'true');
                const res = await fetch(`/lobby/${$page.params['slug']}/plants`, { method: 'POST', body: params });
                const data = await res.json();
                const planted : boolean = data.planted;
                const message : string = data.message;
                await invalidate();
                if (!planted && !userAsEntrant.ready) {
                    opponentConflictAlertVisible = true;
                    plants.forEach(plant => plant.resetPlants());
                }
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
    const rollAlertMessage = `It looks like this seed would roll. I haven't implemented
                            that because I want to test what's here so far more. 
                            Let's make another lobby and try again!`
    async function rollSeed() {
        rollAlertVisible = true;
    }

    let refreshing = false;
    async function refreshLobby() {
        refreshing = true;
        await invalidate();
        refreshing = false;
    }
</script>

<svelte:head>
    <title>pland - {lobby.slug}</title>
    <meta name="A Link to the Past Randomizer Plando Seed Rolling App Lobby">
</svelte:head>

<h1>{$page.params['slug']}</h1>
<h2>Mode: {lobby.preset}</h2>
<p>Created by: {lobby.created_by.username}#{lobby.created_by.discriminator}</p>
{#if (lobby.ready_to_roll && !userAsEntrant) || (userAsEntrant && userAsEntrant.ready && lobby.ready_to_roll)}
    <br/>
    <Button variant="filled-primary" on:click='{rollSeed}'>Whoever Clicks Me First Gets to Roll the Seed</Button>
    <Alert bind:visible={rollAlertVisible}>
        <svelte:fragment slot="title">Thank you for helping me test</svelte:fragment>
        <svelte:fragment slot="message">
            <p>{rollAlertMessage}</p>
            <br/>
        </svelte:fragment>
        <svelte:fragment slot="trail">
            {#if userAsEntrant}
                <Button variant="filled-primary" href="/api/roll/log/{lobby.slug}" download>Download Log</Button>
                {/if}
            <Button on:click={() => {rollAlertVisible=false;}}>X</Button>
        </svelte:fragment>
    </Alert>
    <br/>
{/if}
<Alert bind:visible={opponentConflictAlertVisible}>
    <svelte:fragment slot="title">There was a conflict with your opponent's plants</svelte:fragment>
    <svelte:fragment slot="message">{opponentConflictAlertMessage}</svelte:fragment>
    <svelte:fragment slot="trail"><Button on:click={() => {opponentConflictAlertVisible=false;}}>X</Button></svelte:fragment>
</Alert>
<div class="fixed top-4 right-4">
    <Button variant="ring-primary" on:click={refreshLobby}>
        <Icon class={refreshing ? "transition animate-spin" : undefined} icon="charm:refresh"></Icon>
    </Button>
{#if userInLobby}
    <Button variant="ring-accent" on:click='{leaveLobby}'>Leave</Button>
{:else}
    <Button variant="ring-primary" on:click='{joinLobby}' disabled='{!user || lobby.entrants.length >= lobby.max_entrants}'>Join</Button>
{/if}
</div>
<Card>
    <p>Entrants: {lobby.entrants.length} / {lobby.max_entrants}</p>
    <List>
        {#each lobby.entrants as entrant }{#key userAsEntrant}
            <ListItem>
                <Card>
                    <Badge>
                        <DiscordAvatar user={{id:entrant.discord_id, ...entrant}} size="sm"/>
                        <svelte:fragment slot="trail">
                            {#if entrant.ready}
                                <Icon class="text-primary-500" icon="bi:check-square-fill" />
                            {:else}
                                <Icon class="text-accent-500/50" icon="bi:square-fill" />
                            {/if}
                        </svelte:fragment>
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
            <Plant bind:selectedItem bind:selectedLocation={selectedLocations[index]}
                locations={world.locations.to_array()} {world} disabled={userAsEntrant.ready}
                bind:this={plants[index]} bind:bottleType={selectedBottles[index]}/>
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
{:else}
    {#if userAsEntrant}
        <div class="flex justify-center">
        <p>{loading_message}</p>
            <Icon icon="line-md:loading-twotone-loop" height="48" width="48" />
        </div>
    {/if}
{/if}
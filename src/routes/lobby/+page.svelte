<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import Presets from "$lib/components/Presets.svelte";
    import type { PageData} from './$types';
    import { get_loading_message } from "$lib/utils/loadingMessages";
    import { List, ListItem, Button, RadioGroup, RadioItem, Card, Menu, SlideToggle } from '@brainandbones/skeleton';
    import { writable, type Writable } from "svelte/store";
    import DiscordAvatar from "$lib/components/DiscordAvatar.svelte";
    import Icon from '@iconify/svelte'

    export let data: PageData;
    $: lobbies = data.lobbies;
    $: user = data.user;
    $: presets = data.presets;

    let selectedPreset: string = '';
    const maxPlayers: Writable<number> = writable(2);
    const numPlants: Writable<number> = writable(2);
    let loading_message = '';

    async function createLobby() {
        loading_message = get_loading_message();
        const res = await fetch(`/lobby?preset=${selectedPreset}&maxPlayers=${$maxPlayers}&numPlants=${$numPlants}`, { method:'POST' } );
        if (res.redirected) {
            goto(res.url);
        }
    }

    async function deleteLobby(slug:string) {
        await fetch(`/lobby/${slug}`, { method:'DELETE' } );
        await invalidateAll();
    }

    let filterOnlyUser: boolean = false;
    $: filteredLobbies = (filterOnlyUser && user) ? lobbies.filter(lobby => lobby.entrants.some(entrant => entrant.discord_id == user?.id)) : lobbies;

    let refreshing = false;
    async function refreshLobbies() {
        refreshing = true;
        await invalidateAll();
        refreshing = false;
    }
</script>

<svelte:head>
    <title>pland - Lobbies</title>
    <meta name="A Link to the Past Randomizer Plando Seed Rolling App Lobbies">
</svelte:head>

<Card>
    <h3>Create Lobby</h3>
    <p>
        Please note that modes other than Standard/Open are very unimplemented/untested.
        Dungeon item shuffle logic is also not implemented. The logic assumes the goal is
        7/7 Defeat Ganon.
    </p>
    <Presets bind:selectedPreset bind:presets></Presets>
    <br/>
    <div class="flex flex-col sm:flex-row sm:justify-around">
        <Menu select={true} open={false} class="self-center sm:self-auto" origin="tl">
            <Button slot="trigger" background="bg-accent-500">Max Entrants: {$maxPlayers}</Button>
            <Card slot="content" background="bg-surface-300/80 dark:bg-surface-700/80">
                <List tag="nav" selected={maxPlayers}>
                    <ListItem value={2}>Two</ListItem>
                    <ListItem value={3}>Three</ListItem>
                    <ListItem value={4}>Four</ListItem>
                    <ListItem value={5}>Five</ListItem>
                    <ListItem value={6}>Six</ListItem>
                    <ListItem value={7}>Seven</ListItem>
                    <ListItem value={8}>Eight</ListItem>
                </List>
            </Card>
        </Menu>
        <div class="self-center mt-4 sm:mt-0 sm:self-auto whitespace-normal text-center">
            Num Plants: 
            <RadioGroup selected="{numPlants}" background="bg-accent-500">
                <RadioItem value={1}>One</RadioItem>
                <RadioItem value={2}>Two</RadioItem>
            </RadioGroup>
        </div>
    </div>
    <br/>
    {#if loading_message === ''}
        <br/>
        <div class="flex flex-row justify-center">
            <Button background="bg-accent-600 dark:bg-accent-800" on:click={createLobby} disabled={!user || selectedPreset == ''}>Create Lobby</Button>
        </div>
    {:else}
        {loading_message}
    {/if}
</Card><br/>
<Card class="relative">
    <h3>Join a Lobby</h3>
    <div class="sm:absolute sm:top-4 sm:right-4">
        {#if user}
            <SlideToggle bind:checked={filterOnlyUser} size='sm' class="mr-4">Only My Lobbies</SlideToggle>
        {/if}
        <Button class="mr-4" variant="ring-primary" on:click={refreshLobbies} label="Refresh">
            <Icon class={refreshing ? "transition animate-spin" : undefined} icon="charm:refresh"></Icon>
        </Button>
    </div>
    <br/>
    <List tag="nav">
        {#each filteredLobbies as lobby, i}
            <div class="odd:bg-surface-300 odd:dark:bg-surface-700 flex flex-row-reverse items-center pr-2">
                <div class="flex-none min-w-0 hidden sm:block">
                    {#if user} <Button background="bg-warning-500" on:click|once="{() => deleteLobby(lobby.slug)}">Delete</Button>{/if}
                </div>
                <div class="grow">
                <ListItem href='lobby/{lobby.slug}' tabindex={i}>
                    <div class="grid grid-rows-1 justify-start h-8 grow">
                        <p class="whitespace-normal text-xs sm:text-base place-content-stretch">{lobby.slug}</p>
                        <span class="hidden sm:block sm:absolute sm:right-[36%] md:left-[36%] grow pr-4">
                            <p>{lobby.preset}</p>
                        </span>
                    </div>
                    <svelte:fragment slot="trail">
                        <div class="grid grid-flow-col justify-end shrink">
                            <div class="mr-4">
                                <div class="flex flex-row -space-x-6 grow">
                                    {#each lobby.entrants as entrant}
                                        <div><DiscordAvatar user={{id:entrant.discord_id,...entrant}} size="sm" outlined={entrant.ready} /></div>
                                    {/each}
                                </div>
                            </div>
                            <p class="hidden md:block">{lobby.entrants.length} / {lobby.max_entrants} entrants</p>
                        </div>
                    </svelte:fragment>
                </ListItem>
                </div>
            </div>
        {/each}
    </List>
</Card>

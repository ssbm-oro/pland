<script lang="ts">
    import { goto, invalidate } from "$app/navigation";
    import Presets from "$lib/components/Presets.svelte";
    import type { PageData} from './$types';
    import { page } from "$app/stores";
    import { get_loading_message } from "$lib/utils/loadingMessages";
    import { List, ListItem, Button, RadioGroup, RadioItem, Card, Menu } from '@brainandbones/skeleton';
    import { writable, type Writable } from "svelte/store";

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
        invalidate();
    }
</script>

<main>
    <Card>
        <h3>Create Lobby</h3>
        <p>
            Please note that modes other than Standard/Open are very unimplemented/untested.
            Dungeon item shuffle logic is also not implemented.
        </p>
        <Presets bind:selectedPreset bind:presets></Presets>
        <br/>
        <Menu select={true} open={false}>
            <Button slot="trigger">Max Entrants: {$maxPlayers}</Button>
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
        Num Plants: 
        <RadioGroup selected="{numPlants}" color="bg-accent-500">
            <RadioItem value={1}>One</RadioItem>
            <RadioItem value={2}>Two</RadioItem>
        </RadioGroup>
        <br/>
        {#if loading_message === ''}
            <br/>
            <Button background="bg-primary-500" on:click="{createLobby}" disabled="{!user}">Create Lobby</Button>
        {:else}
            {loading_message}
        {/if}
    </Card><br/>
    <Card>
        <h3>Join a Lobby</h3>
        <List tag="nav">
            {#each lobbies as lobby}
                <ListItem href='lobby/{lobby.slug}'>
                    {lobby.slug} - {lobby.preset} - {lobby.entrants.length} / {lobby.max_entrants} entrants.
                    {#if user} <Button background="bg-warning-500" on:click="{() => deleteLobby(lobby.slug)}">Delete</Button>{/if}
                </ListItem>
            {/each}
        </List>
    </Card>
</main>

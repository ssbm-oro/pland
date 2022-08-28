<script lang="ts">
    import { Card, List, ListItem, Paginator, Button } from '@brainandbones/skeleton';
    import { writable, type Writable } from 'svelte/store';
    import type { ILocation } from '$lib/z3r/logic/Location';


    export let locations: ILocation[];
    locations.push({name:'Random',item:null,isCrystalPendant:false});

    export let Location: ILocation;

    let selectedLocation:Writable<string> = writable(Location ? Location.name: 'Random');
    $: Location = locations.filter(item => item.name === $selectedLocation)[0]!;
    export let disabled:boolean = false;

    $: search = undefined as string | undefined;
    $: locationsPaginated = locations.filter(item => item.name.toLowerCase().includes(search ? search.toLowerCase(): '')).slice(
        page.offset * page.limit, // start
        page.offset * page.limit + page.limit // end
    );

    const page = {
        offset: 0,
        limit: 10,
        size: locations.length,
        amounts: [5,10,20,40],
    };

    function changeSelection() {
        $selectedLocation = 'Random'
    }
</script>

<main>
    <Card>
        {#if disabled || $selectedLocation != 'Random' }
            <Button variant="ring-primary" on:click={changeSelection} {disabled}>
                {Location.name}
            </Button>
        {:else}
            <input type="search" placeholder="Select a location..." bind:value={search}>
            <List tag="nav" selected={selectedLocation}>
                {#each locationsPaginated as location }
                    <ListItem value={location.name}>{location.name}</ListItem>
                {/each}
            </List>
            <Paginator
                bind:offset={page.offset}
                bind:limit={page.limit}
                bind:amounts={page.amounts}
                bind:size={page.size}
            ></Paginator>
        {/if}
    </Card>
</main>

<style>
</style>
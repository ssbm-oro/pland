<script lang="ts">
    import { Card, List, ListItem, Paginator, Button } from '@brainandbones/skeleton';
    import { writable, type Writable } from 'svelte/store';
    import type { ILocation } from '$lib/z3r/logic/Location';
    import { onMount } from 'svelte';


    export let locations: ILocation[];
    locations.push({name:'Random',item:null,isCrystalPendant:false});

    let selectedLocation:Writable<string> = writable('Random');

    $: console.log(selectedLocation);

    export let Location: ILocation;
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

    onMount(() => {
        console.log(locations);
    })
</script>

<main>
    {#if !disabled}
        <Card>
            {#if $selectedLocation != 'Random' }
                <Button variant="ring-primary" on:click={changeSelection}>
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
    {/if}
</main>

<style>
</style>
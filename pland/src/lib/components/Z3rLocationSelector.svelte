<script lang="ts">
    import { Card, List, ListItem, Paginator, Button } from '@brainandbones/skeleton';
    import { writable, type Writable } from 'svelte/store';
    import type { ILocation } from '$lib/z3r/logic/Location';
    import type { SelectedItem } from './ComponentInterfaces';
    import type World from '$lib/z3r/logic/World';
    import Item from '$lib/z3r/logic/Item';
    import { items } from '$lib/data/json/alttpr-customizer-schema.json';
    import { ItemCollection } from '$lib/z3r/logic/Support/ItemCollection';
    import { onMount } from 'svelte';

    let available = new ItemCollection();

    export let locations: ILocation[];
    locations.push({name:'Random',item:null,isCrystalPendant:false});

    export let Location: ILocation;

    export let selectedItem :SelectedItem;
    export let world: World;

    let selectedLocation:Writable<string> = writable(Location ? Location.name: 'Random');
    $: Location = locations.filter(location => location.name === $selectedLocation)[0]!;
    export let disabled:boolean = false;

    $: search = undefined as string | undefined;
    $: locationsFiltered = locations.filter(location => filterLocationsByItem(location, selectedItem)).filter(location => location.name.toLowerCase().includes(search ? search.toLowerCase(): ''));
    $: locationsPaginated = locationsFiltered.slice(
        page.offset * page.limit, // start
        page.offset * page.limit + page.limit // end
    );

    $: page = {
        offset: 0,
        limit: 10,
        size: locationsFiltered.length,
        amounts: [5,10,20,40],
    };

    function filterLocationsByItem(location: ILocation, item: SelectedItem) {
        if ((item && item.name != "Random") && (location.name != "Random")) {
            const z3rLocation = world.locations.get(location.name);
            const z3rItem = Item.get(item.name, world);
            if (z3rLocation && z3rItem) {
                available.removeItem(z3rItem);
                let plantable = z3rLocation.canFill(z3rItem, available, true)
                available.addItem(z3rItem);
                return plantable;
            }
        }
        return true;
    }

    function changeSelection() {
        $selectedLocation = 'Random'
    }

    onMount(() => {
        items.forEach(item => {
            if (item.count && item.count > 0) {
                let itemObj = Item.get(item.value, world);
                if (!itemObj)
                    itemObj = Item.get(item.value.slice(0, -2), world);
                
                if (itemObj) {
                    for(let i = 0; i < item.count; i++) {
                        available.addItem(itemObj);
                    }
                }
            }
        });
        available.addItem({name:'RescueZelda', world_id: world.id, value:'RescueZelda'})
    })
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
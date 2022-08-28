<script lang="ts">
    import Icon from '@iconify/svelte';
    import { items } from '$lib/data/json/alttpr-customizer-schema.json';
    import type { SelectedItem } from './ComponentInterfaces';
    import { Card, List, ListItem, Button } from '@brainandbones/skeleton';
    import { writable, type Writable } from 'svelte/store';


    export let Item: SelectedItem;
    const selectedItem:Writable<string> = writable(Item ? Item.name : items[0]!.name);
    $: Item = items.filter(item => item.name === $selectedItem)[0] as SelectedItem;
    export let disabled:boolean = false;

    $: search = undefined as string | undefined;
    $: itemsFiltered = items.filter(item => item.count && item.count > 0).filter(item => item.name.toLowerCase().includes(search ? search.toLowerCase(): ''))

    function changeSelection() {
        $selectedItem = items[0]!.name;
    }

    // Selects the top item from the list when the enter button is pressed
    // in the search box
    function selectOnEnter(event: KeyboardEvent) {
        if (event.isTrusted && event.key == "Enter" && itemsFiltered[0]) {
            $selectedItem = itemsFiltered[0].name;
        }
    }
</script>

<main>
    <Card>
        {#if disabled || Item && Item.name != "Random"}
            <Button variant="ring-primary" on:click={changeSelection} {disabled}>
                <svelte:fragment slot="lead">
                    <Icon icon={Item.icon?.icon} color={Item.icon?.color} hFlip={Item.icon?.hFlip} vFlip={Item.icon?.vFlip}></Icon>
                </svelte:fragment>
                {$selectedItem}
            </Button>
        {:else}
        <input type="search" placeholder="Select an item..." bind:value={search} on:keypress={selectOnEnter}>
        <div>
            <List tag="nav" selected={selectedItem} class="max-h-96 overflow-y-auto">
                {#each itemsFiltered as item }
                    <ListItem value={item.name}>
                        <svelte:fragment slot="lead">
                            <Icon icon={item.icon?.icon} color={item.icon?.color} hFlip={item.icon?.hFlip} vFlip={item.icon?.vFlip}></Icon>
                        </svelte:fragment>
                        {item.name}
                    </ListItem>
                {/each}
            </List>
        </div>
        {/if}
    </Card>
</main>

<style>
</style>
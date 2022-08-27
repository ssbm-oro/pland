<script lang="ts">
    import Icon from '@iconify/svelte';
    import { items } from '$lib/data/json/alttpr-customizer-schema.json';
    import type { SelectedItem } from './ComponentInterfaces';
    import { Card, List, ListItem, Paginator, Button } from '@brainandbones/skeleton';
    import { writable, type Writable } from 'svelte/store';


    const selectedItem:Writable<string> = writable(items[0]!.name);
    $: selection = items.filter(item => item.name === $selectedItem)[0] as SelectedItem;
    $: console.log(selection);
    export const Item = selection;
    $: console.log(Item);
    export let disabled:boolean = false;

    $: search = undefined as string | undefined;
    $: itemsPaginated = items.filter(item => item.count && item.count > 0).filter(item => item.name.toLowerCase().includes(search ? search.toLowerCase(): '')).slice(
        page.offset * page.limit, // start
        page.offset * page.limit + page.limit // end
    );

    const page = {
        offset: 0,
        limit: 10,
        size: items.length,
        amounts: [5,10,20,40],
    };

    function changeSelection() {
        $selectedItem = items[0]!.name;
    }
</script>

<main>
    {#if !disabled}
        <Card>
            {#if selection.name != "Random"}
                <Button variant="ring-primary" on:click={changeSelection}>
                    <svelte:fragment slot="lead">
                        <Icon icon={selection.icon?.icon} color={selection.icon?.color} hFlip={selection.icon?.hFlip} vFlip={selection.icon?.vFlip}></Icon>
                    </svelte:fragment>
                    {$selectedItem}
                </Button>
            {:else}
            <input type="search" placeholder="Select an item..." bind:value={search}>
            <List tag="nav" selected={selectedItem}>
                {#each itemsPaginated as item }
                    <ListItem value={item.name}><Icon icon={item.icon?.icon} color={item.icon?.color} hFlip={item.icon?.hFlip} vFlip={item.icon?.vFlip}></Icon>{item.name}</ListItem>
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
    {:else}
        {Item?.value.replace(':1','')}
    {/if}
    {#if Item && Item.icon && Item.icon.icon }
        <Icon icon="{Item.icon.icon}" color="{Item.icon.color}" vFlip="{Item.icon.vFlip}" hFlip="{Item.icon.hFlip}"></Icon>
    {/if}
</main>

<style>
</style>
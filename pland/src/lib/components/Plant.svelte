<script lang="ts">
    import Icon from '@iconify/svelte';
    import type Location from '$lib/z3r/logic/location';
    import { items } from '$lib/data/json/alttpr-customizer-schema.json';

    export let selectedItem:any;
    export let selectedLocation:any;
    export let locations: Location[];
    export let disabled:boolean = false;
</script>

<main>
    {#if !disabled}
        <select bind:value="{selectedItem}">
            {#each items as item (item.value)}
                {#if item.count && item.count > 0}
                    <option value="{item}">{item.value.replace(':1','')}</option>
                {/if}
            {/each}
        </select>
    {:else}
        {selectedItem.value.replace(':1','')}
    {/if}
    {#if selectedItem && selectedItem.icon && selectedItem.icon.icon }
        <Icon icon="{selectedItem.icon.icon}" color="{selectedItem.icon.color}" vFlip="{selectedItem.icon.vFlip}" hFlip="{selectedItem.icon.hFlip}"></Icon>
    {/if}
    {#if !disabled}
        <br/>
        <select bind:value="{selectedLocation}">
            {#each locations as location (location.name)}
                <option value="{location}">{location.name}</option>
            {/each}
        </select>
    {:else}
        {selectedLocation.name}
    {/if}
</main>

<style>
</style>
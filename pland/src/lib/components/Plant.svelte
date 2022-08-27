<script lang="ts">
    import type { ILocation } from '$lib/z3r/logic/Location';
    import Z3rItemSelector from './Z3rItemSelector.svelte';
    import type { SelectedItem } from './ComponentInterfaces';
    import Icon from '@iconify/svelte';

    export let selectedItem:SelectedItem;
    export let selectedLocation:any;
    export let locations: ILocation[];
    export let disabled:boolean = false;
</script>

<main>
    <Z3rItemSelector bind:Item={selectedItem} {disabled} />
    <div class="relative left-8"><Icon icon="el:arrow-down" width="60"></Icon></div>
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
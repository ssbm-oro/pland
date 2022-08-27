<script lang="ts">
    import type { ILocation } from '$lib/z3r/logic/Location';
    import Z3rItemSelector from './Z3rItemSelector.svelte';
    import type { SelectedItem } from './ComponentInterfaces';
    import Icon from '@iconify/svelte';
import Z3rLocationSelector from './Z3rLocationSelector.svelte';

    export let selectedItem:SelectedItem;
    export let selectedLocation:any;
    export let locations: ILocation[];
    export let disabled:boolean = false;
    $: console.log(selectedItem);
</script>

<main>
    <Z3rItemSelector bind:Item={selectedItem} {disabled} />
    <div class="relative left-8"><Icon icon="el:arrow-down" width="60"></Icon></div>
    <Z3rLocationSelector bind:Location={selectedLocation} {disabled} {locations}/>
</main>

<style>
</style>
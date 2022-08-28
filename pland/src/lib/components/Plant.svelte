<script lang="ts">
    import type { ILocation } from '$lib/z3r/logic/Location';
    import Z3rItemSelector from './Z3rItemSelector.svelte';
    import type { SelectedItem } from './ComponentInterfaces';
    import Icon from '@iconify/svelte';
    import Z3rLocationSelector from './Z3rLocationSelector.svelte';
    import type World from '$lib/z3r/logic/World'

    export let selectedItem:SelectedItem;
    export let selectedLocation:any;
    export let locations: ILocation[];
    export let disabled:boolean = false;
    export let world: World;
</script>

<main>
    <div class="flex flex-row">
        <Z3rItemSelector bind:Item={selectedItem} {disabled} />
        <div class="relative"><Icon icon="el:arrow-right" width="60"></Icon></div>
        <Z3rLocationSelector bind:Location={selectedLocation} {disabled} {locations} bind:selectedItem {world}/>
    </div>
</main>

<style>
</style>
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
    $: iconColor = selectedItem && selectedItem.name != "Random" && selectedLocation && selectedLocation.name != "Random" ? "green" : "white";
    let width: number;
    $: rotate = width > 1024 ? 0 : 1;
    let itemSelector: Z3rItemSelector;
    let locationSelector: Z3rLocationSelector;

    export function resetPlants() {
        itemSelector.changeSelection();
        locationSelector.changeSelection();
    }
</script>

<svelte:window bind:innerWidth={width}></svelte:window>
<main>
    <div class="lg:flex lg:flex-row">
        <Z3rItemSelector bind:Item={selectedItem} {disabled} bind:this={itemSelector}/>
        <div class="flex justify-center lg:justify-start">
            <Icon icon="el:arrow-right" width="60" bind:color={iconColor} {rotate}></Icon>
        </div>
        <Z3rLocationSelector bind:Location={selectedLocation} {disabled} {locations} bind:selectedItem {world} bind:this={locationSelector}/>
    </div>
</main>

<style>
</style>
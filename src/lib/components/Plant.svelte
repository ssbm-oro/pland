<script lang="ts">
    import type { ILocation } from '$lib/z3r/logic/Location';
    import Z3rItemSelector from './Z3rItemSelector.svelte';
    import type { SelectedItem } from './ComponentInterfaces';
    import Icon from '@iconify/svelte';
    import Z3rLocationSelector from './Z3rLocationSelector.svelte';
    import type World from '$lib/z3r/logic/World';

    export let selectedItem:SelectedItem;
    export let selectedLocation:any;
    export let locations: ILocation[];
    export let disabled:boolean = false;
    export let world: World;
    export let bottleType: string | undefined = 'unselected';
    let itemSelector: Z3rItemSelector;
    let locationSelector: Z3rLocationSelector;
    let itemSelected: boolean;
    let locationSelected: boolean;


    $: itemAndLocationSelected = itemSelected && locationSelected;
    $: iconColor = itemAndLocationSelected ? "#0c0" : "#ccc";

    export function resetPlants() {
        itemSelector.changeSelection();
        locationSelector.changeSelection();
    }
</script>

<div class="flex flex-col md:flex-row border-solid border-primary-500 rounded-lg w-full items-center justify-center md:justify-start" class:border={itemAndLocationSelected} class:md:w-fit={itemAndLocationSelected}>
    <Z3rItemSelector bind:Item={selectedItem} {disabled} bind:this={itemSelector} bind:Bottle={bottleType} hideBorder={!itemAndLocationSelected} bind:selected={itemSelected}/>
    <div class="flex justify-start md:ml-2 md:mr-2">
        <Icon icon="el:arrow-right" width="60" color={iconColor} class="rotate-90 md:rotate-0"></Icon>
    </div>
    <Z3rLocationSelector bind:Location={selectedLocation} {disabled} {locations} bind:selectedItem {world} bind:this={locationSelector}  hideBorder={!itemAndLocationSelected} bind:selected={locationSelected}/>
</div>

<style>
</style>
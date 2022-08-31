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
    $: itemAndLocationSelected = !!(selectedItem && selectedItem.name != "Random" && selectedLocation && selectedLocation.name != "Random");
    $: iconColor = itemAndLocationSelected ? "#0c0" : "#ccc";
    let itemSelector: Z3rItemSelector;
    let locationSelector: Z3rLocationSelector;
    export let bottleType: string | undefined = 'unselected';

    export function resetPlants() {
        itemSelector.changeSelection();
        locationSelector.changeSelection();
    }
</script>

<div class="flex flex-col md:flex-row overflow-auto border-solid border-primary-500 rounded-lg w-full md:w-fit items-center justify-center md:justify-start" class:border={itemAndLocationSelected}>
    <Z3rItemSelector bind:Item={selectedItem} {disabled} bind:this={itemSelector} bind:Bottle={bottleType} hideBorder={!itemAndLocationSelected}/>
    <div class="flex justify-start md:ml-2 md:mr-2">
        <Icon icon="el:arrow-right" width="60" color={iconColor} class="rotate-90 md:rotate-0"></Icon>
    </div>
    <Z3rLocationSelector bind:Location={selectedLocation} {disabled} {locations} bind:selectedItem {world} bind:this={locationSelector}  hideBorder={!itemAndLocationSelected}/>
</div>

<style>
</style>
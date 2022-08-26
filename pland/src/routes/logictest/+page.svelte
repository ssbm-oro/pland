<script lang="ts">
    import type World from "$lib/z3r/logic/World";
    import Inverted from "$lib/z3r/logic/World/Inverted";
    import Retro from "$lib/z3r/logic/World/Retro";
    import Standard from "$lib/z3r/logic/World/Standard";
    import Presets from '$lib/components/Presets.svelte'
    import Plant from '$lib/components/Plant.svelte';
    import Open from '$lib/z3r/logic/World/Open';
    import type { IItem } from '$lib/z3r/logic/Item';
    import type { Z3rLocation } from '$lib/z3r/logic/Location';
    import type { PageData} from './$types';
    import { checkPlants } from '$lib/z3r/logic/Logic'

    let selectedPreset: string = '';
    let world: World;
    $: selectedItems = Array() as IItem[];
    $: selectedLocations = Array() as Z3rLocation[];
    let selectedPresetData: any;
    let logicTestMessages: string[] = [];
    let logicTestResult: boolean|null;
    
    export let data: PageData;
    const presets = data.presets;


    async function presetChanged() {
        try {
            const preset_res = await fetch(`/presets/${selectedPreset}`);
            selectedPresetData = await preset_res.json();
            switch(selectedPresetData.settings.mode) {
                case 'open':
                    world = new Open(selectedPresetData.settings, logicTestMessages);
                    break;
                case 'inverted':
                    world = new Inverted(selectedPresetData.settings, logicTestMessages);
                    break;
                case 'retro':
                    world = new Retro(selectedPresetData.settings, logicTestMessages);
                    break;
                case 'standard':
                default:
                    world = new Standard(selectedPresetData.settings, logicTestMessages);
                    break;
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    function addPlant() {
        selectedItems.push({world_id:world.id, value:'', name:''});
        selectedLocations.push();
        selectedItems = selectedItems;
    }

    function removePlant(index: number) {
        selectedItems.splice(index, 1);
        selectedLocations.splice(index, 1);
        selectedItems = selectedItems;
    }

    function checkPlantsClick() {
        const {plantable, messages} = checkPlants(world, selectedItems, selectedLocations);
        logicTestResult = plantable;
        logicTestMessages = messages;
    }
</script>

<main>
    <br/>
    <Presets {presets} bind:selectedPreset='{selectedPreset}' on:change="{presetChanged}"></Presets>
    <br/><br/>
    {#if world}
        <h2>{selectedPresetData.goal_name}</h2>
        <p>{selectedPresetData.description}</p>
        <br/><br/>
        <button on:click="{addPlant}">Add Plant</button>
        {#each selectedItems as selectedItem, index }
            <br/><br/>
            <Plant bind:selectedItem="{selectedItem}" bind:selectedLocation="{selectedLocations[index]}" locations="{world.locations.to_array()}"></Plant>
            <br/>
            <button on:click="{() => removePlant(index)}">Remove Plant</button>
        {/each}
        <br/><br/>
        <button on:click="{checkPlantsClick}">Check Plants</button>
        {#if logicTestResult}✅{:else if logicTestResult == null}☑️{:else}❌{/if}
        <br/>
        <ul>
            {#each logicTestMessages as message}
                <li>{message}</li>
            {/each}
        </ul>
    {/if}
</main>
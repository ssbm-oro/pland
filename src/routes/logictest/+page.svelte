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
    import { Button, Card } from '@brainandbones/skeleton';
    import { slide } from 'svelte/transition'
    import Icon from "@iconify/svelte";

    let selectedPreset: string = 'open.json';
    let world: World;
    $: selectedItems = Array() as IItem[];
    $: selectedLocations = Array() as Z3rLocation[];
    let selectedPresetData: any;
    let logicTestMessages: string[] = [];
    let logicTestResult: boolean|null;
    
    export let data: PageData;
    const preset_names = Object.keys(data.presets).map(filepath => filepath.split('/').reverse()[0] ?? 'error');
    const presets = new Map(Object.entries(data.presets).map(entry => [entry[0].split('/').reverse()[0]!, entry[1]()]));
    const loading_message = data.loading_message;


    async function presetChanged() {
        try {
            if (presets.has(selectedPreset)) {
                selectedPresetData = await presets.get(selectedPreset) as any;
                switch(selectedPresetData.settings.mode) {
                    case 'open':
                        world = new Open(selectedPresetData.settings);
                        break;
                    case 'inverted':
                        world = new Inverted(selectedPresetData.settings);
                        break;
                    case 'retro':
                        world = new Retro(selectedPresetData.settings);
                        break;
                    case 'standard':
                    default:
                        world = new Standard(selectedPresetData.settings);
                        break;
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    function addPlant() {
        selectedItems.push({world_id:world.id, value:'', name:'Random'});
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
    presetChanged();
</script>


<svelte:head>
    <title>pland - Logic Test</title>
    <meta name="A Link to the Past Randomizer Plando Seed Rolling App Logic Test">
</svelte:head>

<h1>Select a Preset</h1>
<br/>
<Presets presets={preset_names} bind:selectedPreset='{selectedPreset}' on:change="{presetChanged}"></Presets>
<br/><br/>
{#if world}
    <Card class="overflow-auto">
        <svelte:fragment slot="header">
            <h2>{selectedPresetData.goal_name || selectedPreset}</h2>
            <p>{selectedPresetData.description || selectedPreset}</p>
            <br/><br/>
        </svelte:fragment>
        <div>
            <Button variant="ring-accent" on:click="{addPlant}">Add Plant</Button>
                {#each selectedItems as selectedItem, index }
                    <div transition:slide|local>
                        <br/><br/>
                        <Plant bind:selectedItem="{selectedItem}" 
                            bind:selectedLocation="{selectedLocations[index]}" 
                            locations="{world.locations.to_array()}" {world}>
                        </Plant>
                        <br/>
                        <Button variant="ring-warning" on:click="{() => removePlant(index)}">Remove Plant</Button>
                    </div>
                {/each}
            <br/><br/>
            <Button variant="filled-primary" on:click="{checkPlantsClick}">Check Plants</Button>
            {#if logicTestResult}✅{:else if logicTestResult == null}☑️{:else}❌{/if}
            <br/>
            <ul>
                {#each logicTestMessages as message}
                    <li>{message}</li>
                {/each}
            </ul>
        </div>
    </Card>
{:else}
    <div class="flex justify-center">
    <p>{loading_message}</p>
        <Icon icon="line-md:loading-twotone-loop" height="48" width="48" />
    </div>
{/if}
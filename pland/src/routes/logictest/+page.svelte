<script lang="ts">
    import { items } from '$lib/json/alttpr-customizer-schema.json';
    import type World from "$lib/z3r/logic/World";
    import Inverted from "$lib/z3r/logic/World/Inverted";
    import Open from "$lib/z3r/logic/World/Open";
    import Retro from "$lib/z3r/logic/World/Retro";
    import Standard from "$lib/z3r/logic/World/Standard";
    import { onMount } from "svelte";
    import Item from '$lib/z3r/logic/Item';
    import { ItemCollection } from '$lib/z3r/logic/Support/ItemCollection';
    import { LocationCollection } from '$lib/z3r/logic/Support/LocationCollection';
    import Presets from '$lib/components/Presets.svelte'
    import Plant from '$lib/components/Plant.svelte';

    let selectedPreset: string = '';
    let world: World;
    let selectedItems: any[] = [];
    let selectedLocations: any[] = [];
    let plantsModified = false;
    let selectedPresetData: any;
    let logicTestMessages: string[] = [];
    let logicTestResult: boolean|null;
    
    let presets: string[] = [];

    onMount(async () => {
        const res = await fetch(`api/presets`);
        presets = (await res.json()).data;
    });


    async function presetChanged() {
        try {
            let preset_res = await fetch(`/presets/${selectedPreset}`);
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
        selectedItems.push('');
        selectedLocations.push('');
        plantsModified = !plantsModified;
    }

    function removePlant(index: number) {
        selectedItems.splice(index, 1);
        selectedLocations.splice(index, 1);
        plantsModified = !plantsModified;
    }

    function checkPlants() {
        world.messages = logicTestMessages = [];
        try {
            let plantable = true;
            let available = new ItemCollection([
                Item.get('RescueZelda',world)!,
                Item.get('Crystal1',world)!,
                Item.get('Crystal2',world)!,
                Item.get('Crystal3',world)!,
                Item.get('Crystal4',world)!,
                Item.get('Crystal5',world)!,
                Item.get('Crystal6',world)!,
                Item.get('Crystal7',world)!,
                Item.get('PendantOfWisdom',world)!,
                Item.get('PendantOfCourage',world)!,
                Item.get('PendantOfPower',world)!,
                Item.get('DefeatAgahnim',world)!,
                Item.get('DefeatAgahnim2',world)!,
            ]);
            available.setChecksForWorld(world);
            let planted = new LocationCollection();

            items.forEach(item => {
                if (item.count && item.count > 0)
                {
                    let itemObj = Item.get(item.value, world);
                    if (!itemObj)
                        itemObj = Item.get(item.value.slice(0, -2), world);
                    
                    if (itemObj) {
                        for(let i = 0; i < item.count; i++) {
                            available.addItem(itemObj);
                        }
                    }
                }
            });

            world.resetPlants();
            
            for(let i = 0; i < selectedItems.length; i++) {
                let location = world.locations.get(selectedLocations[i].name)!;
                let item = Item.get(selectedItems[i].value.slice(0,-2), world)!;
                logicTestMessages.push(`Attempting to plant ${item.name} in ${location.name}.`);
                if (!available.has(item.name)) {
                    logicTestMessages.push(`${item.name} not available to plant.`);
                    plantable = false;
                    break;
                }
                if (location.hasItem() && !location.hasItem(item)) {
                    logicTestMessages.push(`${location.name} already has item planted: ${location.item?.name}.`);
                    plantable = false;
                    break;
                }
                available.removeItem(item);

                console.log("available before plant:");
                console.log(available);
                plantable = plantable && location.canFill(item, available, true, planted)!;
                console.log("available after plant");
                console.log(available);
                if (!plantable) {
                    logicTestMessages.push(`Could not plant ${item.name} in ${location.name}.`)
                    break;
                }
                else {
                    if (location.fill(item, available)) {
                        logicTestMessages.push(`Planted ${item.name} at ${location.name}.`)
                        planted.addItem(location);
                    }
                    else {
                        logicTestMessages.push(`Unknown error occurred. Could not Plant ${item.name} in ${location.name}.`);
                    }
                }
                // planted.addItem(item);
            }

            if (plantable) {
                planted.to_array().forEach(location => {
                    if (location.region.canEnter(world.locations, available) && location.canAccess(available) && location.item) {
                        available.addItem(location.item);
                    }
                });
                plantable &&= world.canPlaceMedallions(available);
                plantable &&= world.canPlaceBosses();
                plantable &&= world.canPlacePrizes(available);
            }

            logicTestResult = plantable;
        }
        catch (err:any) {
            logicTestMessages.push(err);
        }
    }
</script>

<main>
    <br/>
    <Presets bind:selectedPreset='{selectedPreset}' on:change="{presetChanged}"></Presets>
    <br/><br/>
    {#if world}
        <h2>{selectedPresetData.goal_name}</h2>
        <p>{selectedPresetData.description}</p>
        <br/><br/>
        <button on:click="{addPlant}">Add Plant</button>
        {#key plantsModified}{#each selectedItems as selectedItem, index }
            <br/><br/>
            <Plant bind:selectedItem="{selectedItem}" bind:selectedLocation="{selectedLocations[index]}" locations="{world.locations.to_array()}"></Plant>
            <br/>
            <button on:click="{() => removePlant(index)}">Remove Plant</button>
        {/each}{/key}
        <br/><br/>
        <button on:click="{checkPlants}">Check Plants</button>
        {#if logicTestResult}✅{:else if logicTestResult == null}☑️{:else}❌{/if}
        <br/>
        <ul>
            {#each logicTestMessages as message}
                <li>{message}</li>
            {/each}
        </ul>
    {/if}
</main>
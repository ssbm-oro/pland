<script lang="ts">
    import { locations, items } from '../../static/json/alttpr-customizer-schema.json';
    import type World from "$lib/z3r/logic/world";
    import Inverted from "$lib/z3r/logic/World/inverted";
    import Open from "$lib/z3r/logic/World/open";
    import Retro from "$lib/z3r/logic/World/retro";
    import Standard from "$lib/z3r/logic/World/standard";
    import { onMount } from "svelte";
    import Icon from '@iconify/svelte';
    import Item from '$lib/z3r/logic/item';
    import type Location from '$lib/z3r/logic/location';
    import { ItemCollection } from '$lib/z3r/logic/Support/itemcollection';
import { LocationCollection } from '$lib/z3r/logic/Support/locationcollection';

    let selectedPreset: string;
    let world: World;
    let selectedItems: any[] = [];
    let selectedLocations: any[] = [];
    let plantAdded = false;
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
        catch (err) {
            console.log(err);
        }
    }

    function addPlant() {
        selectedItems.push('');
        selectedLocations.push('');
        plantAdded = !plantAdded;
    }

    function checkPlants() {
        logicTestMessages = [];
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
        ]);
        let planted = new LocationCollection();

        items.forEach(item => {
            if (item.count && item.count > 0)
            {
                let itemObj = Item.get(item.value, world);
                if (!itemObj)
                    itemObj = Item.get(item.value.slice(0, -2), world);
                
                if (itemObj)
                    available.addItem(itemObj)
            }
        });
        
        for(let i = 0; i < selectedItems.length; i++) {
            let location = world.locations.get(selectedLocations[i].name)!;
            let item = Item.get(selectedItems[i].value.slice(0,-2), world)!;
            logicTestMessages.push(`Attempting to plant ${item.name} in ${location.name}.`);
            available.removeItem(item);

            let accessible = planted.filter(planted_location => planted_location.canAccess(available)) as Location[];
            accessible.forEach(accessible_item => {
                logicTestMessages.push(`Location: ${accessible_item.name} accessible. Item added: ${accessible_item.item?.name}`);
            })

            plantable = plantable && location.canFill(item, available, planted, true, logicTestMessages)!;
            if (!plantable) {
                logicTestMessages.push(`Could not plant ${item.name} in ${location.name}.`)
                break;
            }
            else {
                if (location.fill(item)) {
                    logicTestMessages.push(`Planted ${item.name} at ${location.name}.`)
                    planted.addItem(location);
                }
                else {
                    logicTestMessages.push(`Unknown error occurred. Could not Plant ${item.name} in ${location.name}.`);
                }
            }
            // planted.addItem(item);
        }

        logicTestResult = plantable;
    }
</script>

<main>
    <br/>
    <select bind:value="{selectedPreset}" on:change="{presetChanged}">
        {#each presets as preset}
            <option value="{preset}">{preset}</option>
        {/each}
    </select>
    <br/><br/>
    {#if world}
        <h2>{selectedPresetData.goal_name}</h2>
        <p>{selectedPresetData.description}</p>
        <br/><br/>
        <button on:click="{addPlant}">Add Plant</button>
        {#key plantAdded}{#each selectedItems as selectedItem, index }
            <br/><br/>
            <select bind:value="{selectedItem}">
                {#each items as item}
                    {#if item.count && item.count > 0}
                        <option value="{item}">{item.name}</option>
                    {/if}
                {/each}
            </select>
            {#if selectedItem && selectedItem.icon && selectedItem.icon.icon }
                <Icon icon="{selectedItem.icon.icon}" color="{selectedItem.icon.color}" vFlip="{selectedItem.icon.vFlip}" hFlip="{selectedItem.icon.hFlip}"></Icon>
            {/if}
            <br/>   
            <select bind:value="{selectedLocations[index]}">
                {#each world.locations.to_array() as location}
                    <option value="{location}">{location.name}</option>
                {/each}
            </select>
            <br/>
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
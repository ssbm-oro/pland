<script lang="ts">
    import { locations, items } from '../../static/json/alttpr-customizer-schema.json';
    import type World from "$lib/z3r/logic/world";
    import Inverted from "$lib/z3r/logic/World/inverted";
    import Open from "$lib/z3r/logic/World/open";
    import Retro from "$lib/z3r/logic/World/retro";
    import Standard from "$lib/z3r/logic/World/standard";
    import { onMount } from "svelte";
    import Icon from '@iconify/svelte';
    let selectedPreset: string;
    let world: World;
    let selectedItem: any;
    let selectedLocation: any;
    
    let presets: string[] = [];

    onMount(async () => {
        const res = await fetch(`api/presets`);
        presets = (await res.json()).data;
    });


    async function presetChanged() {
        try {
            let preset_res = await fetch(`/presets/${selectedPreset}`);
            let preset = await preset_res.json();
            switch(preset.settings.mode) {
                case 'open':
                    world = new Open(preset.settings);
                    break;
                case 'inverted':
                    world = new Inverted(preset.settings);
                    break;
                case 'retro':
                    world = new Retro(preset.settings);
                    break;
                case 'standard':
                default:
                    world = new Standard(preset.settings);
                    break;
            }
        }
        catch (err) {
            console.log(err);
        }
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
        <select bind:value="{selectedLocation}">
            {#each world.locations.to_array() as location}
                <option value="{location}">{location.name}</option>
            {/each}
        </select>
    {/if}
</main>
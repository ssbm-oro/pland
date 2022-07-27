<script lang="ts">
    import type World from "$lib/z3r/logic/world";
    import Inverted from "$lib/z3r/logic/World/inverted";
    import Open from "$lib/z3r/logic/World/open";
    import Retro from "$lib/z3r/logic/World/retro";
    import Standard from "$lib/z3r/logic/World/standard";
    import { onMount } from "svelte";
    let selectedPreset: string;
    let world:World;

    $: preset_res = fetch(new URL(`/presets/${selectedPreset}`, 'http://localhost:5173'));
    
    let presets: string[] = [];

    onMount(async () => {
        const res = await fetch(`api/presets`);
        presets = (await res.json()).data;
    });


    async function presetChanged() {
        try {
            let preset_res = await fetch(new URL(`/presets/${selectedPreset}`, 'http://localhost:5173'));
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
            console.log(world);
        }
        catch (err) {
            console.log(err);
        }
    }
</script>

<main>
    <select bind:value="{selectedPreset}" on:change="{presetChanged}">
        {#each presets as preset}
            <option value="{preset}">{preset}</option>
        {/each}
    </select>
</main>
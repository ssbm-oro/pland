<script lang="ts">
import { get_loading_message } from "$lib/utils/loadingMessages";

import { onMount } from "svelte"

let presets: string[] = [];
const loadingMessage = get_loading_message();

export let selectedPreset :string;

onMount(async () => {
	const res = await fetch(`api/presets`);
	presets = (await res.json()).data;
});

</script>

<main>
    {#if presets.length > 0}
        <select bind:value="{selectedPreset}" on:change>
            {#each presets as preset}
                <option value="{preset}">{preset}</option>
            {/each}
        </select>
    {:else}
        {loadingMessage}
    {/if}
</main>

<style>
</style>
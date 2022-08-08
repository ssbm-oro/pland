<script lang="ts">
import { onMount } from "svelte"

let presets: string[] = [];

export let selectedPreset :string;

onMount(async () => {
	const res = await fetch(`api/presets`);
	presets = (await res.json()).data;
});

</script>

<main>
	<select bind:value="{selectedPreset}" on:change>
        {#each presets as preset}
            <option value="{preset}">{preset}</option>
        {/each}
    </select>
</main>

<style>
</style>
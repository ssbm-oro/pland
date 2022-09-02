<script lang="ts">
import { get_loading_message } from "$lib/utils/loadingMessages";

export let presets: string[];
const loadingMessage = get_loading_message();

export let selectedPreset :string;

</script>

<div>
    {#if presets.length > 0}
        <select bind:value="{selectedPreset}" on:change label="Presets">
            {#each presets as preset}
                <option value="{preset}">{preset}</option>
            {/each}
        </select>
    {:else}
        {loadingMessage}
    {/if}
</div>

<style>
</style>
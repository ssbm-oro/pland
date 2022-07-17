<script lang="ts">
import AutoComplete from "simple-svelte-autocomplete";
import { onMount } from "svelte"

let presets: string[] = [];

export let selectedPreset :string;

onMount(async () => {
	const res = await fetch(`http://localhost:3000/api/presets`);
	presets = (await res.json()).data;
});

</script>

<main>
	<AutoComplete items='{presets}' bind:selectedItem='{selectedPreset}' showClear="true"></AutoComplete>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
</style>
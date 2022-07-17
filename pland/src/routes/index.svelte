<script lang="ts">
    import Plant, { type Item, type Location } from "$lib/components/Plant.svelte";
    import Presets from "$lib/components/Presets.svelte";

    let selectedPreset: string = '';
    let plant1item1: Item|null;
    let plant1location1: Location|null;
    let plant1submitted: boolean = false;
    let plant2item1: Item|null;
    let plant2location1: Location|null;
    let plant2submitted: boolean = false;

    let hash = '';

    $: readyToRoll = (selectedPreset != null) && (selectedPreset!= '') && plant1submitted && plant2submitted;

    $: if (readyToRoll) {
        if ((plant1item1 == plant2item1) || (plant1location1 == plant2location1)) {
            resetPlants();
        }
    }

    function roll(test:boolean = true) {
        const options = {
			method: 'POST'
		}
        const params = `preset=${selectedPreset}&plant1item1=${plant1item1?.value}&plant1location1=${plant1location1?.hash}&plant2item1=${plant2item1?.value}&plant2location1=${plant2location1?.hash}&test=${test}`
		fetch(`/api/roll?${params}`, options).then(async res => {
			console.log(res);
            let text = await res.text();
            hash = text;
            console.log(hash);
		}).catch(err => {
			console.error(err);
		})
    }

    function roll_click()
    {
        roll(false);
    }

    function test_click()
    {
        roll(true);
    }


function resetPlants() {
    plant1item1 = null;
    plant1location1 = null;
    plant1submitted = false;
    plant2item1 = null;
    plant2location1 = null;
    plant2submitted = false;
    readyToRoll = false;
}
</script>

<main>
    <h1>Welcome to pland</h1>

    <Presets bind:selectedPreset="{selectedPreset}"></Presets>
    <Plant bind:selectedItemValue="{plant1item1}" bind:selectedLocationValue="{plant1location1}" bind:submitted="{plant1submitted}"></Plant>
    <Plant bind:selectedItemValue="{plant2item1}" bind:selectedLocationValue="{plant2location1}" bind:submitted="{plant2submitted}"></Plant>
    {#if readyToRoll}
        {#if (hash == '')}
            <p>you wanna roll that seed? 🤠</p>
            <button on:click="{roll_click}">Roll that beautiful seed</button>
            <button on:click="{test_click}">Test those settings</button>
        {:else if (hash == 'OK')}
            <p>Sahabutt says that'll roll.</p>
            <button on:click="{roll_click}">Roll that beautiful seed</button>
        {:else}
            <a href="http://alttpr.com/en/h/{hash}">Here's that seed</a>
        {/if}
    {/if}
</main>

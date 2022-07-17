<script lang="ts">
    import Plant, { type Item, type Location } from "$lib/components/Plant.svelte";
    import Presets from "$lib/components/Presets.svelte";

    let selectedPreset: string = '';
    let plant1item1: Item|null;
    let plant1location1: Location|null;
    let plant1item2: Item|null;
    let plant1location2: Location|null;
    let plant1submitted1: boolean = false;
    let plant1submitted2: boolean = false;
    let plant2item1: Item|null;
    let plant2location1: Location|null;
    let plant2item2: Item|null;
    let plant2location2: Location|null;
    let plant2submitted1: boolean = false;
    let plant2submitted2: boolean = false;

    let hash = '';

    $: plant1submitted = plant1submitted1 && plant1submitted2;

    $: plant2submitted = plant2submitted1 && plant2submitted2;

    $: readyToRoll = (selectedPreset != null) && (selectedPreset!= '') && plant1submitted && plant2submitted;

    $: if (readyToRoll) {
        if (!validate_plants()) {
            resetPlants();
        }
    }

    /// Really naive implementation for now
    function validate_plants() {
        return !((plant1item1 == plant2item1) || (plant1item2 == plant2item1) ||
            (plant1item1 == plant2item2) || (plant1item2 == plant2item2) ||
            (plant1location1 == plant2location1) || (plant1location2 == plant2location1) ||
            (plant1location1 == plant2location2) || (plant1location2 == plant2location2));
    }

    function roll(test:boolean = true) {
        const options = {
			method: 'POST'
		}
        const params = `preset=${selectedPreset}&plant1item1=${plant1item1?.value}&plant1location1=${plant1location1?.hash}&plant1item2=${plant1item2?.value}&plant1location2=${plant1location2?.hash}&plant2item1=${plant2item1?.value}&plant2location1=${plant2location1?.hash}&plant2item1=${plant2item2?.value}&plant2location1=${plant2location2?.hash}&test=${test}`
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
    <h2>Player 1</h2>
    <Plant bind:selectedItemValue="{plant1item1}" bind:selectedLocationValue="{plant1location1}" bind:submitted="{plant1submitted1}"></Plant>
    <Plant bind:selectedItemValue="{plant1item2}" bind:selectedLocationValue="{plant1location2}" bind:submitted="{plant1submitted2}"></Plant>
    <h2>Player 2</h2>
    <Plant bind:selectedItemValue="{plant2item1}" bind:selectedLocationValue="{plant2location1}" bind:submitted="{plant2submitted1}"></Plant>
    <Plant bind:selectedItemValue="{plant2item2}" bind:selectedLocationValue="{plant2location2}" bind:submitted="{plant2submitted2}"></Plant>
    {#if readyToRoll}
        {#if (hash == '')}
            <p>you wanna roll that seed? 🤠</p>
            <button on:click="{roll_click}">Roll that beautiful seed ✨</button>
            <button on:click="{test_click}">Test those settings 🧪</button>
        {:else if (hash == 'OK')}
            <p>Sahabutt🤖 says that'll roll. 🙄</p>
            <button on:click="{roll_click}">Roll that beautiful seed ✨</button>
        {:else}
            <a href="http://alttpr.com/en/h/{hash}">Here's that seed you wanted</a>
        {/if}
    {:else}
        <p>hurry up i wanna roll 🥵🥵🥵🥵🥵</p>
    {/if}
</main>

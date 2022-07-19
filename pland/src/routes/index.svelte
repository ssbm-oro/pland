<script lang="ts">
    import Plant from "$lib/components/Plant.svelte";
    import type { PlantData } from "$lib/components/Plant.svelte";
    import Presets from "$lib/components/Presets.svelte";
	import { UserStore } from '$lib/stores';
    import { deleteSession } from '$lib/utils/sessionHandler';
    import { session } from "$app/stores";
    import { goto } from "$app/navigation";

    let selectedPreset: string = '';
    let plant1: PlantData;
    let plant2: PlantData;
    let plant3: PlantData;
    let plant4: PlantData;

    let hash = '';

    $: plant1submitted = plant1?.submitted && plant2?.submitted;

    $: plant2submitted = plant3?.submitted && plant4?.submitted;

    $: readyToRoll = (selectedPreset != null) && (selectedPreset!= '') && plant1submitted && plant2submitted;

    $: if (readyToRoll) {
        if (!validate_plants()) {
            resetPlants();
        }
    }

    /// Really naive implementation for now
    function validate_plants() {
        return !((plant1?.item == plant3?.item) || (plant2?.item == plant3?.item) ||
            (plant1?.item == plant4?.item) || (plant2?.item == plant4?.item) ||
            (plant1?.location == plant3?.location) || (plant2?.location == plant3?.location) ||
            (plant1?.location == plant4?.location) || (plant2?.location == plant4?.location));
    }

    function roll(test:boolean = true) {
        const options = {
			method: 'POST'
		}
        const params = `preset=${selectedPreset}&plant1item1=${plant1?.item?.value}&plant1location1=${plant1?.location?.hash}&plant1item2=${plant2?.item?.value}&plant1location2=${plant2?.location?.hash}&plant2item1=${plant3?.item?.value}&plant2location1=${plant3?.location?.hash}&plant2item1=${plant4?.item?.value}&plant2location1=${plant4?.location?.hash}&test=${test}`
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
        plant1.item = null;
        plant1.location = null;
        plant1.submitted = false;
        plant2.item = null;
        plant2.location = null;
        plant2.submitted = false;
        plant3.item = null;
        plant3.location = null;
        plant3.submitted = false;
        plant4.item = null;
        plant4.location = null;
        plant4.submitted = false;
        readyToRoll = false;
    }

    async function logout() {
        await fetch('/api/user/logout', {
            method: 'POST',
            body: JSON.stringify({})
        });

        window.location.href = '/';
    }

    //const redirect_uri =  encodeURIComponent(process.env.DISCORD_REDIRECT_URI!);
</script>

<main>
    <h1>Welcome to pland</h1>
    
    {#if !$UserStore}
        <button on:click={() => (window.location.href = "https://discord.com/api/oauth2/authorize?client_id=992309099272339546&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fapi%2Fuser%2Fauth&response_type=code&scope=identify%20guilds")}> <!--`https://discord.com/api/oauth2/authorize?client_id=992309099272339546&redirect_uri=${redirect_uri}&response_type=code&scope=identify%20guilds`)}>-->
            Login with Discord</button>
    {:else}
            <h2>You are {$UserStore.username}</h2>
            <button on:click='{logout}'>Sign out</button>


        <Presets bind:selectedPreset="{selectedPreset}"></Presets>
        <h2>Player 1</h2>
        <Plant bind:selectedPlant="{plant1}"></Plant>
        <Plant bind:selectedPlant="{plant2}"></Plant>
        <h2>Player 2</h2>
        <Plant bind:selectedPlant="{plant3}"></Plant>
        <Plant bind:selectedPlant="{plant4}"></Plant>
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
    {/if}
</main>

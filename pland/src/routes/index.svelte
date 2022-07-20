<script lang="ts">
    import Plant from "$lib/components/Plant.svelte";
    import type { PlantData } from "$lib/components/Plant.svelte";
    import Presets from "$lib/components/Presets.svelte";
	import { UserStore } from '$lib/stores';
    import log from 'loglevel';
    import { get_loading_message } from '$lib/utils/loadingMessages'

    let selectedPreset: string = '';
    let plant1: PlantData;
    let plant2: PlantData;
    let plant3: PlantData;
    let plant4: PlantData;

    let hash = '';
    let message = '';

    $: plant1submitted = plant1?.submitted && plant2?.submitted;

    $: plant2submitted = plant3?.submitted && plant4?.submitted;

    $: readyToRoll = (selectedPreset != null) && (selectedPreset!= '') && plant1submitted && plant2submitted;

    $: if (readyToRoll) {
        if (!validate_plants()) {
            resetPlants();
        }
    }

    let rolling = false;
    let loading_message = '';

    /// Really naive implementation for now
    function validate_plants() {
        return !((plant1?.item == plant3?.item) || (plant2?.item == plant3?.item) ||
            (plant1?.item == plant4?.item) || (plant2?.item == plant4?.item) ||
            (plant1?.location == plant3?.location) || (plant2?.location == plant3?.location) ||
            (plant1?.location == plant4?.location) || (plant2?.location == plant4?.location));
    }

    function roll(test:boolean = true) {
        rolling = true;
        loading_message = get_loading_message();
        message = '';
        
        const options = {
			method: 'POST',
            body: new URLSearchParams({
                preset: selectedPreset,
                plant1item1: plant1.item?.value!,
                plant1location1: plant1.location?.hash!,
                plant1item2: plant2.item?.value!,
                plant1location2: plant2.location?.hash!,
                plant2item1: plant3.item?.value!,
                plant2location1: plant3.location?.hash!,
                plant2item2: plant4.item?.value!,
                plant2location2: plant4.location?.hash!,
                test: test.toString()
            })
		}

		fetch(`/api/roll`, options).then(async res => {
			log.debug(res);
            if (res.ok) {
                hash = await res.text();
                log.debug(hash);
            }
            else {
                hash = ''
                message = await res.text();
            }
		}).catch(err => {
			log.error(err);
		}).finally(() => {
            rolling = false;
            loading_message = '';
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

    const discord_avatar_uri = `https://cdn.discordapp.com/avatars/$userid/$useravatar.png`
</script>

<main>
    <h1>Welcome to pland</h1>
    
    {#if !$UserStore}
        <p>Please log in if you wanna do anything 🔐</p>
    {:else}
        <h2>You are {$UserStore.username}</h2>
        <img src='{discord_avatar_uri.replace('$userid', $UserStore.id).replace('$useravatar',$UserStore.avatar)}' alt="{$UserStore.username}'s avatar"/>


        <Presets bind:selectedPreset="{selectedPreset}"></Presets>
        <h2>Player 1</h2>
        <Plant bind:selectedPlant="{plant1}"></Plant>
        <Plant bind:selectedPlant="{plant2}"></Plant>
        <h2>Player 2</h2>
        <Plant bind:selectedPlant="{plant3}"></Plant>
        <Plant bind:selectedPlant="{plant4}"></Plant>
        {#if rolling}
            <p>🤔 {loading_message}</p>
        {:else}
            {#if readyToRoll}
                {#if message != ''}
                    <p>😰 the seed didn't roll - {message}</p>
                {/if}
                {#if (hash == '')}
                    <p>you wanna roll that seed? 🤠</p>
                    <button on:click="{roll_click}">Roll that beautiful seed ✨</button>
                    <button on:click="{test_click}">Test those settings 🧪</button>
                {:else if (hash == 'OK')}
                    <p>Sahabutt🤖 says that'll roll. 🙄</p>
                    <button on:click="{roll_click}">Roll that beautiful seed ✨</button>
                    <button on:click="{test_click}">Test those settings again! 🧪</button>
                {:else}
                    <a href="http://alttpr.com/en/h/{hash}">Here's that seed you wanted</a>
                {/if}
            {:else}
                <p>hurry up i wanna roll 🥵🥵🥵🥵🥵</p>
            {/if}
        {/if}
    {/if}
</main>

<script lang="ts">
    import type Plant from "$lib/components/Plant.svelte";
    import type PlantData from "$lib/components/Plant.svelte";
    import Presets from "$lib/components/Presets.svelte";
    import log from 'loglevel';
    import { get_loading_message } from '$lib/utils/loadingMessages'
    import type { PageData } from './$types'


    export let data: PageData;
    $: user = data.user;

    let selectedPreset: string = '';
    let plant1data: PlantData;
    let plant2data: PlantData;
    let plant3data: PlantData;
    let plant4data: PlantData;
    let plant1: Plant;
    let plant2: Plant;
    let plant3: Plant;
    let plant4: Plant;

    let hash = '';
    let message = '';

    $: plant1submitted = plant1data?.submitted && plant2data?.submitted;

    $: plant2submitted = plant3data?.submitted && plant4data?.submitted;

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
        return !((plant1data?.item == plant3data?.item) || (plant2data?.item == plant3data?.item) ||
            (plant1data?.item == plant4data?.item) || (plant2data?.item == plant4data?.item) ||
            (plant1data?.location == plant3data?.location) || (plant2data?.location == plant3data?.location) ||
            (plant1data?.location == plant4data?.location) || (plant2data?.location == plant4data?.location));
    }

    function roll(test:boolean = true) {
        rolling = true;
        loading_message = get_loading_message();
        message = '';

        const options = {
			method: 'POST',
            body: new URLSearchParams({
                preset: 'open.json',
                plant1item1: 'test1',
                plant1location1: 'test1',
                plant1item2: 'test1',
                plant1location2: 'test1',
                plant2item1: 'test1',
                plant2location1: 'test1',
                plant2item2: 'taest1',
                plant2location2: 'test1',
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


    let reset_toggle = true;
    function resetPlants() {
        reset_toggle = !reset_toggle;
        plant1data.submitted = false;
        plant2data.submitted = false;
        plant3data.submitted = false;
        plant4data.submitted = false;
    }

    const discord_avatar_uri = `https://cdn.discordapp.com/avatars/$userid/$useravatar.png`
</script>

<main>
    <h1>Welcome to pland</h1>
    
    {#if !user}
        <p>Please log in if you wanna roll seeds. 🔐</p>
        <p>You can help me <a href="/logictest">test the logic</a> without logging in if you want.</p>
    {:else}
        <h2>You are {user.username}</h2>
        {#if user.avatar}
            <img src='{discord_avatar_uri.replace('$userid', user.id).replace('$useravatar',user.avatar)}' alt="{user.username}'s avatar"/>
        {/if}

        <!-- <Presets bind:selectedPreset="{selectedPreset}" on:onChange={resetPlants}></Presets>
        {#key reset_toggle}
            <h2>Player 1</h2>
            <Plant bind:this="{plant1}" bind:selectedPlant="{plant1data}"></Plant>
            <Plant bind:this="{plant2}" bind:selectedPlant="{plant2data}"></Plant>
            <h2>Player 2</h2>
            <Plant bind:this="{plant3}" bind:selectedPlant="{plant3data}"></Plant>
            <Plant bind:this="{plant4}" bind:selectedPlant="{plant4data}"></Plant>
        {/key}
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
        {/if} -->
    {/if}
</main>

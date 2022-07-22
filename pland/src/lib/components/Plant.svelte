<script lang="ts" context="module">
    import { locations, items } from '../../../static/json/alttpr-customizer-schema.json';
    export interface Item {
        value: string;
        name: string;
        placed: number;
        count: number;
    }

    export interface Location {
        hash: string;
        name: string;
        region: string;
        class: string;
    }

    export interface PlantData {
        item: Item|null;
        location: Location|null;
        submitted: boolean;
    }
</script>

<script lang="ts">
    import AutoComplete from 'simple-svelte-autocomplete';

    let itemAutoComplete: { "": any; };
    let locationAutoComplete;

    let placeableItems = items.filter(item => ((item.count) && item.count > 0));
    export let selectedPlant: PlantData = {
        item: { value: '', name: '', placed: 0, count: 0  },
        location: { hash: '', name: '', region: '', class: '' },
        submitted: false
    }

    const itemLabelFunc = function(item:Item|null) {
        if (item) {
            return item.name.slice(5) + ' ' + item.placed + '/' + item.count;
        }
        return '';
    }

    const locationLabelFunc = function(location:Location|null) {
        if (location) {
            return location.name;
        }
        return '';
    }

    const onChange = function()
    {
        if ((selectedPlant.item != null) && (selectedPlant.location != null) &&
            (selectedPlant.item.name != '') && (selectedPlant.location.hash != '')) {
            selectedPlant.submitted = true;
        }
        else {
            selectedPlant.submitted = false;
        }
    }

    export function reset() {
        selectedPlant = {
            item: { value: '', name: '', placed: 0, count: 0  },
            location: { hash: '', name: '', region: '', class: '' },
            submitted: false
        }
    }
</script>

<main>
    Item <AutoComplete bind:this="{itemAutoComplete}" items="{placeableItems}" bind:value="{selectedPlant.item}" labelFunction="{itemLabelFunc}" onChange="{onChange}" lock="true"></AutoComplete><br/>
    Location <AutoComplete bind:this="{locationAutoComplete}" items = "{locations}" bind:value="{selectedPlant.location}" labelFunction="{locationLabelFunc}" onChange="{onChange}" lock="true"></AutoComplete><br/>
    {#if selectedPlant.submitted}✅{:else}☑️{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
</style>
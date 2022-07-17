<script lang="ts" context="module">
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
</script>

<script lang="ts">
    import { locations, items } from '../../../static/json/alttpr-customizer-schema.json';
    import AutoComplete from 'simple-svelte-autocomplete';

    let placeableItems = items.filter(item => ((item.count) && item.count > 0));
    let selectedItem:string;
    let selectedLocation:string;
    export let selectedItemValue:Item|null;
    export let selectedLocationValue:Location|null;
    export let submitted = false;

    function submit(){
        if (selectedItem != null && selectedLocation != null) {
            submitted = true;
        }
    }

    function reset() {
        selectedItem = '';
        selectedItemValue = null;
        selectedLocation = '';
        selectedLocationValue = null;
        submitted = false;
    }

    const itemLabelFunc = function(item:Item) {
        return item.name.slice(5) + ' ' + item.placed + '/' + item.count;
    }

    const locationLabelFunc = function(location:Location) {
        return location.name;
    }

    const onChange = function()
    {
        if ((selectedItemValue != null) && (selectedLocationValue != null)) {
            submitted = true;
        }
        else {
            submitted = false;
        }
    }

</script>

<main>
    <AutoComplete items = "{placeableItems}" bind:value="{selectedItemValue}" bind:selectedItem="{selectedItem}" labelFunction="{itemLabelFunc}" onChange="{onChange}" showClear="true"></AutoComplete>
    <AutoComplete items = "{locations}" bind:value="{selectedLocationValue}" bind:selectedItem="{selectedLocation}" labelFunction="{locationLabelFunc}" onChange="{onChange}" showClear="true"></AutoComplete>
    {#if submitted}✅{:else}☑️{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
</style>
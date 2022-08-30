<script lang="ts">
    import { Card, List, ListItem, Button } from '@brainandbones/skeleton';
    import { writable, type Writable } from 'svelte/store';
    import type { ILocation } from '$lib/z3r/logic/Location';
    import type { SelectedItem } from './ComponentInterfaces';
    import type World from '$lib/z3r/logic/World';
    import Item from '$lib/z3r/logic/Item';
    import { items } from '$lib/data/json/alttpr-customizer-schema.json';
    import { ItemCollection } from '$lib/z3r/logic/Support/ItemCollection';
    import { onMount } from 'svelte';
    import { blur, crossfade } from 'svelte/transition'
import { quintOut } from 'svelte/easing';

    let available: ItemCollection;

    export let locations: ILocation[];
    locations.push({name:'Random',item:null,isCrystalPendant:false});

    export let Location: ILocation;

    export let selectedItem :SelectedItem;
    export let world: World;

    let selectedLocation:Writable<string> = writable(Location ? Location.name: 'Random');
    $: Location = locations.filter(location => location.name === $selectedLocation)[0]!;
    export let disabled:boolean = false;

    $: search = undefined as string | undefined;
    $: locationsFiltered = locations.filter(location => filterLocationsByItem(location, selectedItem)).filter(location => location.name.toLowerCase().includes(search ? search.toLowerCase(): ''))

    function filterLocationsByItem(location: ILocation, item: SelectedItem) {
        if ((available && item && item.name != "Random") && (location.name != "Random")) {
            const z3rLocation = world.locations.get(location.name);
            const z3rItem = Item.get(item.name, world);
            if (z3rLocation && z3rItem) {
                available.removeItem(z3rItem);
                let plantable = z3rLocation.canFill(z3rItem, available, true)
                available.addItem(z3rItem);
                return plantable;
            }
        }
        return true;
    }

    export function changeSelection() {
        $selectedLocation = 'Random'
    }

    onMount(() => {
        available = new ItemCollection([
            Item.get('RescueZelda',world)!,
            Item.get('Crystal1',world)!,
            Item.get('Crystal2',world)!,
            Item.get('Crystal3',world)!,
            Item.get('Crystal4',world)!,
            Item.get('Crystal5',world)!,
            Item.get('Crystal6',world)!,
            Item.get('Crystal7',world)!,
            Item.get('PendantOfWisdom',world)!,
            Item.get('PendantOfCourage',world)!,
            Item.get('PendantOfPower',world)!,
            Item.get('DefeatAgahnim',world)!,
            Item.get('DefeatAgahnim2',world)!,
        ]);
        items.forEach(item => {
            if (item.count && item.count > 0) {
                let itemObj = Item.get(item.value, world);
                if (!itemObj)
                    itemObj = Item.get(item.value.slice(0, -2), world);
                
                if (itemObj) {
                    for(let i = 0; i < item.count; i++) {
                        available.addItem(itemObj);
                    }
                }
            }
        });
    })

    // Selects the top location from the list when the enter button is pressed
    // in the search box
    function selectOnEnter(event: KeyboardEvent) {
        if (event.isTrusted && event.key == "Enter" && locationsFiltered[0]) {
            $selectedLocation = locationsFiltered[0].name;
        }
    }

    const [send, receive] = crossfade({
		duration:300,
        easing:quintOut,
        delay:100
	});
</script>

<main>
    <Card>
        {#if disabled || $selectedLocation != 'Random' }
            <div out:receive={{key:"ItemList"}} in:blur={{delay:200, duration:200}}>
                <Button variant="ring-primary" on:click={changeSelection} {disabled}>
                    {Location.name}
                </Button>
            </div>
        {:else}
            <div in:send={{key:"ItemList"}} out:blur={{duration:300}}>
                <input type="search" placeholder="Select a location..." bind:value={search} on:keypress={selectOnEnter}>
                <List tag="nav" selected={selectedLocation} class="max-h-96 overflow-auto">
                    {#each locationsFiltered as location }
                        <div class="max-w-xs">
                            <ListItem class="flex flex-wrap" value={location.name}>{location.name}</ListItem>
                        </div>
                    {/each}
                </List>
            </div>
        {/if}
    </Card>
</main>

<style>
</style>
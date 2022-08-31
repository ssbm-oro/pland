<script lang="ts">
    import { Card, List, ListItem, Button, Tooltip } from '@brainandbones/skeleton';
    import { writable, type Writable } from 'svelte/store';
    import type { ILocation } from '$lib/z3r/logic/Location';
    import type { SelectedItem } from './ComponentInterfaces';
    import type World from '$lib/z3r/logic/World';
    import Item from '$lib/z3r/logic/Item';
    import { items, locations as default_locations } from '$lib/data/json/alttpr-customizer-schema.json';
    import { ItemCollection } from '$lib/z3r/logic/Support/ItemCollection';
    import { onMount } from 'svelte';
    import { blur, crossfade } from 'svelte/transition'
    import { quintOut } from 'svelte/easing';

    let available: ItemCollection;
    export let hideBorder = false;

    export let locations: ILocation[];
    $: locationImages = new Map(default_locations.map(location => [location.name.slice(0,-2), location.image]));
    locations.push({name:'Random',item:null,isCrystalPendant:false, class:"events"});

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

    export async function changeSelection() {
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
        
    function getImageUrl(name:string) {
        return new URL(`./${name}`, import.meta.url).href
    }

    $: cardClass = hideBorder ? "max-w-prose border border-solid border-accent-500" : "max-w-prose border-none";
</script>

<Card class={cardClass}>
    {#if disabled || $selectedLocation != 'Random' }
        <div out:receive|local={{key:"ItemList"}} in:blur|local={{delay:200, duration:200}}>
            <Button variant="ring-primary" on:click={changeSelection} {disabled}>
                {Location.name}
                <svelte:fragment slot="lead">
                    <img src={getImageUrl(locationImages.get(Location.name) || '')} class="overflow-visible" alt="Screenshot of {Location.name}" height="48" width="48">
                </svelte:fragment>
            </Button>
        </div>
    {:else}
        <div in:send|local={{key:"ItemList"}} out:blur|local={{duration:300}}>
            <input type="search" placeholder="Select a location..." bind:value={search} on:keypress={selectOnEnter}>
            <List tag="nav" selected={selectedLocation}>
                <div class="max-h-96 overflow-y-scroll">
                {#each locationsFiltered as location, i }
                    {#if location.class == 'items'}
                        <ListItem class="justify-start" value={location.name} tabindex={i}>
                            <span class="whitespace-normal">{location.name}</span>
                            <svelte:fragment slot="lead">
                                <Tooltip position="right">
                                    <svelte:fragment slot="message">
                                        <div class="w-[200px] h-[200px]">
                                            <img src={getImageUrl(locationImages.get(location.name) || '')} alt="Screenshot of {location.name}">
                                        </div>
                                    </svelte:fragment>
                                    <svelte:fragment slot="content">
                                        <img src={getImageUrl(locationImages.get(location.name) || '')} class="overflow-visible" alt="Screenshot of {location.name}" height="48" width="48">
                                    </svelte:fragment>
                                </Tooltip>
                            </svelte:fragment>
                        </ListItem>
                    {/if}
                {/each}
                </div>
            </List>
        </div>
    {/if}
</Card>
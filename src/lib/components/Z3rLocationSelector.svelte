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
    const locationImages = new Map(default_locations.map(location => [location.name.slice(0,-2), location.image]));
    const locationTags = new Map(default_locations.map(location => [location.name.slice(0,-2), location.tags]))
    locations.push({name:'Random',item:null,isCrystalPendant:false, class:"events"});

    export let Location: ILocation;

    export let selectedItem :SelectedItem;
    export let world: World;

    let selectedLocation:Writable<string> = writable(Location ? Location.name: 'Random');
    $: Location = locations.filter(location => location.name === $selectedLocation)[0]!;
    export let disabled:boolean = false;

    $: search = undefined as string | undefined;
    $: locationsFiltered = locations.filter(location => filterLocationsByItem(location, selectedItem)).filter(location => filterLocationsBySearch(location, search))

    function filterLocationsBySearch(location: ILocation, search: string | undefined) {
        if (search) {
            const locationTokens: string[] = location.name.split(/[ ,-]+/).map(s => s.toLowerCase());
            if (locationTags.has(location.name)) {
                locationTokens.push(...locationTags.get(location.name) || []);
            }
            const searchTokens = search.split(/[ ,-]+/).map(s => s.toLowerCase());
            return searchTokens.every(searchToken => locationTokens.some(locationToken => locationToken.includes(searchToken)));
        }
        return true;
    }

    function filterLocationsByItem(location: ILocation, item: SelectedItem) {
        if ((available && item && item.name != "Random") && (location.name != "Random")) {
            const z3rLocation = world.locations.get(location.name);
            const z3rItem = Item.get(item.name, world.id);
            if (z3rLocation && z3rItem) {
                available.removeItem(z3rItem);
                let plantable = true;
                try {
                    plantable = z3rLocation.canFill(z3rItem, available, true)
                } catch {
                    plantable = false;
                }
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
            Item.get('RescueZelda',world.id)!,
            Item.get('Crystal1',world.id)!,
            Item.get('Crystal2',world.id)!,
            Item.get('Crystal3',world.id)!,
            Item.get('Crystal4',world.id)!,
            Item.get('Crystal5',world.id)!,
            Item.get('Crystal6',world.id)!,
            Item.get('Crystal7',world.id)!,
            Item.get('PendantOfWisdom',world.id)!,
            Item.get('PendantOfCourage',world.id)!,
            Item.get('PendantOfPower',world.id)!,
            Item.get('DefeatAgahnim2',world.id)!,
        ]);
        items.forEach(item => {
            if (item.count && item.count > 0) {
                let itemObj = Item.get(item.value, world.id);
                if (!itemObj)
                    itemObj = Item.get(item.value.slice(0, -2), world.id);
                
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

    export let selected = false;
    $: selected = (!!Location && Location.name != "Random")
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
                        <div class="group">
                            <ListItem class="justify-start" value={location.name} tabindex={i}>
                                <span class="whitespace-normal">{location.name}</span>
                                <svelte:fragment slot="lead">
                                    <Tooltip position="right" background="bg-surface-100 dark:bg-surface-900" color="black dark:white">
                                        <svelte:fragment slot="message">
                                            <div class="w-[200px] h-[200px] text-center whitespace-normal">
                                                <img src={getImageUrl(locationImages.get(location.name) || '')} alt="Screenshot of {location.name}">
                                                {location.name}
                                            </div>
                                        </svelte:fragment>
                                        <svelte:fragment slot="content">
                                            <img src={getImageUrl(locationImages.get(location.name) || '')} class="overflow-visible transition-transform group-hover:scale-125" alt="Screenshot of {location.name}" height="48" width="48">
                                        </svelte:fragment>
                                    </Tooltip>
                                </svelte:fragment>
                            </ListItem>
                        </div>
                    {/if}
                {/each}
                </div>
            </List>
        </div>
    {/if}
</Card>
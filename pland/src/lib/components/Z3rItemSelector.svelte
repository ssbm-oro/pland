<script lang="ts">
    import Icon from '@iconify/svelte';
    import { items } from '$lib/data/json/alttpr-customizer-schema.json';
    import type { SelectedItem } from './ComponentInterfaces';
    import { Card, List, ListItem, Button } from '@brainandbones/skeleton';
    import { writable, type Writable } from 'svelte/store';
    import { blur, crossfade } from 'svelte/transition'

    export let Item: SelectedItem;
    const selectedItem:Writable<string> = writable(Item ? Item.name : items[0]!.name);
    $: Item = items.filter(item => item.name === $selectedItem)[0] as SelectedItem;
    export let disabled:boolean = false;

    $: search = undefined as string | undefined;
    $: itemsFiltered = items.filter(item => item.count && item.count > 0).filter(item => item.name.toLowerCase().includes(search ? search.toLowerCase(): ''))

    export function changeSelection() {
        $selectedItem = items[0]!.name;
    }

    // Selects the top item from the list when the enter button is pressed
    // in the search box
    function selectOnEnter(event: KeyboardEvent) {
        if (event.isTrusted && event.key == "Enter" && itemsFiltered[0]) {
            $selectedItem = itemsFiltered[0].name;
        }
    }
    
    const [send, receive] = crossfade({
		duration:300,
        delay:100
	});
    let scale=8;
</script>

<main>
    <Card>
        {#if disabled || Item && Item.name != "Random"}
            <div out:receive={{key:"ItemList"}} in:blur={{delay:200, duration:200}}>
                <Button variant="ring-primary" on:click={changeSelection} {disabled}>
                    <svelte:fragment slot="lead">
                        <Icon icon={Item.icon?.icon} color={Item.icon?.color} hFlip={Item.icon?.hFlip} vFlip={Item.icon?.vFlip} width="{3*scale}" height="{3*scale}"></Icon>
                    </svelte:fragment>
                    {$selectedItem}
                </Button>
            </div> 
        {:else}
        <div in:send={{key:"ItemList"}} out:blur={{duration:300}}>
        <input type="search" placeholder="Select an item..." bind:value={search} on:keypress={selectOnEnter}>
            <List tag="nav" selected={selectedItem} class="max-h-96 overflow-y-auto">
                {#each itemsFiltered as item (item.value)}
                    <div>
                        <ListItem value={item.name}>
                            <svelte:fragment slot="lead">
                                <Icon icon={item.icon?.icon} color={item.icon?.color} hFlip={item.icon?.hFlip} vFlip={item.icon?.vFlip} width={6*scale} height={6*scale}></Icon>
                            </svelte:fragment>
                            {item.name}
                        </ListItem>
                    </div>
                {/each}
            </List>
        </div>
        {/if}
    </Card>
</main>

<style>
</style>
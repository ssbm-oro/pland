<script lang="ts">
    import Icon from '@iconify/svelte';
    import { items } from '$lib/data/json/alttpr-customizer-schema.json';
    import type { SelectedItem } from './ComponentInterfaces';
    import { Card, List, ListItem, Button } from '@brainandbones/skeleton';
    import { writable, type Writable } from 'svelte/store';
    import { blur, crossfade } from 'svelte/transition'
    import { BottleContents } from '$lib/z3r/logic/Item';


    export let Item: SelectedItem;
    const selectedItem:Writable<string> = writable(Item ? Item.name : items[0]!.name);
    $: Item = items.filter(item => item.name === $selectedItem)[0] as SelectedItem;
    export let disabled:boolean = false;

    $: search = undefined as string | undefined;
    $: itemsFiltered = items.filter(item => item.count && item.count > 0).filter(item => item.name.toLowerCase().includes(search ? search.toLowerCase(): ''))

    export function changeSelection() {
        $selectedItem = items[0]!.name;
        $selectedBottle = 'unselected';
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
    const scale=8;

    export let Bottle: string | undefined;
    const selectedBottle: Writable<string> = writable(Bottle || 'unselected');
    $: Bottle = $selectedBottle;
    let bottleDetails = BottleContents.random;
    $: switch(Bottle) {
        case 'random':
            bottleDetails = BottleContents.random;
            break;
        case 'none':
            bottleDetails = BottleContents.empty;
            break;
        case 'red':
            bottleDetails = BottleContents.red;
            break;
        case 'green':
            bottleDetails = BottleContents.green;
            break;
        case 'blue':
            bottleDetails = BottleContents.blue;
            break;
        case 'fairy':      
        bottleDetails = BottleContents.fairy
            break;
        case 'bee':
            bottleDetails = BottleContents.bee
            break;
        case 'goodbee':
            bottleDetails = BottleContents.goodbee
            break;
    }
</script>

<Card>
    {#if disabled || Item && Item.name != "Random"}
        {#if Item && !Item.name.toLowerCase().includes('bottle')}
            <div out:receive={{key:"ItemList"}} in:blur={{delay:200, duration:200}}>
                <Button variant="ring-primary" on:click={changeSelection} {disabled}>
                    <svelte:fragment slot="lead">
                        <Icon icon={Item.icon?.icon} color={Item.icon?.color} hFlip={Item.icon?.hFlip} width="{3*scale}" height="{3*scale}"></Icon>
                    </svelte:fragment>
                    {$selectedItem}
                </Button>
            </div>
            {:else}
                {#if Bottle != "unselected"}
                    <div out:receive={{key:"BottleList"}} in:blur={{delay:200, duration:200}}>
                        <Button variant="ring-primary" on:click={changeSelection} {disabled}>
                            <svelte:fragment slot="lead">
                                <Icon icon={bottleDetails.icon} color={bottleDetails.color} width="{3*scale}" height="{3*scale}"></Icon>
                            </svelte:fragment>
                            {bottleDetails.name}
                        </Button>
                    </div>
                {:else}
                    <div in:send={{key:"BottleList"}} out:blur={{duration:300}}>
                        <List tag="nav" selected={selectedBottle} class="max-h-[420px] overflow-y-auto">
                            {#each Object.entries(BottleContents) as contents}
                                {@const content = contents[1]}
                                <ListItem value={content.value}>
                                    <svelte:fragment slot="lead">
                                        <Icon icon={content.icon} color={content.color} width={6*scale} height={6*scale}></Icon>
                                    </svelte:fragment>
                                    {contents[1].name}
                                </ListItem>
                            {/each}
                            <div class="hidden"><ListItem value="unselected">Unselected</ListItem></div>
                        </List>
                    </div>
                {/if}
        {/if}
    {:else}
    <div in:send={{key:"ItemList"}} out:blur={{duration:300}}>
    <input type="search" placeholder="Select an item..." bind:value={search} on:keypress={selectOnEnter}>
        <List tag="nav" selected={selectedItem} class="max-h-96 overflow-y-auto">
            {#each itemsFiltered as item (item.value)}
                <div>
                    <ListItem value={item.name}>
                        <svelte:fragment slot="lead">
                            <Icon icon={item.icon?.icon} color={item.icon?.color} hFlip={item.icon?.hFlip} width={6*scale} height={6*scale}></Icon>
                        </svelte:fragment>
                        {item.name}
                    </ListItem>
                </div>
            {/each}
        </List>
    </div>
    {/if}
</Card>

<style>
</style>
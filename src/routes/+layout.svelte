<script lang="ts">
	import "../theme.postcss";
	import "../app.postcss";
    import { onMount, onDestroy } from 'svelte';
    import Icon from '@iconify/svelte';
    import type { LayoutData } from './$types';
	import { Button, LightSwitch, Menu, Card, Drawer, Divider, List, ListItem, GradientHeading } from '@brainandbones/skeleton';
	import { writable } from "svelte/store";
	import DiscordAvatar from "$lib/components/DiscordAvatar.svelte";
	import { invalidateAll } from "$app/navigation";
    import { discord_login_uri } from '$lib/Discord/DiscordClient'
	import { page } from '$app/stores'

    export let data: LayoutData;
    $: user = data.user;

    let intervalId: NodeJS.Timer;

	const drawer = writable(false)

    onMount(async () => {
		const res = await fetch('/api/user/validateSession', { method: 'POST' });

        if (res.status == 200)
        {
			// refresh the user's token every 5 minutes while they are still using the app
			intervalId = setInterval(async () => await fetch('/api/user/refreshSession', {method: 'POST'}), 1000 * 60 * 5);
        }

		return {
			props: {}
		};
	});

    onDestroy(() => {
		clearInterval(intervalId);
	});

    async function logout() {
		await fetch('/api/user/logout', {method: 'POST' });
		await invalidateAll();
	}
</script>

<svelte:head>
	<meta property="og:type" content="pland">
	<meta property="og:url" content={$page.url.toString()}>
	<meta property="og:title" content="pland | A Link to the Past Plandomizer">
	<meta property="og:description" content={`pland is a tool for creating ALTTPR plando seeds,
		a competitive mode for ALTTPR where players have the option to secretly plant several
		items before the seed is randomized.`}>
	<meta property="og:image" content={`${$page.url.origin}/poster.png`}>
</svelte:head>

<main>
	<Drawer visible={drawer} fixed="left">

	<svelte:fragment slot="header">
		<div class="fixed top-0 left-0 right-0 bg-surface-50 dark:bg-surface-900 z-10">
			<div class="grid grid-flow-col grid-cols-3 p-1.5">
				<div class="p"><a href="/"><GradientHeading tag="h3">pland</GradientHeading></a></div>
				<div class="grid grid-row-1 content-center justify-center"><LightSwitch /></div>
				<div class="grid grid-row-1 justify-end">
				{#if !user}
					<Button size="sm" variant="ring-accent" on:click="{() => (window.location.href = discord_login_uri)}">
						<svelte:fragment slot="lead"><Icon icon="bxl:discord-alt"/></svelte:fragment>
						Login
					</Button>
				{:else}
					<!-- origin="tr" for now because 'auto' appears to be broken. TODO -->
					<Menu origin="tr">
						<DiscordAvatar slot="trigger" user={user} size="md" hover={true}></DiscordAvatar>
						<Card slot="content">
							<Button variant="ring-accent" on:click={logout}>Logout</Button>
						</Card>
					</Menu>
				{/if}
				</div>
			</div>
			<Divider></Divider>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="main">
		<div class="relative">
			<div class="absolute top-16 overflow-y-auto">
				<List tag="nav">
					<ListItem href="/">
						<svelte:fragment slot="lead">
							<Icon icon="heroicons-solid:home" />
						</svelte:fragment>
						Home
					</ListItem>
					<ListItem href="/lobby">
						<svelte:fragment slot="lead">
							<Icon icon="fluent:conference-room-24-filled" />
						</svelte:fragment>
						Lobbies
					</ListItem>
					<ListItem href="/logictest">
						<svelte:fragment slot="lead">
							<Icon icon="mdi:test-tube" />
						</svelte:fragment>
						Logic Test
					</ListItem>
					<ListItem href="/about">
						<svelte:fragment slot="lead">
							<Icon icon="akar-icons:info-fill" />
						</svelte:fragment>
						About
					</ListItem>
				</List>
				<img src="/under-construction.gif" alt="Under Construction">
			</div>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="footer">
		<footer>
			<div class="fixed bottom-0 left-1.5 right-1.5 bg-surface-50 dark:bg-surface-900">
				<Divider></Divider>
				<div class="grid grid-cols-3">
					<p>&#xa9; oro 2022</p>
					<!-- svelte-ignore missing-declaration -->
					<div class="flex justify-center"><p>v. {__APP_VERSION__}</p></div>
					<Button href="https://github.com/ssbm-oro/pland" size="none" action="_">
						<svelte:fragment slot="lead">
							<Icon icon="fa:github-square" width=24 inline={true}/>
						</svelte:fragment>
						Github
					</Button>
				</div>
			</div>
		</footer>
	</svelte:fragment>
	</Drawer>

	<div id="main" class="w-screen h-screen overflow-y-auto backdrop-blur-lg bg-surface-200/30 dark:bg-surface-900/60">
		<header class="lg:hidden flex p-8 space-x-4">
			<!-- Hamburger Menu -->
			<Button variant="minimal" class="absolute top-8 left-8" on:click={() => $drawer = !$drawer}>
				<svelte:fragment slot="lead">
					<Icon icon="quill:hamburger-sidebar" height="32"/>
				</svelte:fragment>
				<span class="font-bold">Menu</span>
			</Button>
		</header>

		<!-- Page Slot -->
		<div class="container min-w-full mx-auto p-8 ">
			<slot />
		</div>
	</div>
</main>
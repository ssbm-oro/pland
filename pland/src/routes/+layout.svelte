<script lang="ts">
	import "../theme.postcss";
	import "../app.postcss";
    import { onMount, onDestroy } from 'svelte';
    import Icon from '@iconify/svelte';
    import { env } from '$env/dynamic/public';
    import { PUBLIC_DISCORD_OAUTH_CLIENT_ID } from '$env/static/public';
    import type { LayoutData } from './$types';
	import { Button, LightSwitch, Menu, Card, Drawer, Divider, List, ListItem, GradientHeading } from '@brainandbones/skeleton';
	import { writable } from "svelte/store";
	import DiscordAvatar from "$lib/components/DiscordAvatar.svelte";
import { invalidate } from "$app/navigation";

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
		invalidate();
	}

    const redirect_uri = env.PUBLIC_DISCORD_REDIRECT_URI;
    const client_id = PUBLIC_DISCORD_OAUTH_CLIENT_ID;

    const discord_login_uri = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify%20guilds`;
</script>

<main class="flex flex-row">
	<Drawer visible={drawer} fixed="left">

	<svelte:fragment slot="header">
		<div class="flex">
			<a href="/"><GradientHeading tag="h3">pland</GradientHeading></a>
			<LightSwitch />
			{#if !user}
				<Button variant="ring-accent" on:click="{() => (window.location.href = discord_login_uri)}">
					<svelte:fragment slot="lead"><Icon icon="bxl:discord-alt"/></svelte:fragment>
					Login
				</Button>
			{:else}
				<Menu>
					<DiscordAvatar slot="trigger" user={user} size="md" hover={true}></DiscordAvatar>
					<Card slot="content">
						<Button variant="ring-accent" on:click={logout}>Logout</Button>
					</Card>
				</Menu>
			{/if}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="main">
		<List tag="nav" separator="|">
			<ListItem href="/">Home</ListItem>
			<ListItem href="/lobby">Lobbies</ListItem>
			<ListItem href="/logictest">Logic Test</ListItem>
			<ListItem href="/about">About</ListItem>
		</List>
		<img src="/under-construction.gif" alt="Under Construction">
	</svelte:fragment>

	<svelte:fragment slot="footer">
		<Divider></Divider>
		<!-- svelte-ignore missing-declaration -->
		<footer>&#xa9; oro 2022 - Version {__APP_VERSION__} 
			<Button href="https://github.com/ssbm-oro/pland" size="none" action="_">
				<svelte:fragment slot="lead">
					<Icon icon="fa:github-square" width=24 inline={true}/>
				</svelte:fragment>
				Github
			</Button></footer>
		<br/>
	</svelte:fragment>
	</Drawer>

	<div id="main" class="w-screen h-screen overflow-y-auto">
		<header class="lg:hidden flex p-8 space-x-4">
			<!-- Hamburger Menu -->
			<Button variant="minimal" class="absolute top-4 left-4" on:click={() => $drawer = !$drawer}>
				<svelte:fragment slot="lead">
					<Icon icon="quill:hamburger-sidebar"/>
				</svelte:fragment>
				<span class="font-bold">Menu</span>
			</Button>
		</header>

		<!-- Page Slot -->
		<div class="container mx-auto p-8">
			<slot />
		</div>
	</div>

</main>
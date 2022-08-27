<script lang="ts">
	import "../theme.postcss";
	import "../app.postcss";
    import { onMount, onDestroy } from 'svelte';
    import Icon from '@iconify/svelte';
    import { env } from '$env/dynamic/public';
    import { PUBLIC_DISCORD_OAUTH_CLIENT_ID } from '$env/static/public';
    import type { LayoutData } from './$types';
	import { Button, LightSwitch } from '@brainandbones/skeleton';

    export let data: LayoutData;
    $: user = data.user;

    let intervalId: NodeJS.Timer;

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

		window.location.href = '/';
	}

    const redirect_uri = env.PUBLIC_DISCORD_REDIRECT_URI;
    const client_id = PUBLIC_DISCORD_OAUTH_CLIENT_ID;

    const discord_login_uri = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify%20guilds`;
</script>

<header>
	<nav>
		<a href="/">Home</a>
		<a href="/lobby">Lobbies</a>
		<a href="/logictest">Logic Test</a>
		<a href="/about">About</a>
		<LightSwitch/>
		{#if !user}
			<Button on:click="{() => (window.location.href = discord_login_uri)}">
				<svelte:fragment slot="lead"><Icon icon="bxl:discord-alt"/></svelte:fragment>
				Login with Discord
			</Button>
		{:else}
			<button on:click="{logout}">Sign out</button>
		{/if}
	</nav>
	<img src="/under-construction.gif" alt="Under Construction">
</header>
  
<slot></slot>

<br>
<!-- svelte-ignore missing-declaration -->
<footer>&#xa9; oro 2022 - Version {__APP_VERSION__}</footer>
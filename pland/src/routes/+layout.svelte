<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { APIUser } from 'discord-api-types/payloads';
	import { UserStore } from '$lib/stores';
	import SvelteTheme from 'svelte-themes/SvelteTheme.svelte';
	import themeStore, { setTheme } from 'svelte-themes';
	import Icon from '@iconify/svelte';
	import { env } from '$env/dynamic/public';
	import { PUBLIC_DISCORD_OAUTH_CLIENT_ID } from '$env/static/public';

	let intervalId: NodeJS.Timer;

	onMount(async () => {
		const res = await fetch('/api/user/validateSession', { method: 'POST' });

        if (res.status == 200)
        {
            const User: APIUser = await res.json();
            UserStore.setUser(User);

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

	function toggleTheme(){
		if ($themeStore.theme == 'light') {
			setTheme('dark');
		}
		else {
			setTheme('light');
		}
	}
	$: toggleIcon = $themeStore.theme == 'light' ? '☽' : '☀';

	async function logout() {
		await fetch('/api/user/logout', {method: 'POST' });

		window.location.href = '/';
	}

	const redirect_uri = env.PUBLIC_DISCORD_REDIRECT_URI;
	const client_id = PUBLIC_DISCORD_OAUTH_CLIENT_ID;

	const discord_login_uri = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify%20guilds`;
</script>

<SvelteTheme />
<header>
	<nav>
		<a href="/">Home</a>
		<a href="/lobby">Lobbies</a>
		<a href="/logictest">Logic Test</a>
		<a href="/about">About</a>
		<button on:click='{toggleTheme}'>{toggleIcon}</button>
		{#if !$UserStore}
			<button on:click={() => (window.location.href = discord_login_uri)}>
				Login with Discord<Icon icon="bxl:discord-alt" /></button>
		{:else}
			<button on:click='{logout}'>Sign out</button>
		{/if}
	</nav>
	<img src="/under-construction.gif" alt="Under Construction">
</header>
  
<slot></slot>

<br/>
<!-- svelte-ignore missing-declaration -->
<footer>© oro 2022 - Version {__APP_VERSION__}</footer>
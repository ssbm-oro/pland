<script context="module" lang="ts">
	import type { IUserData } from 'src/interfaces';
	import { UserStore } from '$lib/stores';
    import type { Load } from '@sveltejs/kit';
	import SvelteTheme from 'svelte-themes/SvelteTheme.svelte'
	import themeStore, { setTheme } from 'svelte-themes'

	export const load: Load = async ({ session, fetch }) => {
		const res = await fetch('/api/user/validateSession', {
			method: 'POST',
			body: JSON.stringify({ sessionId: session.id } || {}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

        if (res.status == 200)
        {
            const User: IUserData = await res.json();
            UserStore.setUser(User);
        }

		return {
			props: {}
		};
	}
</script>

<script lang="ts">
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
		await fetch('/api/user/logout', {
			method: 'POST',
			body: JSON.stringify({})
		});

		window.location.href = '/';
	}

	const redirect_uri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI);
	const client_id = import.meta.env.VITE_DISCORD_OAUTH_CLIENT_ID;

	const discord_login_uri = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=identify%20guilds`;
</script>

<SvelteTheme />
<nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
	<button on:click='{toggleTheme}'>{toggleIcon}</button>
	{#if !$UserStore}
		<button on:click={() => (window.location.href = discord_login_uri)}>
			Login with Discord</button>
	{:else}
			
			<button on:click='{logout}'>Sign out</button>
	{/if}
</nav>
  
<slot></slot>
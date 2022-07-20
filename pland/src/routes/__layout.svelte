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
</script>

<SvelteTheme />
<nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
	<button on:click='{toggleTheme}'>{toggleIcon}</button>
</nav>
  
<slot></slot>
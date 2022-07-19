<script context="module" lang="ts">
	import type { FullUser } from 'src/interfaces';
	import { UserStore } from '$lib/stores';
    import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session, fetch }) => {
		// if (!session?.id)
		// 	return {
		// 		status: 302,
		// 		redirect: '/'
		// 	};

		const res = await fetch('/api/user/validateSession', {
			method: 'POST',
			body: JSON.stringify({ sessionId: session.id } || {}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// if (res.status !== 200)
		// 	return {
		// 		status: 302,
		// 		redirect: '/'
		// 	};

        if (res.status == 200)
        {
            const User: FullUser = await res.json();
            UserStore.setUser(User);
        }

		return {
			props: {}
		};
	}
</script>

<nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
</nav>
  
<slot></slot>
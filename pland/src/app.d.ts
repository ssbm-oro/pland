/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />
declare module 'simple-svelte-autocomplete';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user: ?{
			id: import('./interfaces').TUserDiscordID
		}
	}
	interface PrivateEnv {}
	interface PublicEnv {
		PUBLIC_DISCORD_REDIRECT_URI: string
	}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}

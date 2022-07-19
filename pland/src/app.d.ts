/// <reference types="@sveltejs/kit" />
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
	// interface Platform {}
	interface Session {
		id: ? import('./interfaces').TSessionID
	}
	// interface Stuff {}
}

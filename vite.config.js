import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import Icons from 'unplugin-icons/vite'
 
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), Icons({compiler:'svelte'})],
	server: {
	},
	define: {
		'__APP_VERSION__': JSON.stringify(pkg.version),
	}
};

export default config;

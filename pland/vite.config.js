import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
 
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
	  fs: {
		// Allow serving files from one level up to the project root
		allow: ['..'],
	  },
	},
	define: {
		'__APP_VERSION__': JSON.stringify(pkg.version),
	}
};

export default config;

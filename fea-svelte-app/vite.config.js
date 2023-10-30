import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
		  // Create a proxy for SWAPI
		  '/https://swapi.dev': {
			target: 'https://swapi.dev',
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\/https:\/\/swapi.dev/, ''),
		  },
		},
	  },
});

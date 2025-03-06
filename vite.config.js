import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	
});
// Compare this snippet from src/routes/%28app%29/upload/%2Bpage.svelte:
// <script context="module">
// 	export { load } from './upload/+page.server.js';			
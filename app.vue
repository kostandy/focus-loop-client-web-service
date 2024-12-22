<script setup lang="ts">
useHead({
	title: 'Focus Loop',
	htmlAttrs: { lang: 'en' },
	meta: [
		{
			name: 'description',
			content: 'Empowering your productivity and efficiency with the Focus Loop tool',
		},
		{
			name: 'theme-color',
			content: '#60A5FA',
		},
		{
			name: 'viewport',
			content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
		},
	],
	link: [
		{
			rel: 'preconnect',
			href: 'https://rsms.me',
		},
		{
			rel: 'stylesheet',
			href: 'https://rsms.me/inter/inter.css',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '192x192',
			href: '/android-chrome-192x192.png',
		},
		{
			rel: 'apple-touch-icon',
			sizes: '512x512',
			href: '/android-chrome-512x512.png',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '16x16',
			href: '/favicon-16x16.png',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '32x32',
			href: '/favicon-32x32.png',
		},
	],
});
</script>

<template>
<NuxtRouteAnnouncer />
<NuxtLayout>
	<NuxtPage />
</NuxtLayout>
<USlideovers />
<UNotifications />
</template>

<style>
html,
body {
	@apply bg-gray-900;
}
</style>

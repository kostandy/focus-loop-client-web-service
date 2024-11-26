<script setup lang="ts">
useHead({
  meta: [{
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  }],
  link: [{
    rel: "preconnect",
    href: "https://rsms.me"
  }, {
    rel: "stylesheet",
    href: "https://rsms.me/inter/inter.css"
  }]
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UModals />
</template>

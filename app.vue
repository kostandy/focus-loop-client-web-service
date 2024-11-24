<script setup lang="ts">
useHead({
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
</template>

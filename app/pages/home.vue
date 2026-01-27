<script setup lang="ts">


definePageMeta({
  middleware: 'auth',
  layout: 'default'
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold">Welcome to Your TODO App</h1>

    <UCard
      class="mt-6 max-w-sm"
      :card="{
        title: 'Startup',
        icon: 'i-lucide-users',
        color: 'primary',
        to: 'https://nuxt.lemonsqueezy.com',
        target: '_blank'
      }"
    >
      Best suited for small teams, startups and agencies with up to 5 developers.
    </UCard>
  </div>
</template>
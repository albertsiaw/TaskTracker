<script setup lang="ts">
import Layout from '~/layouts/default.vue'


definePageMeta({
  middleware: 'auth',
  layout: 'default'
})
</script>

<template>
  <Layout>
    <div>
      <h1 class="text-3xl font-bold">Welcome to Your TODO App</h1>

      <UCard
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
  </Layout>
</template>
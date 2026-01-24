<script setup lang="ts">
import StatCard from './StatCard.vue'

defineProps<{
  total: number
  active: number
  completed: number
}>()
</script>


<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
    <StatCard icon="heroicons:clipboard" label="Total" :value="total" />
    <StatCard icon="heroicons:clock" label="Active" :value="active" />
    <StatCard icon="heroicons:check-circle" label="Completed" :value="completed" />
  </div>
</template>


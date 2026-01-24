<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  icon: string
}>()
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
    <div class="flex items-center gap-3">
      <Icon :name="icon" class="text-3xl sm:text-4xl text-blue-600" />
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
          {{ title }}
        </h1>
        <p class="text-sm sm:text-base text-slate-500">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>



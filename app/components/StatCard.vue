<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: number
}>()
</script>


<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
    <Icon :name="icon" class="text-xl sm:text-2xl text-blue-600" />
    <div>
      <p class="text-xs sm:text-sm text-slate-500">{{ label }}</p>
      <p class="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">
        {{ value }}
      </p>
    </div>
  </div>
</template>



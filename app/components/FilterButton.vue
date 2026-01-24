<script setup lang="ts">
defineProps<{
  label: string
  value: 'all' | 'active' | 'completed'
  modelValue: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <button
    @click="$emit('update:modelValue', value)"
    class="px-4 py-2 text-sm rounded-lg border transition"
    :class="modelValue === value
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white dark:bg-slate-800'"
  >
    {{ label }}
  </button>
</template>



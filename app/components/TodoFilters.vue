<script setup lang="ts">
defineProps<{
  modelValue: 'all' | 'active' | 'completed'
  hasCompleted: boolean
}>()

defineEmits(['update:modelValue', 'clear'])
</script>


<template>
  <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
    <div class="flex gap-2">
      <FilterButton label="All" value="all" :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" />
      <FilterButton label="Active" value="active" :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" />
      <FilterButton label="Completed" value="completed" :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" />
    </div>

    <button
      v-if="hasCompleted"
      @click="$emit('clear')"
      class="sm:ml-auto text-sm text-red-500 hover:underline"
    >
      Clear completed
    </button>
  </div>
</template>


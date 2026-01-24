<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits(['update:modelValue', 'submit'])
</script>


<template>
  <form
    @submit="$emit('submit')"
    class="flex flex-col sm:flex-row gap-3 mb-6"
  >
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      placeholder="Add a task..."
      class="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      type="submit"
      class="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Add
    </button>
  </form>
</template>


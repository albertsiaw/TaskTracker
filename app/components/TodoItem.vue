<script setup lang="ts">
defineProps<{
  todo: any
  editing: boolean
  editingText: string
}>()

defineEmits([
  'toggle',
  'delete',
  'edit',
  'save',
  'cancel',
  'updateText'
])
</script>
<template>
  <li
    class="bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm"
  >
    <div class="flex items-center gap-3 flex-1">
      <input type="checkbox" :checked="todo.completed" @change="$emit('toggle')" />

      <template v-if="editing">
        <input
          :value="editingText"
          @input="$emit('updateText', ($event.target as HTMLInputElement).value)"
          class="flex-1 px-3 py-2 rounded border"
        />
      </template>

      <template v-else>
        <span
          class="wrap-break-words"
          :class="todo.completed && 'line-through text-slate-400'"
        >
          {{ todo.text }}
        </span>
      </template>
    </div>

    <div class="flex gap-2 sm:ml-auto">
      <button @click="editing ? $emit('save') : $emit('edit', todo)">
        <Icon :name="editing ? 'heroicons:check' : 'heroicons:pencil'" />
      </button>

      <button @click="$emit('delete')">
        <Icon name="heroicons:trash" class="text-red-500" />
      </button>
    </div>
  </li>
</template>



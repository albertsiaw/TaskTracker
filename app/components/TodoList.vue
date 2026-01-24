<script setup lang="ts">
defineProps<{
  todos: any[]
  editingId: number | null
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
  <ul class="space-y-3">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      :editing="editingId === todo.id"
      :editingText="editingText"
      @toggle="$emit('toggle', todo.id)"
      @delete="$emit('delete', todo.id)"
      @edit="$emit('edit', todo)"
      @save="$emit('save')"
      @cancel="$emit('cancel')"
      @updateText="$emit('updateText', $event)"
    />
  </ul>
</template>



<script setup lang="ts">
defineProps<{
  todos: any[]
  editingId: string | null
  editingText: string
  currentUserId?: string
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
      :currentUserId="currentUserId"
      @toggle="$emit('toggle', todo.id)"
      @delete="$emit('delete', todo.id)"
      @edit="$emit('edit', todo)"
      @save="$emit('save')"
      @cancel="$emit('cancel')"
      @updateText="$emit('updateText', $event)"
    />
  </ul>
</template>



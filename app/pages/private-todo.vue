<script lang="ts" setup>
import { ref, computed } from 'vue'
import Layout from '~/layouts/default.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

const todos = ref<Todo[]>([])
const newTodoText = ref('')
const editingId = ref<number | null>(null)
const editingText = ref('')
const filter = ref<'all' | 'active' | 'completed'>('all')

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todos.value.filter(t => !t.completed)
  if (filter.value === 'completed') return todos.value.filter(t => t.completed)
  return todos.value
})

/**
 * ⚠️ SSR-safe name
 * Do NOT rename this to `stats`
 */
const todoStats = computed(() => ({
  total: todos.value.length,
  active: todos.value.filter(t => !t.completed).length,
  completed: todos.value.filter(t => t.completed).length
}))

const addTodo = () => {
  if (!newTodoText.value.trim()) return
  todos.value.unshift({
    id: Date.now(),
    text: newTodoText.value.trim(),
    completed: false,
    createdAt: new Date()
  })
  newTodoText.value = ''
}

const toggleTodo = (id: number) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.completed = !todo.completed
}

const deleteTodo = (id: number) => {
  todos.value = todos.value.filter(t => t.id !== id)
}

const startEdit = (todo: Todo) => {
  editingId.value = todo.id
  editingText.value = todo.text
}

const saveEdit = () => {
  if (!editingText.value.trim()) return
  const todo = todos.value.find(t => t.id === editingId.value)
  if (todo) todo.text = editingText.value.trim()
  cancelEdit()
}

const cancelEdit = () => {
  editingId.value = null
  editingText.value = ''
}

const clearCompleted = () => {
  todos.value = todos.value.filter(t => !t.completed)
}
</script>

<template>
  <Layout>
    <div class="min-h-screen bg-blue-50 dark:bg-slate-900">
      <div class="max-w-5xl mx-auto px-4 py-10">

        <!-- Header -->
        <TodoHeader
          title="Private Tasks"
          subtitle="Only visible to you"
          icon="heroicons:lock-closed"
        />

        <!-- Stats -->
        <TodoStats
          :total="todoStats.total"
          :active="todoStats.active"
          :completed="todoStats.completed"
        />

        <!-- Add Todo -->
        <TodoForm
          v-model="newTodoText"
          @submit.prevent="addTodo"
        />

        <!-- Filters -->
        <TodoFilters
          v-model="filter"
          :hasCompleted="todoStats.completed > 0"
          @clear="clearCompleted"
        />

        <!-- Todo List -->
        <TodoList
          :todos="filteredTodos"
          :editingId="editingId"
          :editingText="editingText"
          @toggle="toggleTodo"
          @delete="deleteTodo"
          @edit="startEdit"
          @save="saveEdit"
          @cancel="cancelEdit"
          @updateText="editingText = $event"
        />

        <!-- Empty State -->
        <p
          v-if="filteredTodos.length === 0"
          class="text-center text-slate-400 py-10"
        >
          No private tasks
        </p>

      </div>
    </div>
  </Layout>
</template>

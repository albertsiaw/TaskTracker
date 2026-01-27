<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
const { user } = useAuth()

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

interface Todo {
  id: string
  text: string
  completed: boolean | null
  userId: string
  isPublic: boolean | null
  userEmail?: string
  deadline?: string | null
  createdAt?: string | null
}

const todos = ref<Todo[]>([])
const newTodoText = ref('')
const editingId = ref<string | null>(null)
const editingText = ref('')
const filter = ref<'all' | 'active' | 'completed'>('all')
const isLoading = ref(false)
const toast = useToast()

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todos.value.filter(t => !t.completed)
  if (filter.value === 'completed') return todos.value.filter(t => t.completed)
  return todos.value
})

const todoStats = computed(() => ({
  total: todos.value.length,
  active: todos.value.filter(t => !t.completed).length,
  completed: todos.value.filter(t => t.completed).length
}))

const loadTodos = async (silent = false) => {
  if (!silent) isLoading.value = true
  try {
    const response = await $fetch<Todo[]>('/api/todos/public')
    todos.value = response || []
  } catch (error) {
    console.error('Failed to load todos:', error)
    if (!silent) toast.add({ title: 'Error', description: 'Failed to load todos', color: 'error' })
  } finally {
    if (!silent) isLoading.value = false
  }
}

let pollInterval: any = null

onMounted(async () => {
  await loadTodos()
  pollInterval = setInterval(() => loadTodos(true), 3000) // Poll silently every 3 seconds
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

const addTodo = async (payload: { text: string, deadline: string }) => {
  console.log('Attempting to add public todo:', payload)
  if (!payload.text.trim()) return
  try {
    const newTodo = await $fetch<Todo>('/api/todos', {
      method: 'POST',
      body: {
        text: payload.text,
        isPublic: true,
        deadline: payload.deadline || null
      }
    })
    if (newTodo) {
      todos.value.unshift(newTodo)
    }
    newTodoText.value = ''
    toast.add({ title: 'Success', description: 'Task created', color: 'success' })
  } catch (error) {
    console.error('Failed to add todo:', error)
    toast.add({ title: 'Error', description: 'Failed to create task', color: 'error' })
  }
}

const toggleTodo = async (id: string) => {
  const todo = todos.value.find(t => t.id === id)
  if (!todo) return
  
  try {
    const updated = await $fetch<Todo>(`/api/todos/${id}`, {
      method: 'PATCH',
      body: { completed: !todo.completed }
    })
    const index = todos.value.findIndex(t => t.id === id)
    if (index !== -1 && updated) {
      todos.value[index] = updated
    }
  } catch (error) {
    console.error('Failed to update todo:', error)
    toast.add({ title: 'Error', description: 'Failed to update task', color: 'error' })
  }
}

const deleteTodo = async (id: string) => {
  try {
    await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
    todos.value = todos.value.filter(t => t.id !== id)
    toast.add({ title: 'Success', description: 'Task deleted', color: 'success' })
  } catch (error) {
    console.error('Failed to delete todo:', error)
    toast.add({ title: 'Error', description: 'Failed to delete task', color: 'error' })
  }
}

const startEdit = (todo: Todo) => {
  editingId.value = todo.id
  editingText.value = todo.text
}

const saveEdit = async () => {
  if (!editingText.value.trim()) return
  const todo = todos.value.find(t => t.id === editingId.value)
  if (!todo) return
  try {
    const updated = await $fetch<Todo>(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      body: { text: editingText.value }
    })
    const index = todos.value.findIndex(t => t.id === todo.id)
    if (index !== -1 && updated) {
      todos.value[index] = updated
    }
    cancelEdit()
    toast.add({ title: 'Success', description: 'Task updated', color: 'success' })
  } catch (error) {
    console.error('Failed to update todo:', error)
    toast.add({ title: 'Error', description: 'Failed to update task', color: 'error' })
  }
}

const cancelEdit = () => {
  editingId.value = null
  editingText.value = ''
}

const clearCompleted = async () => {
  const completedTodos = todos.value.filter(t => t.completed)
  for (const todo of completedTodos) {
    await deleteTodo(todo.id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <div class="max-w-5xl mx-auto px-4 py-10">
      <TodoHeader
        title="Public Tasks"
        subtitle="Visible to everyone"
        icon="heroicons:clipboard-document-check"
      />

      <TodoStats
        :total="todoStats.total"
        :active="todoStats.active"
        :completed="todoStats.completed"
      />

      <TodoForm
        v-model="newTodoText"
        @submit="addTodo"
      />

      <TodoFilters
        v-model="filter"
        :hasCompleted="todoStats.completed > 0"
        @clear="clearCompleted"
      />

      <div v-if="isLoading" class="text-center py-10">
        <UIcon name="eos-icons:loading" class="text-2xl" />
      </div>

      <TodoList
        v-else
        :todos="filteredTodos"
        :editingId="editingId"
        :editingText="editingText"
        :currentUserId="user?.id"
        @toggle="toggleTodo"
        @delete="deleteTodo"
        @edit="startEdit"
        @save="saveEdit"
        @cancel="cancelEdit"
        @updateText="editingText = $event"
      />

      <p
        v-if="!isLoading && filteredTodos.length === 0"
        class="text-center text-slate-400 py-10"
      >
        No public tasks yet
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  todo: any
  editing: boolean
  editingText: string
  currentUserId?: string
}>()

defineEmits(['toggle', 'delete', 'edit', 'save', 'cancel', 'updateText'])

// Permission check: only owner can edit/delete/complete
const isOwner = computed(() => {
  if (!props.todo || !props.currentUserId) return false
  return props.currentUserId === props.todo.userId
})

const creatorName = computed(() => {
  if (!props.todo?.userEmail) return 'Unknown'
  // Extract name from email (e.g., "john" from "john@example.com")
  return props.todo.userEmail.split('@')[0]
})

const avatarUrl = computed(() => {
  if (!props.todo?.userEmail) return null
  return `https://www.gravatar.com/avatar/${props.todo.userEmail}?d=mp`
})
</script>

<template>
  <li
    class="bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-400 transition-all duration-200"
  >
    <!-- Creator Info First -->
    <div v-if="todo.userEmail" class="flex items-center gap-3 flex-shrink-0 min-w-[140px] border-r pr-4 border-slate-100 dark:border-slate-700">
      <div class="relative">
        <UAvatar
          :src="avatarUrl || undefined"
          :alt="creatorName"
          size="xs"
          class="ring-2 ring-blue-100 dark:ring-blue-900"
        />
        <div v-if="isOwner" class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white dark:ring-slate-800"></div>
      </div>
      <div class="flex flex-col">
        <span class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[100px]">
          {{ isOwner ? 'Me' : creatorName }}
        </span>
        <span class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Creator</span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex items-center gap-3 flex-1">
      <input
        type="checkbox"
        :checked="!!todo.completed"
        :disabled="!isOwner"
        @change="$emit('toggle')"
        class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      />

      <template v-if="editing">
        <input
          :value="editingText"
          @input="$emit('updateText', ($event.target as HTMLInputElement).value)"
          class="flex-1 px-3 py-1 rounded border border-blue-400 focus:outline-none dark:bg-slate-700 dark:border-slate-600 bg-white"
          autofocus
          @keyup.enter="$emit('save')"
          @keyup.esc="$emit('cancel')"
        />
      </template>

      <template v-else>
        <span
          class="break-words flex-1 text-slate-700 dark:text-slate-200"
          :class="todo.completed && 'line-through text-slate-400 dark:text-slate-500'"
        >
          {{ todo.text }}
        </span>
      </template>
    </div>

    <!-- Actions -->
    <div v-if="isOwner" class="flex gap-2 sm:ml-auto">
      <button
        @click="editing ? $emit('save') : $emit('edit', todo)"
        class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 hover:text-blue-600"
        :title="editing ? 'Save' : 'Edit'"
      >
        <Icon :name="editing ? 'heroicons:check' : 'heroicons:pencil'" class="w-5 h-5" />
      </button>

      <button
        @click="$emit('delete')"
        class="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-500 rounded-lg transition-colors"
        title="Delete"
      >
        <Icon name="heroicons:trash" class="w-5 h-5" />
      </button>
    </div>
  </li>
</template>



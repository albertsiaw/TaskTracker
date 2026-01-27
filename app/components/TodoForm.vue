<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue', 'submit'])

const deadline = ref('')

const handleSubmit = () => {
  emit('submit', { text: props.modelValue, deadline: deadline.value })
  deadline.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="mb-6">
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Task Input -->
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        placeholder="Add a task..."
        class="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black font-bold"
        required
      />

      <!-- Deadline Popover -->
      <UPopover>
        <template #default>
          <div class="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white cursor-pointer hover:border-blue-500 transition-colors min-w-[200px] h-full shadow-sm">
            <Icon name="heroicons:calendar-days" class="text-blue-600 w-5 h-5 flex-shrink-0" />
            <div class="flex flex-col items-start overflow-hidden">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Deadline</span>
              <span class="text-xs font-bold text-black truncate w-full">
                {{ deadline ? new Date(deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'No deadline set' }}
              </span>
            </div>
          </div>
        </template>

        <template #content>
          <div class="p-4 bg-white dark:bg-slate-900 border rounded-xl shadow-2xl min-w-[280px]">
             <div class="space-y-4">
                <div class="flex items-center gap-2 text-blue-600 mb-2">
                   <Icon name="heroicons:calendar-days" class="w-5 h-5" />
                   <span class="font-bold text-sm">Select Date & Time</span>
                </div>
                <!-- Datetime input allows both date and time selection -->
                <input 
                  type="datetime-local" 
                  v-model="deadline" 
                  class="w-full p-3 border border-slate-200 rounded-lg text-black font-bold focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                  required
                />
                <div class="flex justify-between items-center px-1">
                   <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest">Select both date & time</p>
                   <button 
                     v-if="deadline" 
                     @click="deadline = ''" 
                     type="button"
                     class="text-[10px] text-red-500 font-bold hover:underline"
                   >
                     Clear
                   </button>
                </div>
             </div>
          </div>
        </template>
      </UPopover>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-bold flex items-center justify-center gap-2 shadow-sm"
      >
        <Icon name="heroicons:plus-circle" class="w-5 h-5" />
        Add Task
      </button>
    </div>
  </form>
</template>

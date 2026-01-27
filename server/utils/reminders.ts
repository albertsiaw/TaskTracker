import { reminderQueue } from '../queues/reminder.queue'

export async function scheduleTodoReminders(todo: any, userEmail: string) {
  if (!todo.deadline) return

  const deadlineTime = new Date(todo.deadline).getTime()
  const now = Date.now()

  const intervals = [
    { name: '3 days', ms: 3 * 24 * 60 * 60 * 1000 },
    { name: '1 day', ms: 1 * 24 * 60 * 60 * 1000 },
    { name: '1 hour', ms: 1 * 60 * 60 * 1000 }
  ]

  for (const interval of intervals) {
    const reminderTime = deadlineTime - interval.ms
    const delay = reminderTime - now

    // Only schedule if the reminder time is in the future
    if (delay > 0) {
      await reminderQueue.add(
        `reminder-${todo.id}-${interval.name.replace(' ', '-')}`,
        {
          todoId: todo.id,
          todoText: todo.text,
          userEmail,
          interval: interval.name,
          deadline: todo.deadline
        },
        {
          delay,
          jobId: `reminder-${todo.id}-${interval.name.replace(' ', '-')}`,
          removeOnComplete: true,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 }
        }
      )
    }
  }
}

export async function removeTodoReminders(todoId: string) {
  const intervals = ['3-days', '1-day', '1-hour']
  for (const suffix of intervals) {
    const jobId = `reminder-${todoId}-${suffix}`
    const job = await reminderQueue.getJob(jobId)
    if (job) {
      await job.remove()
    }
  }
}

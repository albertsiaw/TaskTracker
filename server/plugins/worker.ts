import { startReminderWorker } from '../utils/reminders.worker'

export default defineNitroPlugin((nitroApp) => {
  if (process.env.NODE_ENV !== 'test') {
    startReminderWorker()
    console.log('🚀 BullMQ Reminder Worker started successfully')
  }
})

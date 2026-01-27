import { Queue } from 'bullmq'
import { redis } from '../utils/redis'

export const reminderQueue = new Queue('reminders', { connection: redis })

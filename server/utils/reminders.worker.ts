import { Worker } from 'bullmq'
import { redis } from './redis'
import { sendEmail } from './mail'

export function startReminderWorker() {
  const worker = new Worker(
    'reminders',
    async (job) => {
      const { todoId, todoText, userEmail, interval, deadline } = job.data
      
      console.log(`Processing reminder for todo ${todoId}: ${interval} alert`)

      const formattedDeadline = new Date(deadline).toLocaleString()

      await sendEmail({
        to: userEmail,
        subject: `⏰ Task Reminder: ${interval} until deadline!`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Task Deadline Alert</h2>
            <p>Your task <strong>"${todoText}"</strong> is due in <strong>${interval}</strong>.</p>
            <p>Deadline: <strong>${formattedDeadline}</strong></p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">This is an automated reminder from your Todo App.</p>
          </div>
        `,
        text: `Reminder: Your task "${todoText}" is due in ${interval} (Deadline: ${formattedDeadline}).`
      })
    },
    { connection: redis }
  )

  worker.on('completed', (job) => {
    console.log(`Reminder job ${job.id} completed successfully`)
  })

  worker.on('failed', (job, err) => {
    console.error(`Reminder job ${job?.id} failed: ${err.message}`)
  })

  return worker
}

import { MailerooClient } from 'maileroo'

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html?: string
  text?: string
}) {
  const maileroo = MailerooClient.getClient(process.env.MAILEROO_API_KEY!)

  if (!maileroo) {
    throw new Error('Maileroo client not initialized. Check MAILEROO_API_KEY.')
  }

  return maileroo
    .setFrom(process.env.MAIL_FROM_NAME || 'App', process.env.MAIL_FROM_EMAIL || 'noreply@example.com')
    .setTo('', to)
    .setSubject(subject)
    .setHtml(html || '')
    .setPlain(text || '')
    .sendBasicEmail()
}

import 'dotenv/config';
import { MailerooClient } from 'maileroo';

async function testEmail() {
  try {
    console.log('Testing Maileroo email configuration...');
    console.log('API Key:', process.env.MAILEROO_API_KEY ? '✓ Set' : '✗ Missing');
    console.log('From Email:', process.env.MAIL_FROM_EMAIL);
    console.log('From Name:', process.env.MAIL_FROM_NAME);

    const maileroo = MailerooClient.getClient(process.env.MAILEROO_API_KEY);

    if (!maileroo) {
      throw new Error('Failed to initialize Maileroo client');
    }

    // Test email
    const result = await maileroo
      .setFrom(process.env.MAIL_FROM_NAME || 'TODO App', process.env.MAIL_FROM_EMAIL || 'noreply@example.com')
      .setTo('', process.env.MAIL_FROM_EMAIL) // Send to yourself for testing
      .setSubject('✅ TODO App Email Test')
      .setHtml(`
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Email Configuration Test</h2>
          <p>This is a test email from your TODO App.</p>
          <p>If you're seeing this, your email configuration is working correctly! 🎉</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `)
      .setPlain('Email configuration test - if you see this, it works!')
      .sendBasicEmail();

    console.log('✅ Test email sent successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Email test failed:', error);
    process.exit(1);
  }
}

testEmail();

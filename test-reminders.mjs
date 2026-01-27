import 'dotenv/config';
import pg from 'pg';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

const reminderQueue = new Queue('reminders', { connection: redis });

async function testReminderSystem() {
  try {
    console.log('🧪 Testing Reminder System...\n');

    // Check Redis connection
    console.log('1. Checking Redis connection...');
    await redis.ping();
    console.log('   ✅ Redis connected\n');

    // Check queue
    console.log('2. Checking BullMQ queue...');
    const jobCounts = await reminderQueue.getJobCounts();
    console.log('   Queue status:', jobCounts);
    console.log('   ✅ Queue accessible\n');

    // Test scheduling a reminder (1 minute from now)
    console.log('3. Testing reminder scheduling...');
    const testDeadline = new Date(Date.now() + 60000); // 1 minute from now
    
    const job = await reminderQueue.add(
      'test-reminder',
      {
        todoId: 'test-123',
        todoText: 'Test Task',
        userEmail: process.env.MAIL_FROM_EMAIL, // Send to yourself
        interval: '1 minute',
        deadline: testDeadline.toISOString()
      },
      {
        delay: 5000, // Send in 5 seconds for testing
        jobId: 'test-reminder-job',
        removeOnComplete: true
      }
    );

    console.log('   ✅ Test reminder scheduled');
    console.log('   Job ID:', job.id);
    console.log('   Will send in 5 seconds to:', process.env.MAIL_FROM_EMAIL);
    console.log('\n⏳ Waiting for email to send...');
    
    // Wait for job to complete
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    const jobState = await job.getState();
    console.log('   Job state:', jobState);
    
    if (jobState === 'completed') {
      console.log('\n✅ Reminder system is working! Check your email.');
    } else {
      console.log('\n⚠️  Job did not complete. State:', jobState);
      console.log('   Make sure the worker is running (npm run dev)');
    }

    await redis.quit();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    await redis.quit();
    process.exit(1);
  }
}

testReminderSystem();

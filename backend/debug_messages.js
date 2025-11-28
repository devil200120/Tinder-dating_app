import mongoose from 'mongoose';
import './config/db.js';
import Message from './models/Message.js';

console.log('Starting database investigation...');

// Add timeout
setTimeout(() => {
  console.log('Script timeout - exiting');
  process.exit(1);
}, 10000);

mongoose.connection.once('open', async () => {
  try {
    console.log('Database connected, querying messages...');
    
    // Find recent messages without content
    const messagesWithoutContent = await Message.find({
      $or: [
        { content: { $exists: false } },
        { content: '' },
        { content: null },
        { content: undefined }
      ]
    })
    .populate('sender', 'name username photos')
    .populate('receiver', 'name username')
    .sort({ createdAt: -1 })
    .limit(10);

    console.log('Messages without content:', messagesWithoutContent.length);
    messagesWithoutContent.forEach((msg, i) => {
      console.log(`${i+1}. ID: ${msg._id}, Content: '${msg.content}', Sender: ${msg.sender?.username || 'Unknown'}, Date: ${msg.createdAt}`);
    });

    // Check total messages
    const totalMessages = await Message.countDocuments();
    console.log(`\nTotal messages in database: ${totalMessages}`);

    // Check recent messages with content
    const recentWithContent = await Message.find({
      content: { $exists: true, $ne: '' }
    })
    .populate('sender', 'name username')
    .sort({ createdAt: -1 })
    .limit(5);

    console.log('\nRecent messages WITH content:');
    recentWithContent.forEach((msg, i) => {
      console.log(`${i+1}. Content: '${msg.content}', Sender: ${msg.sender?.username || 'Unknown'}, Date: ${msg.createdAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
});

mongoose.connection.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(1);
});
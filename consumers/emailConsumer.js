const { Kafka } = require('kafkajs');
const nodemailer = require('nodemailer');

// Kafka setup
const kafka = new Kafka({ brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'email-group' });

// Mailer config (example with Mailtrap)
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'commandes', fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      console.log(`📧 Sending email to ${order.email} for ${order.produit}`);

      await transporter.sendMail({
        from: 'no-reply@ecommerce.com',
        to: order.email,
        subject: 'Order Confirmation',
        text: `Thanks for ordering ${order.produit}!`,
      });
    },
  });
}

run().catch(console.error);

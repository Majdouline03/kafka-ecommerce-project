// backend/producer.js
const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
  console.log('🟢 Kafka Producer prêt');
});

producer.on('error', (err) => {
  console.error('❌ Kafka error', err);
});

// ADD email to the function
module.exports = (produit, quantite, email) => {
  return new Promise((resolve, reject) => {
    const payloads = [
      {
        topic: 'commandes',
        messages: JSON.stringify({ produit, quantite, email, date: new Date() }),
      },
    ];
    producer.send(payloads, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

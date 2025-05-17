const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
  console.log('🟢 Kafka Producer prêt');
});

producer.on('error', (err) => {
  console.error('❌ Kafka error', err);
});

module.exports = (produit, quantite) => {
  return new Promise((resolve, reject) => {
    const payloads = [
      {
        topic: 'commandes',
        messages: JSON.stringify({ produit, quantite, date: new Date() }),
      },
    ];
    producer.send(payloads, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

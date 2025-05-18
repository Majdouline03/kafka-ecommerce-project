// consumer/statsConsumer.js
const { Kafka } = require('kafkajs');
const { Client } = require('pg');

// Kafka setup
const kafka = new Kafka({ brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'stats-group' });

// PostgreSQL client setup
const db = new Client({
  host: 'db',
  port: 5432,
  user: process.env.PGUSER || 'admin',
  password: process.env.PGPASSWORD || 'password',
  database: process.env.PGDATABASE || 'commandes_db',
});

db.connect();

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'commandes', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      const { produit } = order;

      if (!produit) {
        console.warn('⚠️ Pas de produit trouvé dans le message:', order);
        return;
      }

      console.log(`📊 Mise à jour du produit: ${produit}`);

      await db.query(`
        INSERT INTO top_products (produit, count)
        VALUES ($1, 1)
        ON CONFLICT (produit) DO UPDATE
        SET count = top_products.count + 1;
      `, [produit]);
    },
  });
}

run().catch(console.error);

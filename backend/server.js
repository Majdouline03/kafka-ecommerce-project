const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const producer = require('./producer');
const db = require('./db');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint de test
app.get('/', (req, res) => res.send('API is working!'));

// Endpoint POST commande
app.post('/commandes', async (req, res) => {
  const { produit, quantite, email } = req.body;
  console.log('Reçu:', produit, quantite, email);

  try {
    // Send to Kafka with email
    console.log('Tentative d\'envoi Kafka...');
    await producer(produit, quantite, email);
    console.log('✅ Kafka ok');

    // Save to DB
    console.log('Tentative d\'insertion DB...');
    await db.query(
      'INSERT INTO commandes (produit, quantite, email) VALUES ($1, $2, $3)',
      [produit, quantite, email]
    );
    console.log('✅ DB ok');

    res.status(200).json({ message: 'Commande envoyée !' });
  } catch (err) {
    console.error('❌ ERREUR SERVER:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/top-products', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM top_products
      ORDER BY count DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top products:', err);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
});


app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
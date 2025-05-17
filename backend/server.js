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
  const { produit, quantite } = req.body;
  console.log('Reçu:', produit, quantite);

  try {
     // Envoi à Kafka
    console.log('Tentative d\'envoi Kafka...');
    await producer(produit, quantite);
    console.log('✅ Kafka ok');

    // Stockage dans DB
    console.log('Tentative d\'insertion DB...');
    await db.query(
      'INSERT INTO commandes (produit, quantite) VALUES ($1, $2)',
      [produit, quantite]
    );
    console.log('✅ DB ok');

    res.status(200).json({ message: 'Commande envoyée !' });
  } catch (err) {
    console.error('❌ ERREUR SERVER:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

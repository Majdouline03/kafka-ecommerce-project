// simulate100.js
const axios = require('axios');

async function run() {
  for (let i = 0; i < 100; i++) {
    await axios.post('http://localhost:4000/commandes', {
      produit: ['Café', 'Thé', 'Chocolat'][Math.floor(Math.random() * 3)],
      quantite: Math.floor(Math.random() * 5) + 1,
      email: `test${i}@test.com`
    });
    console.log(`Commande ${i + 1} envoyée`);
  }
}

run();

const express = require('express');
const app = express();
const PORT = 3000;
app.get('/', (req, res) => {
    res.json({ message: 'hello' });
  });
  
app.get('/test', (req, res) => {
    res.json({ message: 'Je suis la route 2!' });
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

  

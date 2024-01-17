const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.json({ message: 'hello' });
  });
  
app.get('/test', (req, res) => {
    res.json({ message: 'Je suis la route 2!' });
  });
  

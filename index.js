const express = require('express');
const app = express();
const PORT = 3000;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "API avec Swagger",
      version: "1.0.0",
      description: "Documentation de l'API utilisant Swagger",
    },
  },
  apis: ["index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log(swaggerDocs);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/***** Middleware pour logger la date de la requête */
app.use((req, res, next) => {
  const event = new Date();
  console.log('AUTH TIME:', event.toString());
  next();
});

/***** Middleware pour gérer l'authentification par clé d'API */

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['api-key'];

  if (apiKey && apiKey === 'votre_api_key_secrete') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Appliquer le middleware uniquement aux routes nécessitant une clé d'API
app.use('/api', apiKeyMiddleware);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Renvoie un message de bienvenue
 *     responses:
 *       200:
 *         description: Message de bienvenue
 *         content:
 *           application/json:
 *             example:
 *               message: hello
 */

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Renvoie une liste d'objets
 *     responses:
 *       200:
 *         description: Liste d'objets
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 title: Ecole241
 */

app.get('/api', (req, res) => {
  res.send([{
    id: 1,
    title: "Ecole241"
  }]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

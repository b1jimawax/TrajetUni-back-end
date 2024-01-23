const express = require('express');
const app = express();
const PORT = 3000;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/***** Middleware pour logger la date de la requête */
app.use((req, res, next) => {
  const event = new Date();
  console.log('AUTH TIME:', event.toString());
  next();
});

/***** Middleware pour gérer l'authentification par clé d'API */
const dotenv = require('dotenv');
dotenv.config();

const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.headers['api-key'];
  const expectedApiKey = process.env.API_KEY;

  if (apiKey && apiKey === expectedApiKey) {
    next();
  } else {
    res.status(401).json({ erreur: 'Non autorisé' });
  }
};

// Appliquer le middleware uniquement aux routes nécessitant une clé d'API
app.use(apiKeyMiddleware);

// Middleware pour parser le corps de la requête en JSON


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
 *     summary: Renvoie une liste d'objets depuis la base de données
 *     responses:
 *       200:
 *         description: Liste d'objets
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 title: Ecole241
 */

app.get('/api', async (req, res) => {
  try {
    const passagers = await prisma.passager.findMany();
    res.json(passagers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: 'Erreur lors de la récupération des passagers depuis la base de données' });
  }
});

/**
 * @swagger
 * /api/passager:
 *   get:
 *     summary: Récupère la liste des passagers enregistrés
 *     responses:
 *       200:
 *         description: Liste des passagers
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 nom_passager: Mounguengui
 *                 prenom_passager: Lucette
 *                 numero_de_telephone: 076328520
 *                 mot_de_passe: luce1219
 *                 photo_passager: image
 *               - id: 2
 *                 nom_passager: Hondji
 *                 prenom_passager: Desire
 *                 numero_de_telephone: 065412502
 *                 mot_de_passe: 1245
 *                 photo_passager: image.jpg
 */

app.get('/api/passager', async (req, res) => {
  try {
    const passagers = await prisma.passager.findMany();
    res.json(passagers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: 'Erreur lors de la récupération des passagers depuis la base de données' });
  }
});

/**
 * @swagger
 * /api/passager:
 *   post:
 *     summary: Crée un nouveau passager
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_passager:
 *                 type: string
 *               prenom_passager:
 *                 type: string
 *               numero_de_telephone:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *               photo_passager:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nouveau passager créé
 *         content:
 *           application/json:
 *             example:
 *               id: 10
 *               nom_passager: MBA ALLOGO
 *               prenom_passager: benjamin
 *               numero_de_telephone: 066948438
 *               mot_de_passe: 1234
 *               photo_passager: image.jpg
 */

app.post('/api/passager', apiKeyMiddleware, async (req, res) => {
  try {
    console.log('Requête POST reçue');
    console.log('Corps de la requête :', req.body); // Ajoutez cette ligne pour voir le contenu du corps de la requête

    const { nom_passager, prenom_passager, numero_de_telephone, mot_de_passe, photo_passager } = req.body;
    console.log('Données reçues :', { nom_passager, prenom_passager, numero_de_telephone, mot_de_passe, photo_passager }); // Ajoutez cette ligne pour voir les données extraites

    const newPassager = await prisma.passager.create({
      data: {
        nom_passager,
        prenom_passager,
        numero_de_telephone,
        mot_de_passe,
        photo_passager,
      },
    });

    console.log('Nouveau passager créé :', newPassager);
    res.json(newPassager);
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({ erreur: 'Erreur lors de la création du passager dans la base de données' });
  }
});


app.listen(PORT, () => {
  console.log(`Le serveur s'exécute sur le port ${PORT}`);
});

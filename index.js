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

/**
 * @swagger
 * /api/passager/{id}:
 *   put:
 *     summary: Met à jour un passager existant
 *     responses:
 *       200:
 *         description: Passager mis à jour
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

app.put('/api/passager/:id', apiKeyMiddleware, async (req, res) => {
  try {
    const passagerId = parseInt(req.params.id, 10); // Obtenez l'ID du passager à partir des paramètres de l'URL
    console.log('Requête PUT reçue');
    console.log('Corps de la requête :', req.body);

    const { nom_passager, prenom_passager, numero_de_telephone, mot_de_passe, photo_passager } = req.body;
    console.log('Données reçues :', { nom_passager, prenom_passager, numero_de_telephone, mot_de_passe, photo_passager });

    const updatedPassager = await prisma.passager.update({
      where: { id_passager: passagerId }, // Spécifiez l'ID du passager que vous souhaitez mettre à jour
      data: {
        nom_passager,
        prenom_passager,
        numero_de_telephone,
        mot_de_passe,
        photo_passager,
      },
    });

    console.log('Passager mis à jour :', updatedPassager);
    res.json(updatedPassager);
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({ erreur: 'Erreur lors de la mise à jour du passager dans la base de données' });
  }
});

/**
 * @swagger
 * /api/passager/{id}:
 *   delete:
 *     summary: Supprime un passager existant
 *     responses:
 *       200:
 *         description: Passager supprimé
 *         content:
 *           application/json:
 *             example:
 *               message: Passager supprimé avec succès
 */

app.delete('/api/passager/:id', apiKeyMiddleware, async (req, res) => {
  try {
    const passagerId = parseInt(req.params.id, 10); // Obtenez l'ID du passager à partir des paramètres de l'URL
    console.log('Requête DELETE reçue');

    const deletedPassager = await prisma.passager.delete({
      where: { id_passager: passagerId }, // Spécifiez l'ID du passager que vous souhaitez supprimer
    });

    console.log('Passager supprimé :', deletedPassager);
    res.json({ message: 'Passager supprimé avec succès' });
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({ erreur: 'Erreur lors de la suppression du passager dans la base de données' });
  }
});

//je suis entrain de faire les route  du conducteur 
/**
 * @swagger
 * /api/conducteur:
 *   get:
 *     summary: Récupère la liste des conducteur enregistrés
 *     responses:
 *       200:
 *         description: Liste des Conducteur
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 nom_conducteur: Lengouba
 *                 prenom_conducteur: calin
 *                 numero_de_telephone: +241 74 52 98 05
 *                 modele_du_vehicule: AB 502  
 *                 nombre_de_place_disponible: 4
 *                 photo_conducteur: image.jpg
 *                 photo_du_permis_de_conduire: img.jpg
 *                 carte_crise_et_d_assurance: ABht124
 */


app.get('/api/conducteur', async (req, res) => {
  try {
    const conducteur = await prisma.conducteur.findMany();
    res.json(conducteur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: 'Erreur lors de la récupération des passagers depuis la base de données' });
  }
});

//je fais la route post qui va me permettre d'ajouter un conducteur 

/**
 * @swagger
 * /api/conducteur:
 *   post:
 *     summary: Crée un nouveau conducteur
 *     responses:
 *       200:
 *         description: Conducteur créé avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               nom_conducteur: Lengouba
 *               prenom_conducteur: Calin
 *               numero_de_telephone: +241 74 52 98 05
 *               modele_du_vehicule: AB 502  
 *               nombre_de_place_disponible: 4
 *               photo_conducteur: image.jpg
 *               photo_du_permis_de_conduire: img.jpg
 *               carte_crise_et_d_assurance: ABht124
 */



app.post('/api/conducteur', apiKeyMiddleware, async (req, res) => {
  try {
    console.log('Requête POST reçue');
    console.log('Corps de la requête :', req.body);

    const { nom_conducteur, prenom_conducteur, numero_de_telephone, modele_du_vehicule, nombre_de_place_disponible, photo_conducteur, photo_du_permis_de_conduire, carte_crise_et_d_assurance } = req.body;

    console.log('Données reçues :', { nom_conducteur, prenom_conducteur, numero_de_telephone, modele_du_vehicule, nombre_de_place_disponible, photo_conducteur, photo_du_permis_de_conduire, carte_crise_et_d_assurance });

    const newConducteur = await prisma.conducteur.create({
      data: {
        nom_conducteur,
        prenom_conducteur,
        numero_de_telephone,
        modele_du_vehicule,
        nombre_de_place_disponible,
        photo_conducteur,
        photo_du_permis_de_conduire, // Utilisez le même nom ici
        carte_crise_et_d_assurance,
      },
    });

    console.log('Nouveau conducteur créé :', newConducteur);
    res.json(newConducteur);
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({ erreur: 'Erreur lors de la création du conducteur dans la base de données' });
  }
});

//je fais la route pour faire la mise à jour 

/**
 * @swagger
 * /api/conducteur/{id}:
 *   put:
 *     summary: Met à jour un conducteur existant
 *     responses:
 *       200:
 *         description: Conducteur mis à jour avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               nom_conducteur: Lengouba
 *               prenom_conducteur: Calin
 *               numero_de_telephone: +241 74 52 98 05
 *               modele_du_vehicule: AB 502  
 *               nombre_de_place_disponible: 4
 *               photo_conducteur: image.jpg
 *               photo_du_permis_de_conduire: img.jpg
 *               carte_crise_et_d_assurance: ABht124
 */


app.put('/api/conducteur/:id', apiKeyMiddleware, async (req, res) => {
  try {
    const conducteurId = parseInt(req.params.id, 10); // Obtenez l'ID du passager à partir des paramètres de l'URL
    console.log('Requête PUT reçue');
    console.log('Corps de la requête :', req.body);

    const {nom_conducteur, prenom_conducteur, numero_de_telephone, modele_du_vehicule, nombre_de_place_disponible, photo_conducteur, photo_du_permis_de_conduire, carte_crise_et_d_assurance } = req.body;
    console.log('Données reçues :', { nom_conducteur, prenom_conducteur, numero_de_telephone, modele_du_vehicule, nombre_de_place_disponible, photo_conducteur, photo_du_permis_de_conduire, carte_crise_et_d_assurance});

    const updatedConducteur = await prisma.conducteur.update({
      where: { id_conducteur: conducteurId }, // Spécifiez l'ID du passager que vous souhaitez mettre à jour
      data: {
        nom_conducteur,
        prenom_conducteur,
        numero_de_telephone,
        modele_du_vehicule,
        nombre_de_place_disponible,
        photo_conducteur,
        photo_du_permis_de_conduire, // Utilisez le même nom ici
        carte_crise_et_d_assurance,
      },
    });

    console.log('Conducteur mis à jour :', updatedConducteur);
    res.json(updatedConducteur);
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({ erreur: 'Erreur lors de la mise à jour du conducteur dans la base de données' });
  }
});

//je supprime un utilisateur 

/**
 * @swagger
 * /api/conducteur/{id}:
 *   delete:
 *     summary: Supprime un conducteur existant
 *     responses:
 *       200:
 *         description: Conducteur supprimé avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: Conducteur supprimé avec succès
 */

app.delete('/api/conducteur/:id', apiKeyMiddleware, async (req, res) => {
  try {
    const conducteurId = parseInt(req.params.id, 10); // Obtenez l'ID du conducteur à partir des paramètres de l'URL
    console.log('Requête DELETE reçue');

    const deletedConducteur = await prisma.conducteur.delete({
      where: { id_conducteur: conducteurId }, // Spécifiez l'ID du conducteur que vous souhaitez supprimer
    });

    console.log('conducteur supprimé :', deletedConducteur);
    res.json({ message: 'conducteur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({ erreur: 'Erreur lors de la suppression du conducteur dans la base de données' });
  }
});



//les routes de la table réservation



app.get('/api/reservation', async (req, res) => {
  try {
    const reservation = await prisma.reservation.findMany();
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: 'Erreur lors de la récupération des reservations depuis la base de données' });
  }
});


app.post('/api/reservation', apiKeyMiddleware, async (req, res) => {
  try {
    console.log('Requête POST reçue');
    console.log('Corps de la requête :', req.body);

    const { id_trajet, id_passager, passager, trajet, status } = req.body;
    console.log('Données reçues :', { id_trajet, id_passager, passager, trajet, status });

    const newReservaton = await prisma.reservation.create({
      data: {
        id_de_reservation: undefined,
        id_trajet: parseInt(id_trajet, 10), // Convertir en entier
        id_passager,
        passager,
        trajet,
        status,
      },
    });

    console.log('Nouvelle réservation créée :', newReservaton);
    res.json(newReservaton);
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({ erreur: 'Erreur lors de la création de la réservation dans la base de données' });
  }
});





app.get('/api/trajet', async (req, res) => {
  try {
    const trajet = await prisma.trajet.findMany();
    res.json(trajet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: 'Erreur lors de la récupération des trajets depuis la base de données' });
  }
});

app.post('/api/trajet', apiKeyMiddleware, async (req, res) => {
  try {
    console.log('Requête POST reçue');
    console.log('Corps de la requête :', req.body);

    const {  id_du_conducteur, destination_d_arrivee, destination_depart,heure_de_depart, heure_d_arrivee, prix_du_trajet, conducteur, reservations     } = req.body;

    console.log('Données reçues :', {  id_du_conducteur, destination_d_arrivee, destination_depart,heure_de_depart, heure_d_arrivee, prix_du_trajet, conducteur, reservations     });

    const newTrajet = await prisma.trajet.create({
      data: { id_du_conducteur: parseInt(id_du_conducteur), destination_d_arrivee, destination_depart,heure_de_depart, heure_d_arrivee, prix_du_trajet, conducteur, reservations },
    });

    console.log('Nouveau trajet créé :', newTrajet);
    res.json(newTrajet);
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({ erreur: 'Erreur lors de la création du conducteur dans la base de données' });
  }
});




app.listen(PORT, () => {
  console.log(`Le serveur s'exécute sur le port ${PORT}`);
});



import express from 'express'; // Importar Express
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Crear una instància de l'aplicació Express
const PORT = 3000; // Definir el port del servidor

// Utilitzem JSON com a format per defecte
app.use(express.json());

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UserHub API',
      version: '1.0.0',
      description: `📘 **Documentació de l'API UserHub**

  Aquesta API senzilla permet gestionar usuaris amb operacions CRUD:

  - 🔍 Llistar usuaris (\`GET /usuaris\`)

  - ➕ Crear un usuari (\`POST /usuaris\`)

  - ✏️ Actualitzar un usuari (\`PUT /usuaris/{id}\`)

  - ❌ Esborrar un usuari (\`DELETE /usuaris/{id}\`)

  També inclou una ruta bàsica (\`GET /\`) que mostra un missatge HTML de benvinguda.

  👉 Consulta cada endpoint per veure exemples i paràmetres disponibles.`,
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
  },
  apis: [path.join(__dirname, 'index.js')], // ubicació de les rutes (usa * quan estiguin separades en varis fitxers)
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Simulació de dades en memòria
let usuaris = [
  { id: 1, nom: 'Joan', edat: 30 },
  { id: 2, nom: 'Maria', edat: 25 }
];

/**
 * @swagger
 * /:
 *   get:
 *     summary: Pàgina principal
 *     description: | 
 *       Ruta bàsica. 
 *       Mostra un missatge HTML amb el títol de l'aplicació.
 * 
 *       Exemple URL: [/](http://localhost:3000/)  
 *     responses:
 *       200:
 *         description: HTML amb títol de l'aplicació.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: <h1>APLICACIÓ PER LA GESTIÓ D'USUARIS</h1>
 */
app.get('/', (_req, res) => {
  res.send('<h1>APLICACIÓ PER LA GESTIÓ D\'USUARIS</h1>'); // Resposta a la petició a la ruta /
});

/**
 * @swagger
 * /usuaris:
 *   get:
 *     summary: Obté una llista d'usuaris
 *     description: | 
 *       GET /usuaris - Retorna tots els usuaris o els filtra per nom i edat amb paràmetres de query.
 * 
 *       Exemple URLs:
 * 
 *       [/usuaris](http://localhost:3000/usuaris)  
 *       [/usuaris?nom=Maria&edat=25](http://localhost:3000/usuaris?nom=Maria&edat=25)
 *     parameters:
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *         description: Filtra per nom de l'usuari
 *       - in: query
 *         name: edat
 *         schema:
 *           type: integer
 *         description: Filtra per edat de l'usuari
 *     responses:
 *       200:
 *         description: Llista d'usuaris trobats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuari'
 *       404:
 *         description: Cap usuari trobat
 */
app.get('/usuaris', (req, res) => {
  const { nom, edat } = req.query;

  // Si no hi ha cap filtre, retorna tots els usuaris
  if (!nom && !edat) {
    return res.json(usuaris);
  }

  // Filtra segons nom i edat si s'han proporcionat
  const resultats = usuaris.filter(u => 
    (!nom || u.nom === nom) && 
    (!edat || u.edat === parseInt(edat))
  );
  resultats.length ? res.json(resultats) : res.status(404).send('Cap usuari trobat');
});

/**
 * @swagger
 * /usuaris/{id}:
 *   get:
 *     summary: Obté un usuari per ID
 *     description: |
 *       GET /usuaris/:id - Retorna l'usuari amb l'ID especificat via paràmetres de ruta.
 *
 *       Exemple URL: [/usuaris/2](http://localhost:3000/usuaris/2)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'usuari
 *     responses:
 *       200:
 *         description: Usuari trobat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuari'
 *       404:
 *         description: Usuari no trobat
 */
app.get('/usuaris/:id', (req, res) => {
  const usuari = usuaris.find(u => u.id === parseInt(req.params.id));
  if (usuari) {
    res.json(usuari);
  } else {
    res.status(404).send('Usuari no trobat');
  }
});

/**
 * @swagger
 * /usuaris:
 *   post:
 *     summary: Crea un nou usuari
 *     description: |
 *       POST /usuaris - Afegeix un nou usuari amb nom i edat.
 *
 *       Exemple JSON:
 *       {
 *         "nom": "Ramon",
 *         "edat": 50
 *       }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuariInput'
 *     responses:
 *       201:
 *         description: Usuari creat correctament
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuari'
 */
app.post('/usuaris', (req, res) => {
  const nouUsuari = {
    id: usuaris.length + 1,
    nom: req.body.nom,
    edat: req.body.edat
  };
  usuaris.push(nouUsuari);
  res.status(201).json(nouUsuari);
});

/**
 * @swagger
 * /usuaris/{id}:
 *   put:
 *     summary: Actualitza un usuari per ID
 *     description: |
 *       PUT /usuaris/:id - Actualitza el nom i l'edat de l'usuari amb l'ID especificat.
 * 
 *       Exemple JSON:
 *       {
 *         "edat": 100
 *       }
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'usuari
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuariInput'
 *     responses:
 *       200:
 *         description: Usuari actualitzat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuari'
 *       404:
 *         description: Usuari no trobat
 */
app.put('/usuaris/:id', (req, res) => {
  const usuari = usuaris.find(u => u.id === parseInt(req.params.id));
  if (usuari) {
    usuari.nom = req.body.nom;
    usuari.edat = req.body.edat;
    res.json(usuari);
  } else {
    res.status(404).send('Usuari no trobat');
  }
});

/**
 * @swagger
 * /usuaris/{id}:
 *   delete:
 *     summary: Esborra un usuari per ID
 *     description: |
 *       DELETE /usuaris/:id - Esborra l'usuari amb l'ID especificat.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'usuari
 *     responses:
 *       200:
 *         description: Usuari esborrat correctament
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Usuari 2 esborrat
 *       404:
 *         description: Usuari no trobat
 */
app.delete('/usuaris/:id', (req, res) => {
  const index = usuaris.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    usuaris.splice(index, 1);
    res.status(200).send('Usuari ' + req.params.id + ' esborrat');
  } else {
    res.status(404).send('Usuari no trobat');
  }
});

// Afegim _ a la variable per indicar que no s'utilitza, 
// no la podem eliminar, Express requereix que els middleware mantinguin la seva signatura completa 
// (req, res, next) també funciona correctament, però no es fan servir tots els paràmetres.
app.use((_req, res, _next) => {
  res.status(404).send('Ruta no trobada!');
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Hi ha hagut un error!');
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor API REST en funcionament a http://localhost:${PORT}`);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuari:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         nom:
 *           type: string
 *           example: "Maria"
 *         edat:
 *           type: integer
 *           example: 25
 *     UsuariInput:
 *       type: object
 *       required:
 *         - nom
 *         - edat
 *       properties:
 *         nom:
 *           type: string
 *           example: "Ramon"
 *         edat:
 *           type: integer
 *           example: 50
 */

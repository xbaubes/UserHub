import express from 'express'; // Importar Express
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';

const app = express(); // Crear una instància de l'aplicació Express
const PORT = 3000; // Definir el port del servidor

// Utilitzem JSON com a format per defecte
app.use(express.json());

// Carregar documentació Swagger des de fitxer extern
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Simulació de dades en memòria
let usuaris = [
  { id: 1, nom: 'Joan', alcada: 175 },
  { id: 2, nom: 'Maria', alcada: 160 }
];

app.get('/', (_req, res) => {
  res.send('<h1>APLICACIÓ PER LA GESTIÓ D\'USUARIS</h1>'); // Resposta a la petició a la ruta /
});

// curl "http://localhost:3000/usuaris?alcada=160"
app.get('/usuaris', (req, res) => {
  const { nom, alcada } = req.query;

  // Si no hi ha cap filtre, retorna tots els usuaris
  if (!nom && !alcada) {
    return res.json(usuaris);
  }

  // Filtra segons nom i alcada si s'han proporcionat
  const resultats = usuaris.filter(u => 
    (!nom || u.nom === nom) && 
    (!alcada || u.alcada === parseInt(alcada))
  );
  resultats.length ? res.json(resultats) : res.status(404).send('Cap usuari trobat');
});

app.get('/usuaris/:id', (req, res) => {
  const usuari = usuaris.find(u => u.id === parseInt(req.params.id));
  if (usuari) {
    res.json(usuari);
  } else {
    res.status(404).send('Usuari no trobat');
  }
});

/*
  curl -X POST http://localhost:3000/usuaris \
  -H "Content-Type: application/json" \
  -d '{"nom": "Ramon", "alcada": 180}'
*/
app.post('/usuaris', (req, res) => {
  const nouUsuari = {
    id: usuaris.length + 1,
    nom: req.body.nom,
    alcada: req.body.alcada
  };
  usuaris.push(nouUsuari);
  res.status(201).json(nouUsuari);
});

/*
  curl -X PUT http://localhost:3000/usuaris/1 \
  -H "Content-Type: application/json" \
  -d '{"nom": "Joan Actualitzat", "alcada": 178}'
*/
app.put('/usuaris/:id', (req, res) => {
  const usuari = usuaris.find(u => u.id === parseInt(req.params.id));
  if (usuari) {
    usuari.nom = req.body.nom;
    usuari.alcada = req.body.alcada;
    res.json(usuari);
  } else {
    res.status(404).send('Usuari no trobat');
  }
});

// curl -X DELETE http://localhost:3000/usuaris/2
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

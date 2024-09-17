/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import hogan from 'hogan-express';
import swaggerJSDocs from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Initializing Express...');
const app = express();
app.engine('html', hogan);

app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json({
  type: 'application/*+json',
}));

app.disable('x-powered-by');

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Partheno API',
      version: '1.0.0',
      description: 'Partheno API',
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./*.js'],
};

console.log('Build swagger api...');
const specs = swaggerJSDocs(options);

const bookmarkPath = './data/store/bookmarks.json';
const patternPath = './data/store/patterns.json';

/**
 * ROUTING
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(`${__dirname}/dist`));

console.log('Expose routes...');

/**
 * @swagger
 * tags:
 *   name: Patterns
 *   description: patterns
*/

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: bookmarks
*/

/**
 * @swagger
 * /:
 *    get:
 *      description: Render homepage.
 *      responses:
 *          '200':
 *              description: homepage
 */
app.get('/', (req, res) => {
  res.render('index');
});

/**
 * @swagger
 * /patterns:
 *    get:
 *      description: Get patterns
 *      tags: [Patterns]
 *      produces:
 *           - application/json
 *      responses:
 *          '200':
 *              description: List of patterns.
 */
app.get('/patterns', async (req, res, next) => {
  const patternsDataset = fs.readFile(patternPath, 'utf8', (err, contents) => {
    const json = JSON.parse(contents);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.json(json);
  });
});

/**
 * @swagger
 * /patterns/{id}:
 *    get:
 *      description: Use to return your a pattern with an id.
 *      tags: [Patterns]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *      produces:
 *           - application/json
 *      responses:
 *          '200':
 *              description: A successful response pattern.
 *
 */
app.get('/patterns/:id', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  const val = patternsDataset[req.params.id];
  if (req.params.id !== '') {
    if (val !== null) {
      res.json(val);
    }
    res.sendStatus(404);
  }
});

/**
 * @swagger
 * /bookmarks:
 *    get:
 *      description: Get bookmarks
 *      tags: [Bookmarks]
 *      produces:
 *           - application/json
 *      responses:
 *          '200':
 *              description: List of bookmarks.
 */
app.get('/bookmarks', async (req, res, next) => {
  const bookmarksDataset = fs.readFile(bookmarkPath, 'utf8', (err, contents) => {
    const json = JSON.parse(contents);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.json(json);
  });
});

/**
 * @swagger
 * /bookmarks-deletes:
 *    post:
 *      description: Delete bookmarks
 *      tags: [Bookmarks]
 *      produces:
 *           - application/json
 *      responses:
 *          '200':
 *              description: Ok or Nok.
 */
app.post('/bookmarks-deletes', (req, res) => {
  fs.readFile(bookmarkPath, () => {
    fs.writeFile(bookmarkPath, '[]', (err) => {
      if (err) throw err;
      res.status(200).json({ status: 'ok' });
    });
  });
});

/**
 * @swagger
 * /bookmarks-deletes:
 *    get:
 *      description: Delete bookmarks
 *      tags: [Bookmarks]
 *      produces:
 *           - application/json
 *      responses:
 *          '200':
 *              description: Ok or Nok.
 */
app.get('/bookmarks-deletes', (req, res) => {
  fs.readFile(bookmarkPath, (err) => {
    fs.writeFile(bookmarkPath, '[]', () => {
      if (err) throw err;
      res.status(200).json({ status: 'ok' });
    });
  });
});

// POST method route

/**
 * @swagger
 * /bookmarks:
 *    post:
 *      description: Write bookmark
 *      tags: [Bookmarks]
 *      produces:
 *           - application/json
 *      responses:
 *          '200':
 *              description: Ok or Nok.
 */
app.post('/bookmarks', bodyParser.json(), (req, res) => {
  fs.readFile(bookmarkPath, (err, data) => {
    const json = JSON.parse(data);

    json.push(req.body);

    fs.writeFile(bookmarkPath, JSON.stringify(json), () => {
      if (err) throw err;
      res.status(200).json({ status: 'ok' });
    });
  });
});


const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';

console.log('Expose swagger api...');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ---Start listening
app.listen(port);

console.log(`Partheno server has started on port: ${port} on ${env} env!`);

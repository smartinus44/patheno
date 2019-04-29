// ExpressJS
console.log('Initializing Express...');
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.engine('html', require('hogan-express'));
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json({
    type: 'application/*+json'
}));

app.disable('x-powered-by');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

let bookmarkPath = './src/bookmarks.json';

/**
 * ROUTING
 */
app.use(express.static(__dirname + '/dist'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/patterns', (req, res, next) => {
    let _patterns_dataset = fs.readFile('./src/dataset.json', 'utf8', (err, contents) => {
        let json = JSON.parse(contents);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.json(json);
    });
});

app.get('/patterns/:id', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    let val = _patterns_dataset[req.params.id];
    if (req.params.id !== '') {
        if (val !== null) {
            res.json(val);
        }
        res.sendStatus(404)
    }
});


app.get('/bookmarks', (req, res, next) => {
    let _bookmarks_dataset = fs.readFile(bookmarkPath, 'utf8', (err, contents) => {
        let json = JSON.parse(contents);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.json(json);
    });
});


// POST method route
app.post('/bookmarks', bodyParser.json(), (req, res) => {

    fs.readFile(bookmarkPath, (err, data) => {
        let json = JSON.parse(data);

        if (json.length > 18) {
            json = [];
        }

        json.push(req.body);

        fs.writeFile(bookmarkPath, JSON.stringify(json), (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
            res.redirect('/');
        });
    });
});

//---Start listening
const port = process.env.PORT || 8080;
app.listen(port);

const routes = app._router.stack
    .filter((middleware) => middleware.route)
    .map((middleware) => `${Object.keys(middleware.route.methods).join(', ').toUpperCase()} -> ${middleware.route.path}`);

console.log(JSON.stringify(routes, null, 4));

//  ${Object.keys(ret.methods).join(', ')} ${ret.path}
console.log('Partheno server has started on port: ' + port + '!');
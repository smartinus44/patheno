//---ExpressJS
console.log('Initializing Express...');
const express = require('express');
const path = require('path');
const app = express();

app.disable('x-powered-by');

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.use(express.static(__dirname + '/dist' ));


let _patterns_dataset = require('./src/dataset.json');

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/dist/index.html')));

app.get('/patterns', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.json(_patterns_dataset);
});

app.get('/patterns/:id', function (req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	let val = _patterns_dataset[req.params.id];
	if (req.params.id !== '') {
		if (val !== null) {
			res.json(val); 
		}
		res.sendStatus(404)
	}

});

//---Start listening
const port = process.env.PORT || 8081;
app.listen(port);

const routes = app._router.stack
	.filter((middleware) => middleware.route)
	.map((middleware) => `${Object.keys(middleware.route.methods).join(', ').toUpperCase()} -> ${middleware.route.path}`);

console.log(JSON.stringify(routes, null, 4));

//  ${Object.keys(ret.methods).join(', ')} ${ret.path}
console.log('Partheno server  started on port: '+port);
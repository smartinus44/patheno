//---ExpressJS
console.log('Initializing Express...')const express = require('express');
const app = express();
app.disable('x-powered-by');

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

let _patterns_dataset = require('./src/dataset.json');

app.get('/', (req, res) => res.send('Hello home !'));

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

//app.listen(3000, () => console.log('Partheno server listening on port 3000!'));


//---Start listening
var port = 80;
app.listen(port);
console.log('Partheno server  started on port: '+port);
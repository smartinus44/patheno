const express = require('express')
const app = express()
app.disable('x-powered-by');

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

var _patterns_dataset = [
  {
          'background': [
            "images/dataset/1/bubimga.jpg",
            "images/dataset/1/teck.jpg",
            "images/dataset/1/sycomore.jpg",
            "images/dataset/1/etre.jpg",
          ],
          'triangles': [
            "images/dataset/1/eucalyptus.jpg",
            "images/dataset/1/chene.jpg",
            "images/dataset/1/aniegré.jpg",
            "images/dataset/1/merisier.jpg",
            "images/dataset/1/noyer.jpg",
          ]
  },
  {
    'background': [
      "images/dataset/2/FreneJapon.jpg",
      "images/dataset/2/ErableUS.jpg",
      "images/dataset/2/Sycomore.jpg",
      "images/dataset/2/cheneLargeVanille.jpg",
    ],
    'triangles': [
      "images/dataset/2/Poirier.jpg",
      "images/dataset/2/Citronnier.jpg",
      "images/dataset/2/Cypres.jpg",
      "images/dataset/2/EtreBlanc.jpg",
      "images/dataset/2/MerisierDeFrance.jpg"
    ]
  },
  {
    'background': [
      "images/dataset/3/Frene.jpg",
      "images/dataset/3/Erable.jpg",
      "images/dataset/3/Sycomore.jpg",
      "images/dataset/3/Chene.jpg",
    ],
    'triangles': [
      "images/dataset/3/Poirier.jpg",
      "images/dataset/3/Citronnier.jpg",
      "images/dataset/3/Cypres.jpg",
      "images/dataset/3/Etre.jpg",
      "images/dataset/3/Merisier.jpg"
    ]
  }
];

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/patterns', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.json(_patterns_dataset);
});

app.get('/patterns/:id', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var val = _patterns_dataset[req.params.id];
    if (req.params.id != '') {
      if(val != null) {
        res.json(val);
      }
      res.sendStatus(404)
    }
    
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

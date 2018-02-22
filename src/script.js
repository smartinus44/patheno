import _ from 'lodash';
import 'bootstrap';
import '../scss/_custom.scss';
import dat from '../node_modules/dat.gui/build/dat.gui.js'

// Initialisation d'un marque page.
let BookMark = {
	// Travail avec des textures.
	patterns: ["ErableUS", "Poirier", "Sycomore", "EtreBlanc", "Citronnier", "cheneLargeVanille", "Cypres", "FreneJapon"],
	images: []
};

let Params = function (_height, _width, _background, _numberOfpairs, _evenPattern, _oddPattern, _equilateral, _showStrokes) {
	this.height = _height;
	this.width = _width;
	this.color = _background;
	this.numberOfPairOfTriangles = _numberOfpairs;
	this.triangleEvenPattern = _evenPattern;
	this.triangleOddPattern = _oddPattern;
	this.equilateral = _equilateral;
	this.showStrokes = _showStrokes;
};

/**
 * Initialise le fond.
 * @param el_canvas
 * @param el_ctx
 * @param el
 */
BookMark.setBackgroundPattern = function (el_canvas, el_ctx, el) {
	el_ctx.fillStyle = BookMark.images[el];
	el_ctx.fillRect(0, 0, el_canvas.width, el_canvas.height);
};

BookMark.init = function () {

	let gui = new dat.GUI({load: JSON});
	gui.useLocalStorage = true;
	gui.width = 380;

	let number_of_layer = 3;

	for (let i = 1; i <= number_of_layer; i++) {

		// Créé un lien de téléchargement de l'image liée au canvas.
		let link = document.createElement('a');
		link.innerHTML = 'Télécharger l\'image';
		link.className = "btn btn-dark";
		link.href = "#";
		link.role = "button";
		link.addEventListener('click', function (ev) {
			link.href = el_canvas.toDataURL();
			link.download = "bookmark.jpg";
		}, false);
		let zone = document.getElementById("zone-" + i);
		zone.appendChild(link);
		zone.appendChild(document.createElement('br'));
		zone.appendChild(document.createElement('br'));

		let params = new Params((200 * i), (100 * i), "ErableUS", i, "Poirier", "Sycomore", false, false);

		let el_canvas = this.createCanvas('canva-' + i, 'zone-' + i, params);
		let el_ctx = el_canvas.getContext('2d');
		BookMark.initPatterns(el_ctx);

		let folder = gui.addFolder('Example ' + i);
		let numberOfPairOfTriangles = 3;
		let equilateral = false;

		/**
		 * Dessine le canvas avec le nombre de paire de triangle voulues.
		 * @param el
		 */
		BookMark.redrawNumberOfTriangles = function (el) {
			BookMark.clearCanvas(el_ctx);
			numberOfPairOfTriangles = el;
			BookMark.setBackgroundPattern(el_canvas, el_ctx, params.color);
			BookMark.drawTriangles(el_canvas, el_ctx, el, equilateral, params);
		};

		BookMark.redrawHeight = function (el) {
			el_canvas.height = el;
			BookMark.setBackgroundPattern(el_canvas, el_ctx, params.color);
			BookMark.drawTriangles(el_canvas, el_ctx, numberOfPairOfTriangles, equilateral, params);
		};

		BookMark.redrawWidth = function (el) {
			el_canvas.width = el;
			BookMark.setBackgroundPattern(el_canvas, el_ctx, params.color);
			BookMark.drawTriangles(el_canvas, el_ctx, numberOfPairOfTriangles, equilateral, params);
		};

		BookMark.redrawTriangleEvenPattern = function (el) {
			el_canvas.colorTriangleEven = el;
			BookMark.setBackgroundPattern(el_canvas, el_ctx, params.color);
			BookMark.drawTriangles(el_canvas, el_ctx, numberOfPairOfTriangles, equilateral, params);
		};

		BookMark.redrawTriangleOddPattern = function (el) {
			el_canvas.colorTriangleOdd = el;
			BookMark.setBackgroundPattern(el_canvas, el_ctx, params.color);
			BookMark.drawTriangles(el_canvas, el_ctx, numberOfPairOfTriangles, equilateral, params);
		};

		BookMark.redrawStrokes = function (el) {
			el_canvas.showStrokes = el;
			BookMark.clearCanvas(el_ctx);
			BookMark.setBackgroundPattern(el_canvas, el_ctx, params.color);
			BookMark.drawTriangles(el_canvas, el_ctx, numberOfPairOfTriangles, equilateral, params);
		};

		BookMark.redrawEquilateral = function (el) {
			BookMark.clearCanvas(el_ctx);
			el_canvas.height = 600;
			BookMark.setBackgroundPattern(el_canvas, el_ctx, params.color);
			BookMark.drawTriangles(el_canvas, el_ctx, numberOfPairOfTriangles, el, params);

		};

		BookMark.redrawBackgroundPattern = function (el) {
			el_ctx.fillStyle = BookMark.images[el];
			el_ctx.fillRect(0, 0, el_canvas.width, el_canvas.height);
			BookMark.drawTriangles(el_canvas, el_ctx, numberOfPairOfTriangles, equilateral, params);
		};

		folder.add(params, 'numberOfPairOfTriangles', 1, 15, 1).onFinishChange(BookMark.redrawNumberOfTriangles);
		folder.add(params, 'height', 100, 1000, 100).onFinishChange(BookMark.redrawHeight);
		folder.add(params, 'width', 100, 300, 100).onFinishChange(BookMark.redrawWidth);
		folder.add(params, 'color', this.patterns).onFinishChange(BookMark.redrawBackgroundPattern);
		folder.add(params, 'triangleEvenPattern', this.patterns).onFinishChange(BookMark.redrawTriangleEvenPattern);
		folder.add(params, 'triangleOddPattern', this.patterns).onFinishChange(BookMark.redrawTriangleOddPattern);
		folder.add(params, 'equilateral', true, false).onFinishChange(BookMark.redrawEquilateral);
		folder.add(params, 'showStrokes').onFinishChange(BookMark.redrawStrokes);

		// Fonction appellée lorsque toutes les images sont chargées.
		BookMark.workDone = function () {
			for (let i = 1; i <= number_of_layer; i++) {
				let el_canvas = document.getElementById('canva-' + i);
				let el_ctx = el_canvas.getContext('2d');

				// Dessine les triangles.
				BookMark.setBackgroundPattern(el_canvas, el_ctx, "ErableUS");
				BookMark.drawTriangles(el_canvas, el_ctx, numberOfPairOfTriangles, equilateral, params);
			}
		};

		// Permet d'activer la sauvegarde des paramètres dans le localstorage.
		gui.remember(params);
	}
};

/**
 * Dessine un canvas.
 * @param elementId
 * @param zoneId
 * @param params
 * @returns {Element}
 */
BookMark.createCanvas = function (elementId, zoneId, params) {

	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');

	canvas.id = elementId;
	canvas.width = params.width;
	canvas.height = params.height;
	canvas.showStrokes = params.showStrokes;

	canvas.colorTriangleEven = params.triangleEvenPattern;
	canvas.colorTriangleOdd = params.triangleOddPattern;

	let zone = document.getElementById(zoneId);
	zone.appendChild(canvas);

	this.clearCanvas(ctx);

	return canvas;
};

/**
 * Efface un canvas.
 * @param ctx
 */
BookMark.clearCanvas = function (ctx) {

	let canvas = ctx.canvas;
	let w = canvas.clientWidth;
	let h = canvas.clientHeight;
	ctx.clearRect(0, 0, w, h);
};

/**
 * Initialise les patterns on décrémente une variable lorsqu'elle est nulle on continue le chargement du canvas.
 * @param el_ctx
 */
BookMark.initPatterns = function (el_ctx) {

	let imagesLoading = BookMark.patterns.length;

	BookMark.patterns.forEach(function (pattern) {
		let image = new Image();
		image.onload = function () {
			BookMark.images[pattern] = el_ctx.createPattern(image, 'repeat');
			--imagesLoading;
			if (imagesLoading === 0) {
				BookMark.workDone();
			}
		};
		image.src = 'images/' + pattern + '.jpg';
	});
};

/**
 * Dessine les couples de triangles.
 * @param el_canvas
 * @param el_ctx
 * @param numberOfPairOfTriangles
 * @param equilateral
 */
BookMark.drawTriangles = function (el_canvas, el_ctx, numberOfPairOfTriangles, equilateral, params) {

	// Dessine chaque paire de triangle.
	for (let j = 1; j <= numberOfPairOfTriangles; j++) {

		let _width = el_canvas.width;
		let _height = el_canvas.height;
		let _half_width = _width / 2;
		let _triangle_height;

		// Cas spécifique, on veut un triangle equilatéral, on le calcul en fonction de la largeur du canvas.
		if (equilateral === true) {
			_triangle_height = Math.sqrt((Math.pow(_width, 2) + Math.pow((_half_width / 2), 2)));
			if (j === 1) {
				// Lorsque l'on redimensionne un canvas, on est obligé de redessiner le fond sinon il disparait.
				el_canvas.height = _triangle_height * numberOfPairOfTriangles * 2;
				BookMark.setBackgroundPattern(el_canvas, el_ctx, params.color);
			}
		} else {
			_triangle_height = _height / (numberOfPairOfTriangles * 2);
		}

		// Epaisseur des lignes de coupes.
		el_ctx.lineWidth = 1;

		let first_coef = 2 * (_triangle_height * j - _triangle_height);
		let second_coef = first_coef + (2 * _triangle_height);
		let third_coef = ((second_coef - _triangle_height) / j) * j;

		// Dessine une paire de triangle.
		for (let k = 1; k <= 2; k++) {
			el_ctx.beginPath();

			el_ctx.moveTo(_half_width, third_coef);

			// Dessine un triangle avec la base en haut ou en bas.
			if (k % 2 === 1) {
				el_ctx.fillStyle = BookMark.images[el_canvas.colorTriangleEven];
				el_ctx.lineTo(_width, first_coef);
				el_ctx.lineTo(0, first_coef);
			} else {
				el_ctx.fillStyle = BookMark.images[el_canvas.colorTriangleOdd];
				el_ctx.lineTo(_width, second_coef);
				el_ctx.lineTo(0, second_coef);
			}

			if (el_canvas.showStrokes === true) {
				el_ctx.strokeStyle = "#FF0000";
				el_ctx.stroke();
			}
			el_ctx.closePath();
			el_ctx.fill();
		}
	}
};

// Au chargement de la page on appelle la fonction d'initialisation.
window.onload = function () {
	BookMark.init();
};
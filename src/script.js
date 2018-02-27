import _ from 'lodash';
import 'bootstrap';
import '../scss/_custom.scss';
import dat from '../node_modules/dat.gui/build/dat.gui.js'

const NUMBER_OF_LAYERS = 3;

// Paramètres
let Params = function (_height, _width, _background, _numberOfpairs, _evenPattern, _oddPattern, _equilateral, _showStrokes, _columns_per_width) {
	this.height = _height;
	this.width = _width;
	this.color = _background;
	this.numberOfPairOfTriangles = _numberOfpairs;
	this.triangleEvenPattern = _evenPattern;
	this.triangleOddPattern = _oddPattern;
	this.equilateral = _equilateral;
	this.showStrokes = _showStrokes;
	this.columnsPerWidth = _columns_per_width;
};

// Initialisation d'un marque page.
class BookMark {

	/**
	 * Constructeur.
	 * @param uniqueId
	 */
	constructor(uniqueId) {
		// Travail avec des textures.
		this.patterns = ["ErableUS", "Poirier", "Sycomore", "EtreBlanc", "Citronnier", "cheneLargeVanille", "Cypres", "FreneJapon"];
		this.images = [];
		this.params = new Params(485, 300, this.getRandomPattern(), uniqueId, this.getRandomPattern(), this.getRandomPattern(), false, false, 3);
		this.equilateral = false;
		this.numberOfPairOfTriangles = 3;
	}

	/**
	 * Retourne aléatoirement un motif.
	 * @returns {*}
	 */
	getRandomPattern() {
		return this.patterns[Math.floor(Math.random() * this.patterns.length)];
	}

	/**
	 * Initialise le fond.
	 * @param el_canvas
	 * @param el_ctx
	 * @param el
	 */
	setBackgroundPattern(el_canvas, el_ctx, el) {
		el_ctx.fillStyle = this.images[el];
		el_ctx.fillRect(0, 0, el_canvas.width, el_canvas.height);
	}

	/**
	 * Dessine un canvas.
	 * @param elementId
	 * @param zoneId
	 * @param params
	 * @returns {Element}
	 */
	createCanvas(elementId, zoneId, params) {

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

		this.clearCanvasLayers(ctx);

		return canvas;
	}

	/**
	 * Efface un canvas.
	 * @param ctx
	 */
	clearCanvasLayers(ctx) {
		let canvas = ctx.canvas;
		let w = canvas.clientWidth;
		let h = canvas.clientHeight;
		ctx.clearRect(0, 0, w, h);
	}

	/**
	 * Initialise les motifs: on décrémente une variable lorsqu'elle est nulle on continue le chargement du canvas.
	 * @param el_ctx
	 */
	initPatterns(el_ctx) {

		let imagesLoading = this.patterns.length;
		let imagePattern = this.images;
		let _this = this;

		this.patterns.forEach(function (pattern) {
			let image = new Image();
			image.onload = function () {
				imagePattern[pattern] = el_ctx.createPattern(image, 'repeat');
				--imagesLoading;
				if (imagesLoading === 0) {
					_this.workDone();
				}
			};
			image.src = 'images/' + pattern + '.jpg';
		});
	}

	/**
	 * Dessine les couples de triangles.
	 * @param el_canvas
	 * @param el_ctx
	 * @param params
	 */
	drawTriangles(el_canvas, el_ctx, params) {
		let _triangle_height;
		let _column_width = el_canvas.width /  params.columnsPerWidth;
		let _half_width = _column_width / 2;

		// Dessine chaque paire de triangle.
		for (let j = 1; j <= this.numberOfPairOfTriangles; j++) {
			for (let l = 0; l <  params.columnsPerWidth; l++) {
				// Cas spécifique, on veut un triangle equilatéral, on le calcul en fonction de la largeur du canvas.
				if (this.equilateral === true) {
					_triangle_height = Math.sqrt((Math.pow(_column_width, 2) + Math.pow((_half_width / 2), 2)));
					if (j === 1) {
						// Lorsque l'on redimensionne un canvas, on est obligé de redessiner le fond sinon il disparait.
						el_canvas.height = _triangle_height * this.numberOfPairOfTriangles * 2;
						this.setBackgroundPattern(el_canvas, el_ctx, this.params.color);
					}
				} else {
					_triangle_height = el_canvas.height / (this.numberOfPairOfTriangles * 2);
				}

				// Epaisseur des lignes de coupes.
				el_ctx.lineWidth = 1;

				// L'offset est le décalage entre chaue colonnes.
				let _offset = l * _column_width;
				let _first_coef = 2 * (_triangle_height * j - _triangle_height);
				let _second_coef = _first_coef + (2 * _triangle_height);
				let _third_coef = ((_second_coef - _triangle_height) / j) * j;

				// Dessine une paire de triangle.
				for (let k = 1; k <= 2; k++) {
					el_ctx.beginPath();
					el_ctx.moveTo(_half_width + _offset, _third_coef);

					// Dessine un triangle avec la base en haut ou en bas.
					if (k % 2 === 1) {
						el_ctx.fillStyle = this.images[el_canvas.colorTriangleEven];
						el_ctx.lineTo(_column_width + _offset, _first_coef);
						el_ctx.lineTo(_offset, _first_coef);
					} else {
						el_ctx.fillStyle = this.images[el_canvas.colorTriangleOdd];
						el_ctx.lineTo(_column_width + _offset, _second_coef);
						el_ctx.lineTo(_offset, _second_coef);
					}

					if (el_canvas.showStrokes === true) {
						el_ctx.strokeStyle = "#FF0000";
						el_ctx.stroke();
					}

					el_ctx.closePath();
					el_ctx.fill();
				}
			}
		}
	}

	/**
	 * Fonction appellée lorsque toutes les images sont chargées.
	 */
	workDone() {
		for (let i = 1; i <= NUMBER_OF_LAYERS; i++) {
			let el_canvas = document.getElementById('canva-' + i);
			let el_ctx = el_canvas.getContext('2d');
			this.clearCanvasLayers(el_ctx);
			// Dessine les triangles.
			this.setBackgroundPattern(el_canvas, el_ctx, "ErableUS");
			this.drawTriangles(el_canvas, el_ctx, this.params);
		}
	}
}

// Au chargement de la page on appelle la fonction d'initialisation.
window.onload = function () {
	let init = function () {
		let gui = new dat.GUI({load: JSON});
		gui.useLocalStorage = true;
		gui.width = 380;

		for (let i = 1; i <= NUMBER_OF_LAYERS; i++) {
			let bookMark = new BookMark(i);
			// Créé un lien de téléchargement de l'image liée au canvas.
			let link = document.createElement('a');
			link.innerHTML = 'Télécharger l\'image';
			link.className = "btn btn-dark";
			link.href = "#";
			link.role = "button";
			link.addEventListener('click', function () {
				link.href = bookMark.el_canvas.toDataURL();
				link.download = "bookmark.jpg";
			}, false);
			let zone = document.getElementById("zone-" + i);
			zone.appendChild(link);
			zone.appendChild(document.createElement('br'));
			zone.appendChild(document.createElement('br'));

			bookMark.el_canvas = bookMark.createCanvas('canva-' + i, 'zone-' + i, bookMark.params);
			bookMark.el_ctx = bookMark.el_canvas.getContext('2d');
			bookMark.initPatterns(bookMark.el_ctx);

			let folder = gui.addFolder('Example ' + i);

			/**
			 * Dessine le canvas avec le nombre de paire de triangle voulues.
			 * @param el
			 */
			function redrawNumberOfTriangles(el) {
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.numberOfPairOfTriangles = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Nombre de colonnes.
			 * @param el
			 */
			function redrawColumnsPerWidth(el) {
				bookMark.params.columnsPerWidth = el;
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change la hauteur du canvas.
			 * @param el
			 */
			function redrawHeight(el) {
				bookMark.el_canvas.height = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change la largeur du canvas.
			 * @param el
			 */
			function redrawWidth(el) {
				bookMark.el_canvas.width = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change le pattern du triangle pair.
			 * @param el
			 */
			function redrawTriangleEvenPattern(el) {
				bookMark.el_canvas.colorTriangleEven = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change le pattern du triangle impair.
			 * @param el
			 */
			function redrawTriangleOddPattern(el) {
				bookMark.el_canvas.colorTriangleOdd = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Dessine les lignes de coupe.
			 * @param el
			 */
			function redrawStrokes(el) {
				bookMark.el_canvas.showStrokes = el;
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Force le canvas en hauteur de manière à ce ue les triangles soient tous équilatéraux.
			 * @param el
			 */
			function redrawEquilateral(el) {
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.el_canvas.height = 600;
				bookMark.equilateral = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Dessine le pattern de fond.
			 * @param el
			 */
			function redrawBackgroundPattern(el) {
				bookMark.el_ctx.fillStyle = bookMark.images[el];
				bookMark.el_ctx.fillRect(0, 0, bookMark.el_canvas.width, bookMark.el_canvas.height);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			folder.add(bookMark.params, 'numberOfPairOfTriangles', 1, 15, 1).onFinishChange(redrawNumberOfTriangles);
			folder.add(bookMark.params, 'columnsPerWidth', 1, 15, 1).onFinishChange(redrawColumnsPerWidth);
			folder.add(bookMark.params, 'height', 100, 1000, 5).onFinishChange(redrawHeight);
			folder.add(bookMark.params, 'width', 100, 300, 5).onFinishChange(redrawWidth);
			folder.add(bookMark.params, 'color', bookMark.patterns).onFinishChange(redrawBackgroundPattern);
			folder.add(bookMark.params, 'triangleEvenPattern', bookMark.patterns).onFinishChange(redrawTriangleEvenPattern);
			folder.add(bookMark.params, 'triangleOddPattern', bookMark.patterns).onFinishChange(redrawTriangleOddPattern);
			folder.add(bookMark.params, 'equilateral', true, false).onFinishChange(redrawEquilateral);
			folder.add(bookMark.params, 'showStrokes').onFinishChange(redrawStrokes);

			// Permet d'activer la sauvegarde des paramètres dans le localstorage.
			gui.remember(bookMark.params);
		}
	};

	init();
};

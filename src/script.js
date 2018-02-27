//import _ from 'lodash';
import 'bootstrap';
import '../scss/_custom.scss';
import dat from '../node_modules/dat.gui/build/dat.gui.js'

const NUMBER_OF_LAYERS = 3;
const STROKE_COLOR = "#FF0000";
const LINE_WIDTH = 1;

// Settings
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

// Initialization of a bookmark.
class BookMark {

	/**
	 * Constructor.
	 * @param uniqueId
	 */
	constructor(uniqueId) {
		// Work with textures.
		this.patterns = ["ErableUS", "Poirier", "Sycomore", "EtreBlanc", "Citronnier", "cheneLargeVanille", "Cypres", "FreneJapon"];
		this.images = [];
		this.params = new Params(485, 300, this.getRandomPattern(), uniqueId, this.getRandomPattern(), this.getRandomPattern(), false, false, 3);
		this.equilateral = false;
		this.numberOfPairOfTriangles = 3;
	}

	/**
	 * Randomly returns a pattern.
	 * @returns {*}
	 */
	getRandomPattern() {
		return this.patterns[Math.floor(Math.random() * this.patterns.length)];
	}

	/**
	 * Initialize the background.
	 * @param el_canvas
	 * @param el_ctx
	 * @param el
	 */
	setBackgroundPattern(el_canvas, el_ctx, el) {
		el_ctx.fillStyle = this.images[el];
		el_ctx.fillRect(0, 0, el_canvas.width, el_canvas.height);
	}

	/**
	 * Draw a canvas.
	 * @param elementId
	 * @param zoneId
	 * @param params
	 * @returns {Element}
	 */
	createCanvas(elementId, zoneId, params) {

		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		let zone = document.getElementById(zoneId);
		canvas.id = elementId;
		canvas.width = params.width;
		canvas.height = params.height;
		canvas.showStrokes = params.showStrokes;
		canvas.colorTriangleEven = params.triangleEvenPattern;
		canvas.colorTriangleOdd = params.triangleOddPattern;
		zone.appendChild(canvas);
		this.clearCanvasLayers(ctx);
		return canvas;
	}

	/**
	 * Erase a canvas.
	 * @param ctx
	 */
	clearCanvasLayers(ctx) {
		let canvas = ctx.canvas;
		let w = canvas.clientWidth;
		let h = canvas.clientHeight;
		ctx.clearRect(0, 0, w, h);
	}

	/**
	 * Initialize the patterns, we decrement a variable. When it is zero we continue the loading script of the canvas.
	 * @param el_ctx
	 */
	initPatterns(el_ctx) {
		let _imagesLoading = this.patterns.length;
		let _imagePattern = this.images;
		let _this = this;
		this.patterns.forEach(function (pattern) {
			let image = new Image();
			image.onload = function () {
				_imagePattern[pattern] = el_ctx.createPattern(image, 'repeat');
				--_imagesLoading;
				if (_imagesLoading === 0) {
					_this.workDone();
				}
			};
			image.src = 'images/' + pattern + '.jpg';
		});
	}

	/**
	 * Draw the pairs of triangles.
	 * @param el_canvas
	 * @param el_ctx
	 * @param params
	 */
	drawTriangles(el_canvas, el_ctx, params) {
		let _triangle_height;
		let _column_width = el_canvas.width /  params.columnsPerWidth;
		let _half_width = _column_width / 2;

		// Draw each triangle pair.
		for (let j = 1; j <= this.numberOfPairOfTriangles; j++) {
			for (let l = 0; l <  params.columnsPerWidth; l++) {

				// Specific case, we want an equilateral triangle, we calculate it according to the width of the canvas.
				if (this.equilateral === true) {
					_triangle_height = Math.sqrt((Math.pow(_column_width, 2) + Math.pow((_half_width / 2), 2)));
					if (j === 1) {
						// When we resize a canvas, we have to draw the background otherwise it disappears.
						el_canvas.height = _triangle_height * this.numberOfPairOfTriangles * 2;
						this.setBackgroundPattern(el_canvas, el_ctx, this.params.color);
					}
				} else {
					_triangle_height = el_canvas.height / (this.numberOfPairOfTriangles * 2);
				}

				// Thickness of cut lines.
				el_ctx.lineWidth = LINE_WIDTH;

				// The offset between each column.
				let _offset = l * _column_width;
				let _first_coef = 2 * (_triangle_height * j - _triangle_height);
				let _second_coef = _first_coef + (2 * _triangle_height);
				let _third_coef = ((_second_coef - _triangle_height) / j) * j;

				// Draw a pair of triangle.
				for (let k = 1; k <= 2; k++) {
					el_ctx.beginPath();
					el_ctx.moveTo(_half_width + _offset, _third_coef);

					// Draw a triangle with the base at the top or at the bottom.
					if (k % 2 === 1) {
						el_ctx.fillStyle = this.images[el_canvas.colorTriangleEven];
						el_ctx.lineTo(_column_width + _offset, _first_coef);
						el_ctx.lineTo(_offset, _first_coef);
					} else {
						el_ctx.fillStyle = this.images[el_canvas.colorTriangleOdd];
						el_ctx.lineTo(_column_width + _offset, _second_coef);
						el_ctx.lineTo(_offset, _second_coef);
					}

					// If stroke flag is on.
					if (el_canvas.showStrokes === true) {
						el_ctx.strokeStyle = STROKE_COLOR;
						el_ctx.stroke();
					}

					el_ctx.closePath();
					el_ctx.fill();
				}
			}
		}
	}

	/**
	 * Function called when all images are loaded.
	 */
	workDone() {
		for (let i = 1; i <= NUMBER_OF_LAYERS; i++) {
			let el_canvas = document.getElementById('canva-' + i);
			let el_ctx = el_canvas.getContext('2d');
			this.clearCanvasLayers(el_ctx);
			// Draw the triangles.
			this.setBackgroundPattern(el_canvas, el_ctx, "ErableUS");
			this.drawTriangles(el_canvas, el_ctx, this.params);
		}
	}
}

// When the page is loaded, the initialization function is called.
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
			 * Draw the canvas with the desired number of triangle pairs.
			 * @param el
			 */
			function redrawNumberOfTriangles(el) {
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.numberOfPairOfTriangles = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Number of columns.
			 * @param el
			 */
			function redrawColumnsPerWidth(el) {
				bookMark.params.columnsPerWidth = el;
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change the height of the canvas.
			 * @param el
			 */
			function redrawHeight(el) {
				bookMark.el_canvas.height = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change the width of the canvas.
			 * @param el
			 */
			function redrawWidth(el) {
				bookMark.el_canvas.width = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change the pattern of the even triangle.
			 * @param el
			 */
			function redrawTriangleEvenPattern(el) {
				bookMark.el_canvas.colorTriangleEven = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change the pattern of the odd triangle.
			 * @param el
			 */
			function redrawTriangleOddPattern(el) {
				bookMark.el_canvas.colorTriangleOdd = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Draw the cut lines.
			 * @param el
			 */
			function redrawStrokes(el) {
				bookMark.el_canvas.showStrokes = el;
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Force the canvas high so that the triangles are all equilateral.
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
			 * Draw the background pattern.
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

			// Enables you to save the settings in the localstorage.
			gui.remember(bookMark.params);
		}
	};

	init();
};

'use strict';

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
export default class BookMark {

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
	initPatterns(el_ctx, i) {
		let _imagesLoading = this.patterns.length;
		let _imagePattern = this.images;
		let _this = this;
		this.patterns.forEach(function (pattern) {
			let image = new Image();
			image.onload = function () {
				_imagePattern[pattern] = el_ctx.createPattern(image, 'repeat');
				--_imagesLoading;
				if (_imagesLoading === 0) {
					_this.workDone(i);
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
		let _column_width = el_canvas.width / params.columnsPerWidth;
		let _half_width = _column_width / 2;

		// Draw each triangle pair.
		for (let j = 1; j <= this.numberOfPairOfTriangles; j++) {
			for (let l = 0; l < params.columnsPerWidth; l++) {

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
	 * @param uniqueId
	 */
	workDone(uniqueId) {
		let el_canvas = document.getElementById('canva-' + uniqueId);
		let el_ctx = el_canvas.getContext('2d');
		this.clearCanvasLayers(el_ctx);
		// Draw the triangles.
		this.setBackgroundPattern(el_canvas, el_ctx, "ErableUS");
		this.drawTriangles(el_canvas, el_ctx, this.params);
	}
}
'use strict';

const STROKE_COLOR = "#FF0000";
const LINE_WIDTH = 1;

// Initialization of a bookmark.
export default class BookMark {
	/**
	 * Constructor.
	 * @param _uniqueId
	 * @param _height
	 * @param _width
	 * @param _background
	 * @param _numberOfpairs
	 * @param _evenPattern
	 * @param _oddPattern
	 * @param _showStrokes
	 * @param _columns_per_width
	 * @param _can_download
	 * @param _patterns
	 * @param _chamfer
	 */
	constructor(_uniqueId, _height, _width, _background, _numberOfpairs, _evenPattern, _oddPattern, _showStrokes,
				_columns_per_width, _can_download, _patterns, _chamfer) {
		// Work with textures.
		this.images = [];
		this.numberOfPairOfTriangles = 3;
		this.patterns = _patterns;
		this.height = _height;
		this.width = _width;

		if (!_background)
			this.backgroundPattern = this.getRandomPattern('background');
		else
			this.backgroundPattern = _background;

		if (!_evenPattern)
			this.triangleEvenPattern = this.getRandomPattern('triangles');
		else
			this.triangleEvenPattern = _evenPattern;

		if (!_oddPattern)
			this.triangleOddPattern = this.getRandomPattern('triangles');
		else
			this.triangleOddPattern = _oddPattern;

		this.numberOfPairOfTriangles = _numberOfpairs;
		this.showStrokes = _showStrokes;
		this.columnsPerWidth = _columns_per_width;
		this.canDownload = _can_download;
		this.chamfer = _chamfer;

		this.el_canvas = this.createCanvas('canva-' + _uniqueId, 'zone-' + _uniqueId);

		// Show download link if can download picture is set to true.
		if (this.canDownload === true)
			this.createDownloadLink(_uniqueId);

		this.el_ctx = this.el_canvas.getContext('2d');
		this.initPatterns('triangles');
		this.initPatterns('background');
	}

	/**
	 * Randomly returns a pattern.
	 * @param zone
	 * @returns {*}
	 */
	getRandomPattern(zone) {
		let value = Math.floor(Math.random() * this.patterns[zone].length);
		return this.patterns[zone][value];
	}

	/**
	 * Initialize the background.
	 * @param el
	 */
	setBackgroundPattern(el) {
		this.el_ctx.fillStyle = this.images[el];
		if (this.chamfer > 0) {
			this.chamferedRect(0, 0, this.el_canvas.width, this.el_canvas.height, this.chamfer, false, false, false, false);
			this.el_ctx.fill();
		} else {
			this.el_ctx.fillRect(0, 0, this.el_canvas.width, this.el_canvas.height);
		}
	}

	/**
	 *
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @param radius
	 * @param rt
	 * @param lt
	 * @param rb
	 * @param lb
	 */
	roundRect(x, y, w, h, radius, rt, lt, rb, lb) {
		let r = x + w;
		let b = y + h;
		this.el_ctx.beginPath();
		this.el_ctx.strokeStyle = "green";
		this.el_ctx.lineWidth = "2";

		if (rt) {

			if (lt) {
				this.el_ctx.moveTo(x, y);
			} else {
				this.el_ctx.moveTo(x + radius, y);
			}

			this.el_ctx.lineTo(r - radius, y);
			this.el_ctx.quadraticCurveTo(r, y, r, y + radius);
		} else {

			if (lb) {

				this.el_ctx.moveTo(x + radius, y);
			} else {
				this.el_ctx.moveTo(x, y);

			}
			this.el_ctx.lineTo(r, y);
		}

		if (rb) {
			this.el_ctx.lineTo(r, y + h - radius);
			this.el_ctx.quadraticCurveTo(r, b, r - radius, b);
		} else {
			this.el_ctx.lineTo(r, y + h);
		}

		if (lt) {
			this.el_ctx.lineTo(x + radius, b);
			this.el_ctx.quadraticCurveTo(x, b, x, b - radius);
		} else {
			this.el_ctx.lineTo(x, b);
		}

		if (lb) {
			this.el_ctx.lineTo(x, y + radius);
			this.el_ctx.quadraticCurveTo(x, y, x + radius, y);
		} else {
			this.el_ctx.lineTo(x, y);
		}
		this.el_ctx.stroke();
	}

	/**
	 *
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @param radius
	 * @param rt
	 * @param lt
	 * @param rb
	 * @param lb
	 */
	chamferedRect(x, y, w, h, radius, rt, lt, rb, lb) {

		let r = x + w;
		let b = y + h;

		this.el_ctx.moveTo(x + radius, y);

		this.el_ctx.lineTo(r - radius, y);
		this.el_ctx.lineTo(r, y + radius);

		this.el_ctx.lineTo(r, y + h - radius);
		this.el_ctx.lineTo(r - radius, b);

		this.el_ctx.lineTo(x + radius, b);
		this.el_ctx.lineTo(x, b - radius);

		this.el_ctx.lineTo(x, y + radius);
		this.el_ctx.lineTo(x + radius, y);
	}

	/**
	 * Draw a canvas.
	 * @param elementId
	 * @param zoneId
	 * @returns {Element}
	 */
	createCanvas(elementId, zoneId) {

		let _canvas = document.createElement('canvas');
		_canvas.innerHTML = "Votre navigateur ne supporte pas canvas.<br>Essayez avec Firefox, Safari, Chrome ou Opera.";
		let zone = document.getElementById(zoneId);
		_canvas.id = elementId;
		_canvas.width = this.width;
		_canvas.height = this.height;
		_canvas.showStrokes = this.showStrokes;
		_canvas.chamfer = this.chamfer;
		_canvas.backgroundPatternTriangleEven = this.triangleEvenPattern;
		_canvas.backgroundPatternTriangleOdd = this.triangleOddPattern;
		zone.appendChild(_canvas);
		this.clearCanvasLayers();
		return _canvas;
	}

	/**
	 * Erase a canvas.
	 */
	clearCanvasLayers() {
		if (this.el_canvas) {
			let w = this.el_canvas.clientWidth;
			let h = this.el_canvas.clientHeight;
			this.el_ctx.clearRect(0, 0, w, h);
		}
	}

	/**
	 * Initialize the patterns, we decrement a variable. When it is zero we continue the loading script of the canvas.
	 * @param zone
	 */
	initPatterns(zone) {
		let _imagesLoading = this.patterns[zone].length;
		let _this = this;
		this.patterns[zone].forEach(function (pattern) {
			let elpattern = encodeURI(pattern);
			let image = new Image();
			image.onload = function () {
				_this.images[elpattern] = _this.el_ctx.createPattern(image, 'repeat');
				--_imagesLoading;
				if (_imagesLoading === 0)
					_this._onPatternsLoaded();
			};
			image.src = elpattern;
		});
	}

	/**
	 * Create a link to download an image of the canvas.
	 * @param uniqueId
	 */
	createDownloadLink(uniqueId) {

		let _zone = document.getElementById("zone-" + uniqueId);
		let _link = document.createElement('a');
		let _this = this;

		_link.innerHTML = 'Download the picture';
		_link.className = "btn btn-dark";
		_link.href = "#";
		_link.role = "button";
		_link.addEventListener('click', function () {
			_link.href = _this.el_canvas.toDataURL();
			_link.download = "bookmark.jpg";
		}, false);
		_zone.insertBefore(document.createElement('br'), _zone.firstChild);
		_zone.insertBefore(document.createElement('br'), _zone.firstChild);

		let params = document.createElement('textarea');
		params.cols = 80;
		params.rows = 10;
		params.readOnly = true;
		params.innerHTML = JSON.stringify(_this);

		//_zone.insertBefore(params, _zone.firstChild);
		_zone.insertBefore(_link, _zone.firstChild);
	}

	/**
	 * Draw the pairs of triangles.
	 */
	drawTriangles() {
		if (this.el_canvas.chamfer > 0) {
			this.el_ctx.clip();
		}
		let _triangle_height;
		let _column_width = this.el_canvas.width / this.columnsPerWidth;
		let _half_width = _column_width / 2;

		// Draw each triangle pair.
		for (let j = 1; j <= this.numberOfPairOfTriangles; j++) {

			for (let l = 0; l < this.columnsPerWidth; l++) {

				_triangle_height = this.el_canvas.height / (this.numberOfPairOfTriangles * 2);

				// Thickness of cut lines.
				this.el_ctx.lineWidth = LINE_WIDTH;

				// The offset between each column.
				let _offset = l * _column_width;
				let _first_coef = 2 * (_triangle_height * j - _triangle_height);
				let _second_coef = _first_coef + (2 * _triangle_height);
				let _third_coef = ((_second_coef - _triangle_height) / j) * j;

				// Draw a pair of triangles.
				for (let k = 1; k <= 2; k++) {
					this.el_ctx.beginPath();
					this.el_ctx.moveTo(_half_width + _offset, _third_coef);

					// Draw a triangle with the base at the top or at the bottom.
					if (k % 2 === 1) {
						this.el_ctx.fillStyle = this.images[this.el_canvas.backgroundPatternTriangleEven];
						this.el_ctx.lineTo(_column_width + _offset, _first_coef);
						this.el_ctx.lineTo(_offset, _first_coef);
					} else {
						this.el_ctx.fillStyle = this.images[this.el_canvas.backgroundPatternTriangleOdd];
						this.el_ctx.lineTo(_column_width + _offset, _second_coef);
						this.el_ctx.lineTo(_offset, _second_coef);
					}

					this.el_ctx.closePath();

					// If show strokes flag is on.
					if (this.el_canvas.showStrokes === true) {
						this.el_ctx.strokeStyle = STROKE_COLOR;
						this.el_ctx.stroke();
					}

					this.el_ctx.fill();
				}
			}
		}
		if (this.el_canvas.chamfer > 0) {
			this.el_ctx.restore();
		}
	}

	/**
	 * Function called when all images are loaded.
	 */
	_onPatternsLoaded() {

		this.clearCanvasLayers();

		// Draw the triangles.
		this.setBackgroundPattern(this.backgroundPattern);
		this.drawTriangles();
	}
}
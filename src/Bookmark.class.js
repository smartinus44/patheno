'use strict';

const STROKE_COLOR = "#FF0000";
const LINE_WIDTH = 1;

// Initialization of a bookmark.
export default class BookMark {

	/**
	 * Constructor.
	 * @param {number} _uniqueId
	 * @param {number} _height
	 * @param {number} _width
	 * @param {string}_background
	 * @param {number} _numberOfpairs
	 * @param {boolean} _enableTriangles
	 * @param {string} _evenPattern
	 * @param {string}_oddPattern
	 * @param {boolean} _showStrokes
	 * @param {number} _columns_per_width
	 * @param {boolean} _can_download
	 * @param {Object} _patterns
	 * @param {number} _chamfer
	 * @param {boolean} _chamferRt
	 * @param {boolean}  _chamferRb
	 * @param {boolean}  _chamferLt
	 * @param {boolean}  _chamferLb
	 * @returns {BookMark}
	 */
	constructor(_uniqueId, _height, _width, _background, _numberOfpairs, _enableTriangles, _evenPattern,
				_oddPattern, _showStrokes, _columns_per_width, _can_download, _patterns, _chamfer, _chamferRt,
				_chamferRb, _chamferLt, _chamferLb) {

		// Work with textures.
		this.uniqueId = _uniqueId;
		this.images = [];
		this.numberOfPairOfTriangles = 3;
		this.patterns = _patterns;
		this.height = _height;
		this.width = _width;
		this.chamferRt = _chamferRt;
		this.chamferRb = _chamferRb;
		this.chamferLt = _chamferLt;
		this.chamferLb = _chamferLb;

		this.enableTriangles = _enableTriangles;

		if (!_evenPattern)
			this.triangleEvenPattern = this._getRandomPattern('triangles');
		else
			this.triangleEvenPattern = _evenPattern;

		if (!_oddPattern)
			this.triangleOddPattern = this._getRandomPattern('triangles');
		else
			this.triangleOddPattern = _oddPattern;

		this.numberOfPairOfTriangles = _numberOfpairs;
		this.showStrokes = _showStrokes;
		this.columnsPerWidth = _columns_per_width;
		this.canDownload = _can_download;
		this.chamfer = _chamfer;
		this.backgroundPattern = _background;

		this._init();

		return this;
	}

	/**
	 * First init canvas and ctx.
	 * @private
	 */
	_init() {
		this.el_canvas = this._createCanvas('canva-' + this.uniqueId, 'zone-' + this.uniqueId);
		this.el_ctx = this.el_canvas.getContext('2d');

		// Show download link if can download picture is set to true.
		if (this.canDownload === true)
			this._createDownloadLink(this.uniqueId);

		console.log('Instance of a Bookmark built.');

		this._initPatterns('background');
		this._initPatterns('triangles');
	}

	/**
	 * Randomly returns a pattern.
	 * @param {string} zone
	 * @returns {string|null}
	 * @private
	 */
	_getRandomPattern(zone) {
		let result = null;
		if (typeof this.patterns[zone] !== 'undefined') {
			let value = Math.floor(Math.random() * this.patterns[zone].length);
			result = this._getFullPath(this.patterns[zone][value].data);
		}
		return result;
	}

	/**
	 * Return true if only one chamfer is enabled.
	 * @returns {boolean}
	 * @private
	 */
	_hasChamfer() {
		return (this.chamferRt ||
			this.chamferRb ||
			this.chamferLt ||
			this.chamferLb);
	}

	/**
	 * Return clean full path of a pattern.
	 * @param {string} path
	 * @returns {string}
	 * @private
	 */
	_getFullPath(path) {
		return btoa(this.patterns.path + path);
	}

	/**
	 * Find a pattern in a list of patterns.
	 * @param {string} searchedPattern
	 * @return {string}
	 * @private
	 */
	_findPattern(searchedPattern) {
		let pattern;
		this.patterns.background.map((b) => {
			if (b.title === searchedPattern)
				pattern = b.data;
		});

		return pattern;
	}

	/**
	 * Initialize the background.
	 * @param {string|Array} backgroundPattern
	 * @private
	 */
	_setBackgroundPatterns(backgroundPattern) {
		console.log(this.images);
		if (this._hasChamfer()) {
			console.log('setBackgroundPatterns with chamfer - ' + backgroundPattern);
			this._chamferedRect(
				0,
				0,
				this.el_canvas.width,
				this.el_canvas.height,
				this.chamfer,
				this.chamferRt,
				this.chamferRb,
				this.chamferLt,
				this.chamferLb
			);

			// If the pattern is compouned of a couple of faces.
			if (Array.isArray(backgroundPattern))
				this._buidMirroredPattern(backgroundPattern);
			else
				this._applyStyle(this.images[backgroundPattern]);

			this.el_ctx.fill();
		}
		else {
			console.log('setBackgroundPatterns without chamfer - ' + backgroundPattern);

			let pattern = this._findPattern(backgroundPattern);

			// Patterns could be stored in an array or in a single string because of mirrored patterns.
			if (Array.isArray(pattern)) {
				this._buidMirroredPattern(pattern);
				this.el_ctx.fill();
			} else {
				this._applyStyle(this.images[this._getFullPath(pattern)]);
				this.el_ctx.fillRect(0, 0, this.el_canvas.width, this.el_canvas.height);
			}
		}
	}

	/**
	 * Build a mirrored background pattern.
	 * @param {Object} patterns
	 * @private
	 */
	_buidMirroredPattern(patterns) {
	
		// Black background
		this.el_ctx.strokeRect(0, 0, this.el_canvas.width, this.el_canvas.height);

		let pow = parseFloat(this.el_canvas.width / 2);
		let width = this.width;
		let height = this.height;

		patterns.forEach((pattern, index) => {
			let currentImage = this.images[this._getFullPath(pattern)];

			if (currentImage) {

				// Top left.
				this.el_ctx.drawImage(currentImage, 0, 0, width, height);

				if (index > 0) {
					// Top right.
					if (index === 1)
						this.el_ctx.drawImage(currentImage, pow, 0, width, height);
					// Bottom left.
					if (index === 2)
						this.el_ctx.drawImage(currentImage, 0, 200, width, height);
					// Bottom right.
					if (index === 3)
						this.el_ctx.drawImage(currentImage, pow, 200, width, height);
				}
			}
		});
	}

	/**
	 * Build a rounded background pattern.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} w
	 * @param {number} h
	 * @param {number} radius
	 * @param {boolean} rt
	 * @param {boolean} lt
	 * @param {boolean} rb
	 * @param {boolean} lb
	 * @private
	 */
	_roundRect(x, y, w, h, radius, rt, lt, rb, lb) {
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
	 * Build a chamfered background pattern.
	 * @param {number} x
	 * @param y
	 * @param w
	 * @param h
	 * @param radius
	 * @param {boolean} rt
	 * @param {boolean} lt
	 * @param {boolean} rb
	 * @param {boolean} lb
	 * @private
	 */
	_chamferedRect(x, y, w, h, radius, rt, lt, rb, lb) {

		let r = x + w;
		let b = y + h;

		this.el_ctx.moveTo(x + radius, y);

		if (rt) {
			this.el_ctx.lineTo(r - radius, y);
			this.el_ctx.lineTo(r, y + radius);
		} else {
			this.el_ctx.lineTo(r - radius, y);
			this.el_ctx.lineTo(r, y);
		}

		if (lb) {
			this.el_ctx.lineTo(r, y + h - radius);
			this.el_ctx.lineTo(r - radius, b);
		} else {
			this.el_ctx.lineTo(r, y + h);
		}

		if (lt) {
			this.el_ctx.lineTo(x + radius, b);
			this.el_ctx.lineTo(x, b - radius);
		} else {
			this.el_ctx.lineTo(x, b);
		}

		if (rb) {
			this.el_ctx.lineTo(x, y + radius);
			this.el_ctx.lineTo(x + radius, y);
		} else {
			this.el_ctx.lineTo(x, y);
		}
	}

	/**
	 * Draw a canvas.
	 * @param {string} elementId
	 * @param {string} zoneId
	 * @returns {Element}
	 * @private
	 */
	_createCanvas(elementId, zoneId) {

		let _canvas = document.createElement('canvas');
		_canvas.innerHTML = "Votre navigateur ne supporte pas canvas.<br>Essayez avec Firefox, Safari, Chrome ou Opera.";
		let zone = document.getElementById(zoneId);
		_canvas.id = elementId;
		_canvas.width = this.width;
		_canvas.height = this.height;
		_canvas.showStrokes = this.showStrokes;
		_canvas.chamfer = this.chamfer;
		_canvas.chamferRt = this.chamferRt;
		_canvas.chamferRb = this.chamferRb;
		_canvas.chamferLt = this.chamferLt;
		_canvas.chamferLb = this.chamferLb;
		_canvas.backgroundPatternTriangleEven = this.triangleEvenPattern;
		_canvas.backgroundPatternTriangleOdd = this.triangleOddPattern;

		if (zone)
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
	 * Get filtered patterns.
	 * @param {string} zone
	 * @returns {Array}
	 * @private
	 */
	_getFiltered(zone) {
		let filteredFull = [];

		if (typeof this.patterns[zone] !== 'undefined') {
			this.patterns[zone].filter((pattern) => {
				if (pattern.data) {
					filteredFull.push(pattern.data);
				}
				return true;
			});
		}
		return filteredFull;
	}


	/**
	 * Get filtered patterns object.
	 * @param {string} zone
	 * @returns {Array}
	 */
	getFilteredPatternsObjects(zone) {
		let filteredFull = {};

		this.patterns[zone].filter((pattern) => {
			if (pattern.data)
				filteredFull[pattern.title] = pattern.title;
			return true;
		});

		return filteredFull;
	}

	/**
	 * Initialize the patterns, we decrement a variable. When it is zero we continue the loading script of the canvas.
	 * @param {string} zone
	 * @private
	 */
	_initPatterns(zone) {

		let filteredPatterns = this._getFiltered(zone);
		let _imagesLoading = filteredPatterns.length;

		filteredPatterns.forEach((pattern) => {

			if (Array.isArray(pattern)) {

				pattern.forEach((ss_pattern) => {
					let ss_image = new Image();
					let ss_elpattern = this._getFullPath(ss_pattern);
					ss_image.onload = () => {
						this.images[ss_elpattern] = ss_image;
						this.repeatBackgroundWidth = this.width / ss_image.width;
						this.repeatBackgroundHeight = this.height / ss_image.height;
					};
					ss_image.src = atob(ss_elpattern);

					if (_imagesLoading === 0)
						this._triggeredOnPatternsLoaded(atob(ss_elpattern));
				});

				--_imagesLoading;
				console.log(_imagesLoading + ' ' + zone + ' pattern(s) still loading');

			}
			else {
				let image = new Image();
				let elpattern = this._getFullPath(pattern);
				image.onload = () => {
					this.images[elpattern] = this.el_ctx.createPattern(image, 'repeat');
					--_imagesLoading;
					console.log(_imagesLoading + ' ' + zone + ' pattern(s) still loading');
					if (_imagesLoading === 0)
						this._triggeredOnPatternsLoaded(atob(elpattern));
				};
				image.src = atob(elpattern);
			}
		});
	}

	/**
	 * Create a link to download an image of the canvas.
	 * @param {number} uniqueId
	 * @private
	 */
	_createDownloadLink(uniqueId) {

		let _zone = document.getElementById("zone-" + uniqueId);
		let _link = document.createElement('a');

		_link.innerHTML = 'Download the picture';
		_link.className = "btn btn-dark";
		_link.href = "#";
		_link.role = "button";
		_link.addEventListener('click', () => {
			_link.href = this.el_canvas.toDataURL();
			_link.download = "bookmark.jpg";
		}, false);

		if (_zone) {
			_zone.insertBefore(document.createElement('br'), _zone.firstChild);
			_zone.insertBefore(document.createElement('br'), _zone.firstChild);
			_zone.insertBefore(_link, _zone.firstChild);
		}

		let params = document.createElement('textarea');
		params.cols = 80;
		params.rows = 10;
		params.readOnly = true;
		params.innerHTML = JSON.stringify(this);
	}

	/**
	 * Draw Background.
	 * @private
	 */
	_drawBackground() {
		this._setBackgroundPatterns(this.backgroundPattern);
	}

	/**
	 * Apply a pattern to a context of a canvas.
	 * @param {Object.<CanvasPattern>} style
	 * @private
	 */
	_applyStyle(style) {
		console.log('Apply style: ' + style);
		this.el_ctx.fillStyle = style;
	}

	/**
	 * Draw a single even or odd triangle.
	 * @param {boolean} isEven
	 * @private
	 */
	_drawSingleTriangle(isEven) {

		let pattern;

		this.patterns.triangles.map((b) => {
			if (b.title === ((isEven === true) ? this.el_canvas.backgroundPatternTriangleEven : this.el_canvas.backgroundPatternTriangleOdd))
				pattern = b.data;
		});

		this._applyStyle(this.images[this._getFullPath(pattern)]);

		console.log('Render a ' + (isEven ? 'even' : 'odd') + ' triangle with ' + pattern);

		if (isEven) {
			this.el_ctx.lineTo(this._column_width + this._offset, this._first_coef);
			this.el_ctx.lineTo(this._offset, this._first_coef);
		} else {
			this.el_ctx.lineTo(this._column_width + this._offset, this._second_coef);
			this.el_ctx.lineTo(this._offset, this._second_coef);
		}
	}

	/**
	 * Draw the pairs of triangles.
	 * @private
	 */
	_drawTriangles() {

		if (this._hasChamfer())
			this.el_ctx.clip();

		let _triangle_height;
		this._column_width = this.el_canvas.width / this.columnsPerWidth;
		let _half_width = this._column_width / 2;

		// Draw each triangle pair.
		for (let j = 1; j <= this.numberOfPairOfTriangles; j++) {

			// Draw each column.
			for (let l = 0; l < this.columnsPerWidth; l++) {

				_triangle_height = this.el_canvas.height / (this.numberOfPairOfTriangles * 2);

				// Thickness of cut lines.
				this.el_ctx.lineWidth = LINE_WIDTH;

				// The offset between each column.
				this._offset = l * this._column_width;
				this._first_coef = 2 * (_triangle_height * j - _triangle_height);
				this._second_coef = this._first_coef + (2 * _triangle_height);
				this._third_coef = ((this._second_coef - _triangle_height) / j) * j;

				// Draw a pair of triangles.
				for (let k = 1; k <= 2; k++) {
					this.el_ctx.beginPath();

					this.el_ctx.moveTo(_half_width + this._offset, this._third_coef);

					// Draw a triangle with the base at the top or at the bottom.
					if (k % 2 === 1) {
						this._drawSingleTriangle(true);
					} else {
						this._drawSingleTriangle(false);
					}

					this.el_ctx.closePath();

					this._drawStrokes();

					this.el_ctx.fill();
				}
			}
		}

		if (this._hasChamfer())
			this.el_ctx.restore();
	}

	/**
	 * Draw strokes or not.
	 * @private
	 */
	_drawStrokes() {
		// If show strokes flag is on.
		if (this.el_canvas.showStrokes === true) {
			this.el_ctx.strokeStyle = STROKE_COLOR;
			this.el_ctx.stroke();
		}
	}

	/**
	 * Render the bookmark.
	 */
	render() {
		setTimeout(() => {
			this._drawBackground();

			if (this.enableTriangles)
				this._drawTriangles();
		}, 100);
	}

	/**
	 * Function called when all images are loaded.
	 * @param {string} loadedPattern
	 * @private
	 */
	_triggeredOnPatternsLoaded(loadedPattern) {
		this.clearCanvasLayers();
		this.render();
	}
}

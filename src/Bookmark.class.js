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
	 * @param _enableTriangles
	 * @param _evenPattern
	 * @param _oddPattern
	 * @param _showStrokes
	 * @param _columns_per_width
	 * @param _can_download
	 * @param _patterns
	 * @param _chamfer
	 * @param _chamferRt
	 * @param _chamferRb
	 * @param _chamferLt
	 * @param _chamferLb
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
	 * Set background pattern.
	 * @param background
	 * @private
	 */
	_setBackground(background) {

		if (!background) {
			this.backgroundPattern = this._getRandomPattern('background');
		} else {
			let patterns = background;
			patterns.map(function (pattern, index) {
				patterns[index] = pattern;
			});
			this.backgroundPattern = patterns;
		}
	}

	/**
	 * Randomly returns a pattern.
	 * @param zone
	 * @returns {*}
	 * @private
	 */
	_getRandomPattern(zone) {
		let _this = this;
		let result = null;
		if (typeof _this.patterns[zone] !== 'undefined') {
			let value = Math.floor(Math.random() * _this.patterns[zone].length);
			result = _this._getFullPath(_this.patterns[zone][value].data)
		}
		return result;
	}

	/**
	 * Return true if only one chamfer is enabled.
	 * @returns {*}
	 * @private
	 */
	_hasChamfer() {
		return (this.chamferRt ||
			this.chamferRb ||
			this.chamferLt ||
			this.chamferLb)
	}

	/**
	 * Return clean full path of a pattern.
	 * @param path
	 * @returns {string}
	 * @private
	 */
	_getFullPath(path) {
		return btoa(this.patterns['path'] + path);
	}

	/**
	 * Find a pattern in a list of patterns.
	 * @param searchedPattern
	 * @return {string}
	 * @private
	 */
	_findPattern(searchedPattern) {
		let pattern;
		this.patterns['background'].map(function (b) {
			if (b.title === searchedPattern)
				pattern = b.data;
		});

		return pattern;
	}

	/**
	 * Initialize the background.
	 * @param backgroundPattern
	 * @private
	 */
	_setBackgroundPatterns(backgroundPattern) {
		let _this = this;
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
				_this._buidMirroredPattern(backgroundPattern);
			else
				this._applyStyle(_this.images[backgroundPattern]);

			this.el_ctx.fill();
		}
		else {
			console.log('setBackgroundPatterns without chamfer - ' + backgroundPattern);

			let pattern = _this._findPattern(backgroundPattern);

			// Patterns could be stored in an array or in a single string because of mirrored patterns.
			if (Array.isArray(pattern)) {
				_this._buidMirroredPattern(pattern);
				this.el_ctx.fill();
			} else {
				this._applyStyle(_this.images[_this._getFullPath(pattern)]);
				this.el_ctx.fillRect(0, 0, this.el_canvas.width, this.el_canvas.height);
			}
		}
	}

	/**
	 * Build a mirrored background pattern.
	 * @param patterns
	 * @private
	 */
	_buidMirroredPattern(patterns) {
		let _this = this;

		// Black background
		_this.el_ctx.strokeRect(0, 0, _this.el_canvas.width, _this.el_canvas.height);

		let pow = parseFloat(_this.el_canvas.width / 2);
		let width = _this.width;
		let height = _this.height;

		patterns.forEach(function (pattern, index) {
			let currentImage = _this.images[_this._getFullPath(pattern)];

			if (currentImage) {

				// Top left.
				_this.el_ctx.drawImage(currentImage, 0, 0, width, height);

				if (index > 0) {
					// Top right.
					if (index === 1)
						_this.el_ctx.drawImage(currentImage, pow, 0, width, height);
					// Bottom left.
					if (index === 2)
						_this.el_ctx.drawImage(currentImage, 0, 200, width, height);
					// Bottom right.
					if (index === 3)
						_this.el_ctx.drawImage(currentImage, pow, 200, width, height);
				}
			}
		});
	}

	/**
	 * Build a rounded background pattern.
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @param radius
	 * @param rt
	 * @param lt
	 * @param rb
	 * @param lb
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
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @param radius
	 * @param rt
	 * @param lt
	 * @param rb
	 * @param lb
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
	 * @param elementId
	 * @param zoneId
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
	 * @param zone
	 * @returns {Array}
	 * @private
	 */
	_getFiltered(zone) {
		let filteredFull = [];

		if (typeof this.patterns[zone] !== 'undefined') {
			this.patterns[zone].filter(function (pattern) {
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
	 * @param zone
	 * @returns {{}}
	 */
	getFilteredPatternsObjects(zone) {
		let filteredFull = {};

		this.patterns[zone].filter(function (pattern) {
			if (pattern.data)
				filteredFull[pattern.title] = pattern.title;
			return true;
		});

		return filteredFull;
	}

	/**
	 * Initialize the patterns, we decrement a variable. When it is zero we continue the loading script of the canvas.
	 * @param zone
	 * @private
	 */
	_initPatterns(zone) {

		let filteredPatterns = this._getFiltered(zone);
		let _imagesLoading = filteredPatterns.length;

		let _this = this;
		filteredPatterns.forEach(function (pattern) {

			if (Array.isArray(pattern)) {

				pattern.forEach(function (ss_pattern) {
					let ss_image = new Image();
					let ss_elpattern = _this._getFullPath(ss_pattern);
					ss_image.onload = function () {
						_this.images[ss_elpattern] = ss_image;
						_this.repeatBackgroundWidth = _this.width / ss_image.width;
						_this.repeatBackgroundHeight = _this.height / ss_image.height;
					};
					ss_image.src = atob(ss_elpattern);

					if (_imagesLoading === 0)
						_this._triggeredOnPatternsLoaded(atob(ss_elpattern));
				});

				--_imagesLoading;
				console.log(_imagesLoading + ' ' + zone + ' pattern(s) still loading');

			}
			else {
				let image = new Image();
				let elpattern = _this._getFullPath(pattern);
				image.onload = function () {
					_this.images[elpattern] = _this.el_ctx.createPattern(image, 'repeat');
					--_imagesLoading;
					console.log(_imagesLoading + ' ' + zone + ' pattern(s) still loading');
					if (_imagesLoading === 0)
						_this._triggeredOnPatternsLoaded(atob(elpattern));
				};
				image.src = atob(elpattern);
			}
		});
	}

	/**
	 * Create a link to download an image of the canvas.
	 * @param uniqueId
	 * @private
	 */
	_createDownloadLink(uniqueId) {

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

		if (_zone) {
			_zone.insertBefore(document.createElement('br'), _zone.firstChild);
			_zone.insertBefore(document.createElement('br'), _zone.firstChild);
			_zone.insertBefore(_link, _zone.firstChild);
		}

		let params = document.createElement('textarea');
		params.cols = 80;
		params.rows = 10;
		params.readOnly = true;
		params.innerHTML = JSON.stringify(_this);
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
	 * @param style
	 * @private
	 */
	_applyStyle(style) {
		this.el_ctx.fillStyle = style;
	}

	/**
	 * Draw a single even or odd triangle.
	 * @param isEven
	 * @private
	 */
	_drawSingleTriangle(isEven) {

		let pattern;

		this.patterns['triangles'].map(function (b) {
			if (b.title === ((isEven === true) ? this.el_canvas.backgroundPatternTriangleEven : this.el_canvas.backgroundPatternTriangleOdd))
				pattern = b.data;
		}.bind(this));

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
		let _this = this;

		setTimeout(function () {
			_this._drawBackground();

			if (_this.enableTriangles)
				_this._drawTriangles();
		}, 100);
	}

	/**
	 * Function called when all images are loaded.
	 * @param loadedPattern
	 * @private
	 */
	_triggeredOnPatternsLoaded(loadedPattern) {
		this.clearCanvasLayers();
		this.render();
	}
}

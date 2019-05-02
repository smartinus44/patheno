'use strict';

const STROKE_COLOR = "#FF0000";
const LINE_WIDTH = 1;
const DEBUG = true; // Enable logging

const log = (elem) => {
    if (DEBUG) {
        console.log(elem);
    }
};

// Initialization of a bookmark.
export default class BookMark {

    /**
     * Constructor.
     * @param {number} _uniqueId
     * @returns {BookMark}
     */
    constructor(build) {

        this.uniqueId = build.uniqueId;
        this.patterns = build.patterns;
        this.height = build.height;
        this.width = build.width;
        this.chamfer = build.chamferWidth;
        this.chamferRt = build.chamferRt;
        this.chamferRb = build.chamferRb;
        this.chamferLt = build.chamferLt;
        this.chamferLb = build.chamferLb;
        this.roundBorder = build.roundBorderWidth;
        this.roundBorderRt = build.roundBorderRt;
        this.roundBorderRb = build.roundBorderRb;
        this.roundBorderLt = build.roundBorderLt;
        this.roundBorderLb = build.roundBorderLb;
        this.enableTriangles = build.enableTriangles;
        this.numberOfPairOfTriangles = build.numberOfpairs;
        this.showStrokes = build.showStrokes;
        this.columnsPerWidth = build.columnsPerWidth;
        this.canDownload = build.canDownload;
        this.backgroundPattern = build.background;

        if (!build.evenPattern) {
            this.triangleEvenPattern = this._getRandomPattern('triangles');
        } else {
            this.triangleEvenPattern = build.evenPattern;
        }

        if (!build.oddPattern) {
            this.triangleOddPattern = this._getRandomPattern('triangles');
        } else {
            this.triangleOddPattern = build.oddPattern;
        }

        this.images = [];
        this.wrapper = null;

        this._init();
    }

    static get Builder() {
        class Builder {
            /**
             * @param {number} uniqueId 
             */
            constructor(uniqueId) {
                    this.uniqueId = uniqueId;
                }
                /**
                 * @param {number} height 
                 * @param {number} width 
                 */
            sized(height, width) {
                    this.height = height;
                    this.width = width;
                    return this;
                }
                /**
                 * @param {number} columnsPerWidth 
                 */
            columnsPerWidth(columnsPerWidth) {
                    this.columnsPerWidth = columnsPerWidth;
                    return this;
                }
                /**
                 * @param {boolean} canDownload 
                 */
            downloadable(canDownload) {
                    this.canDownload = canDownload;
                    return this;
                }
                /**
                 * @param {boolean} canDownload 
                 */
            withStrokes(showStrokes) {
                    this.showStrokes = showStrokes;
                    return this;
                }
                /**
                 * @param {string} background 
                 */
            withBackground(background) {
                    this.background = background;
                    return this;
                }
                /**
                 * @param {number} numberOfpairs 
                 */
            withNumberOfPairs(numberOfpairs) {
                    this.numberOfpairs = numberOfpairs;
                    return this;
                }
                /**
                 * @param {number} numberOfpairs 
                 */
            withTriangles(enableTriangles) {
                    this.enableTriangles = enableTriangles;
                    return this;
                }
                /**
                 * @param {Object} patterns 
                 * @param {string} evenPattern 
                 * @param {string} oddPattern 
                 */
            withPatterns(patterns, evenPattern, oddPattern) {
                    this.patterns = patterns;
                    this.evenPattern = evenPattern;
                    this.oddPattern = oddPattern;
                    return this;
                }
                /**
                 * @param {number} chamferWidth 
                 * @param {boolean} chamferRt 
                 * @param {boolean} chamferRb 
                 * @param {boolean} chamferLt 
                 * @param {boolean} chamferLb 
                 */
            withChamfers(chamferWidth, chamferRt, chamferRb, chamferLt, chamferLb) {
                    this.chamferWidth = chamferWidth;
                    this.chamferRt = chamferRt;
                    this.chamferRb = chamferRb;
                    this.chamferLt = chamferLt;
                    this.chamferLb = chamferLb;
                    return this;
                }
                /**
                 * @param {number} roundBorderWidth 
                 * @param {boolean} roundBorderRt 
                 * @param {boolean} roundBorderRb 
                 * @param {boolean} roundBorderLt 
                 * @param {boolean} roundBorderLb 
                 */
            withRoundBorder(roundBorderWidth, roundBorderRt, roundBorderRb, roundBorderLt, roundBorderLb) {
                this.roundBorderWidth = roundBorderWidth;
                this.roundBorderRt = roundBorderRt;
                this.roundBorderRb = roundBorderRb;
                this.roundBorderLt = roundBorderLt;
                this.roundBorderLb = roundBorderLb;
                return this;
            }

            build() {
                return new BookMark(this);
            }
        }
        return Builder;
    }

    /**
     * First init canvas and ctx.
     * @private
     */
    _init() {
        this._createCanvasWrapper('canva-' + this.uniqueId, 'zone-' + this.uniqueId);
        this.zone = 'background';
        this._initPatterns();
        this.zone = 'triangles';
        this._initPatterns();
    }

    /**
     * Randomly returns a pattern.
     * @param {string} zone
     * @returns {string|null}
     * @private
     */
    _getRandomPattern(zone) {
        let result, value;
        if (typeof this.patterns[zone] !== 'undefined') {
            value = Math.floor(Math.random() * this.patterns[zone].length);
            result = this._getFullDecodedPath(this.patterns[zone][value].data);
        }
        return result;
    }

    /**
     * Return true if at least one chamfer is enabled.
     * @returns {boolean}
     * @private
     */
    _hasChamfer() {
        return (this.chamferRt || this.chamferRb || this.chamferLt || this.chamferLb);
    }

    /**
     * Return true if at least one round border is enabled.
     * @returns {boolean}
     * @private
     */
    _hasRoundBorder() {
        return (this._roundBorderRt || this._roundBorderRb || this._roundBorderLt || this._roundBorderLb);
    }

    /**
     * Return clean full path of a pattern.
     * @param {string} path
     * @returns {string}
     * @private
     */
    _getFullDecodedPath(path) {
        return btoa(this.patterns.path + path);
    }

    /**
     * Encode a string.
     * @param {string} stringPattern 
     */
    _encode(stringPattern) {
        return atob(stringPattern);
    }

    /**
     * Find a pattern in a list of patterns.
     * @param {string} searchedPattern
     * @return {string}
     * @private
     */
    _findPattern(searchedPattern) {
        let pattern;
        this.patterns.background.map((elem) => {
            if (elem.title === searchedPattern) {
                pattern = elem.data;
            }
        });
        return pattern;
    }

    /**
     * Initialize the background.
     * @param {string|Array} backgroundPattern
     * @private
     */
    _setBackgroundPatterns(backgroundPattern) {
        if (this._hasChamfer()) {
            this._drawChamferedRect(
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
            if (Array.isArray(backgroundPattern)) {
                this._buidMirroredPattern(backgroundPattern);
            } else {
                this._applyStyle(this.images[backgroundPattern]);
            }
            this.el_ctx.fill();
        } else {
            let pattern = this._findPattern(backgroundPattern);

            // Patterns could be stored in an array or in a single string because of mirrored patterns.
            if (Array.isArray(pattern)) {
                this._buidMirroredPattern(pattern);
                this.el_ctx.fill();
            } else {
                this._applyStyle(this.images[this._getFullDecodedPath(pattern)]);
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
            let currentImage = this.images[this._getFullDecodedPath(pattern)];
            if (currentImage) {
                // Top left.
                if (index === 0) {
                    this.el_ctx.drawImage(currentImage, 0, 0, width, height);
                }
                // Top right.
                if (index === 1) {
                    this.el_ctx.drawImage(currentImage, pow, 0, width, height);
                }
                // Bottom left.
                if (index === 2) {
                    this.el_ctx.drawImage(currentImage, 0, 200, width, height);
                }
                // Bottom right.
                if (index === 3) {
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
    _drawRoundedRect(x, y, w, h, radius, rt, lt, rb, lb) {
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
    _drawChamferedRect(x, y, w, h, radius, rt, lt, rb, lb) {
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
     * @private
     */
    _createCanvasWrapper(elementId, zoneId) {

        let _zone = document.createElement('div');
        _zone.id = zoneId;
        _zone.className = "zone";

        let _canvas = document.createElement('canvas');
        _canvas.id = elementId;
        _canvas.className = "zone--canvas";
        _canvas.width = this.width;
        _canvas.height = this.height;
        _canvas.showStrokes = this.showStrokes;

        _canvas.chamfer = this.chamfer;
        _canvas.chamferRt = this.chamferRt;
        _canvas.chamferRb = this.chamferRb;
        _canvas.chamferLt = this.chamferLt;
        _canvas.chamferLb = this.chamferLb;

        _canvas.roundBorder = this._roundBorder;
        _canvas.roundBorderRt = this.roundBorderRt;
        _canvas.roundBorderRb = this.roundBorderRb;
        _canvas.roundBorderLt = this.roundBorderLt;
        _canvas.roundBorderLb = this.roundBorderLb;

        _canvas.backgroundPatternTriangleEven = this.triangleEvenPattern;
        _canvas.backgroundPatternTriangleOdd = this.triangleOddPattern;
        _canvas.innerHTML = "Votre navigateur ne supporte pas canvas.<br>Essayez avec Firefox, Safari, Chrome ou Opera.";

        setTimeout(() => {
            this.clearCanvasLayers();
            if (_zone) {
                _zone.appendChild(_canvas);
            }
        });

        this.wrapper = _zone;
        this.el_canvas = _canvas;
        this.el_ctx = this.el_canvas.getContext('2d');

        setTimeout(() => {
            // Show download link if can download picture is set to true.
            if (this._canDownload()) {
                this._createDownloadLink('link-' + this.uniqueId, 'zone-' + this.uniqueId);
            }

            this._createDetailLink('modal-' + this.uniqueId, 'zone-' + this.uniqueId);
        });

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
     * @returns {Array}
     */
    getFiltered() {
        let filteredFull = [];
        for (let i = 0; i < this.patterns[this.zone].length; i++) {
            let pattern = this.patterns[this.zone][i];
            if (pattern.data) {
                filteredFull.push(pattern.data);
            }
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
            if (pattern.data) {
                filteredFull[pattern.title] = pattern.title;
            }
            return true;
        });
        return filteredFull;
    }

    /**
     * Initialize the patterns, we decrement a variable. When it is zero we continue the loading script of the canvas.
     * @private
     */
    _initPatterns() {
        let filteredPatterns = this.getFiltered();

        if (filteredPatterns && Array.isArray(filteredPatterns)) {
            let _imagesLoading = filteredPatterns.length;

            filteredPatterns.forEach((pattern) => {
                if (Array.isArray(pattern)) {
                    pattern.forEach((ss_pattern) => {
                        let ss_image = new Image();
                        let ss_elpattern = this._getFullDecodedPath(ss_pattern);
                        ss_image.onload = () => {
                            this.images[ss_elpattern] = ss_image;
                            this.repeatBackgroundWidth = this.width / ss_image.width;
                            this.repeatBackgroundHeight = this.height / ss_image.height;
                        };
                        ss_image.src = this._encode(ss_elpattern);

                        if (_imagesLoading === 0) {
                            this._triggeredOnPattersLoaded(this._encode(ss_elpattern));
                        }
                    });

                    --_imagesLoading;
                } else {
                    let image = new Image();
                    let elpattern = this._getFullDecodedPath(pattern);
                    image.onload = () => {
                        this.images[elpattern] = this.el_ctx.createPattern(image, 'repeat');
                        --_imagesLoading;
                        if (_imagesLoading === 0) {
                            this._triggeredOnPatternsLoaded(this._encode(elpattern));
                        }
                    };
                    image.src = this._encode(elpattern);
                }

            });
        }
    }

    /**
     * Create a link to show detail.
     * @param {number} uniqueId
     * @private
     */
    _createDetailLink(uniqueId, zoneId) {

        let _zone = document.getElementById(zoneId);
        let _link = document.createElement('button');
        _link.type = "button";
        _link.className = "btn btn-primary btn-sm";
        _link.innerText = 'Modify';
        _link.addEventListener('click', () => {
            $('#' + uniqueId).modal('toggle');
        }, false);
        if (_zone) {
            _zone.insertBefore(_link, _zone.firstChild);
        }
    }

    /**
     * Create a link to download an image of the canvas.
     * @param {number} uniqueId
     * @private
     */
    _createDownloadLink(uniqueId, zoneId) {
        let _zone = document.getElementById(zoneId);
        let _link = document.createElement('a');

        _link.innerHTML = 'Download';
        _link.classList = "btn btn-dark btn-sm";
        _link.id = uniqueId;
        _link.href = "#";
        _link.role = "button";
        _link.addEventListener('click', () => {
            _link.href = this.el_canvas.toDataURL('image/jpeg');
            _link.download = "bookmark.jpg";
        }, false);

        if (_zone) {
            _zone.insertBefore(_link, _zone.firstChild);
        }
    }

    /**
     * Create a textarea that expose the json content related to this.
     */
    _createParamDebugZone() {
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
    _drawBackgroundPattern() {
        this._setBackgroundPatterns(this.backgroundPattern);
    }

    /**
     * Apply a pattern to a context of a canvas.
     * @param {Object.<CanvasPattern>} style
     * @private
     */
    _applyStyle(style) {
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
            if (b.title === ((isEven === true) ? this.el_canvas.backgroundPatternTriangleEven : this.el_canvas.backgroundPatternTriangleOdd)) {
                pattern = b.data;
            }
        });

        this._applyStyle(this.images[this._getFullDecodedPath(pattern)]);

        //log('Render a ' + (isEven ? 'even' : 'odd') + ' triangle with ' + pattern);

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
        if (this._hasChamfer()) {
            this.el_ctx.clip();
        }

        let _triangle_height;
        this._column_width = this.el_canvas.width / this.columnsPerWidth;
        let _half_width = this._column_width / 2;

        // Draw each triangle pair.
        for (let j = 1; j <= this.numberOfPairOfTriangles; j++) {

            // Draw each column.
            for (let l = 0; l < this.columnsPerWidth; l++) {

                // Thickness of cut lines.
                this.el_ctx.lineWidth = LINE_WIDTH;

                // The offset between each column.
                this._offset = l * this._column_width;

                _triangle_height = this.el_canvas.height / (this.numberOfPairOfTriangles * 2);

                // Move these coef might glitch everything.
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

        if (this._hasChamfer()) {
            this.el_ctx.restore();
        }
    }

    /**
     * @returns {boolean}
     */
    _canDownload() {
        return this.canDownload === true;
    }

    /**
     * @returns {boolean}
     */
    _canDrawTriangle() {
        return this.enableTriangles === true;
    }

    /**
     * @returns {boolean}
     */
    _canDisplayStrokes() {
        return this.el_canvas.showStrokes === true;
    }

    /**
     * Draw strokes or not.
     * @private
     */
    _drawStrokes() {
        // If show strokes flag is on.
        if (this._canDisplayStrokes()) {
            this.el_ctx.strokeStyle = STROKE_COLOR;
            this.el_ctx.stroke();
        }
    }

    /**
     * Render the bookmark.
     */
    render() {
        setTimeout(() => {
            this._drawBackgroundPattern();
            if (this._canDrawTriangle()) {
                this._drawTriangles();
            }
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
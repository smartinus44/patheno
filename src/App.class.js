import _ from 'lodash';
import '../scss/_custom.scss';
import dat from 'dat.gui';
import BookMark from './Bookmark.class';

const TIMEOUT = 100;

export default class App {

    constructor() {
        this._init();
    }

    /**
     * @param {Bookmark} element 
     */
    _getBookmark(element) {
        /**
         * @var {Builder} builder
         */
        let builder = new BookMark.Builder(element.uniqueId)
            .sized(element.height, element.width)
            .columnsPerWidth(element.columnsPerWidth)
            .downloadable(element.canDownload)
            .withStrokes(element.showStrokes)
            .withBackground(element.backgroundPattern)
            .withNumberOfPairs(element.numberOfPairOfTriangles)
            .withTriangles(element.enableTriangles)
            .withPatterns(element.patterns, element.triangleEvenPattern, element.triangleOddPattern)
            .withChamfers(element.chamfer, element.chamferRt, element.chamferRb, element.chamferLt, element.chamferLb)
            .withRoundBorder(element.roundBorder, element.roundBorderRt, element.roundBorderRb, element.roundBorderLt, element.roundBorderLb);
        // Initial arbitrary width value.
        return new BookMark(builder);
    }

    _resetBookmarks() {
        this._bookmarks = new Array();

        try {
            (async() => {
                const rawResponse = await fetch('/bookmarks-deletes', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this._bookmarks)
                });
                const content = await rawResponse.json();
            })();
        } catch (e) {
            console.log(e);
        }

    }

    _createBookmark() {

        let _results_zone = document.querySelector('.results');

        // Initial arbitrary width value.
        let width = 200;
        let height = 200;

        let patterns = this._patterns[_.random(0, this._patterns.length - 1)];

        /**
         * @var {Builder} builder
         */
        let builder = new BookMark.Builder((this._bookmarks.length + 1))
            .sized(height, width)
            .columnsPerWidth(_.random(1, 5))
            .downloadable(true)
            .withStrokes(false)
            .withBackground(patterns.background[_.random(0, patterns.background.length - 1)].title)
            .withNumberOfPairs(_.random(1, 30))
            .withTriangles(true)
            .withPatterns(patterns, patterns.triangles[_.random(0, patterns.triangles.length - 1)].title, patterns.triangles[_.random(0, patterns.triangles.length - 1)].title)
            .withChamfers(
                _.random(1, 30),
                Boolean(_.random(0, 1)),
                Boolean(_.random(0, 1)),
                Boolean(_.random(0, 1)),
                Boolean(_.random(0, 1))
            )
            .withRoundBorder(
                _.random(1, 30),
                Boolean(_.random(0, 1)),
                Boolean(_.random(0, 1)),
                Boolean(_.random(0, 1)),
                Boolean(_.random(0, 1)));
        let bookmark = new BookMark(builder);
        this._bookmarks.push(bookmark);

        if (this._bookmarks.length > 18) {
            this._resetBookmarks();
        }
        _results_zone.prepend(bookmark.wrapper);

        this._createParamModal(bookmark);

        return bookmark;
    }

    /**
     * Create a textarea that expose the json content related to this.
     */
    _createParamDebugZone(bookMark) {
        let params = document.createElement('textarea');
        params.id = 'debug' + bookMark.uniqueId;
        params.cols = 80;
        params.rows = 10;
        params.readOnly = true;
        params.innerHTML = JSON.stringify(this);
    }

    /**
     * Create a bootstrap modal to edit params.
     * @param {BookMark} bookMark 
     */
    _createParamModal(bookMark) {

        this._addGui(bookMark);

        let _modal = document.createElement('div');
        _modal.id = 'modal-' + bookMark.uniqueId;
        _modal.classList = 'modal fade';
        _modal.tabindex = '-1';
        _modal.role = 'dialog';

        let _modalDialog = document.createElement('div');
        _modalDialog.classList = 'modal-dialog modal-dialog-centered';
        _modalDialog.role = 'document';

        let _modalContent = document.createElement('div');
        _modalContent.className = 'modal-content';

        let _modalHeader = document.createElement('div');
        _modalHeader.className = 'modal-header';

        let _modalTitle = document.createElement('h5');
        _modalTitle.className = 'modal-title';
        _modalTitle.textContent = 'Pattern #' + bookMark.uniqueId;

        let _button = document.createElement('button');
        _button.type = 'button';
        _button.className = 'close';
        _button.setAttribute('data-dismiss', 'modal');
        _button.setAttribute('aria-label', 'Close');

        let _span = document.createElement('span');
        _span.setAttribute('aria-hidden', 'true');
        _span.innerHTML = '&times;';

        let _modalBody = document.createElement('div');
        _modalBody.id = 'modal-content-' + bookMark.uniqueId;

        _modalHeader.append(_modalTitle);
        _button.append(_span);
        _modalHeader.append(_button);

        _modalContent.append(_modalHeader);
        _modalContent.append(_modalBody);

        _modalDialog.append(_modalContent);
        _modal.append(_modalDialog);

        let _modalsContainer = document.getElementsByClassName('modalsContainer');
        _modalsContainer[0].append(_modal);

        this._createDetailLink('modal-' + bookMark.uniqueId, 'zone-' + bookMark.uniqueId);
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
        _link.setAttribute('data-toggle', 'modal');
        _link.setAttribute('data-target', '#' + uniqueId);
        if (_zone) {
            _zone.insertBefore(_link, _zone.firstChild);
        }
    }

    _init() {
        this._retrievePatterns();
        this._retrieveBookmarks();
    }

    _retrievePatterns() {
        let _results_zone = document.querySelector('.results');
        fetch('/patterns')
            .then(_patterns => _patterns.json())
            .then(json => _process(json)).catch((ex) => {
                console.log('parsing failed', ex);
                _results_zone.innerText = "Unable to fetch data pattern.";
            });

        /**
         * Init demo container with datasets.
         * @param _dataset
         * @private
         */
        const _process = (_patterns) => {
            this._patterns = _patterns;
        };
    }

    _retrieveBookmarks() {

        // Get the datasets from the server.
        let _results_zone = document.querySelector('.results');

        for (var child of _results_zone.childNodes) {
            child.remove();
        }

        fetch('/bookmarks')
            .then(_bookmarks => _bookmarks.json())
            .then(json => _process(json)).catch((ex) => {
                console.log('parsing failed', ex);
                _results_zone.innerText = "Unable to fetch data.";
            });

        /**
         * Init demo container with datasets.
         * @param _dataset
         * @private
         */
        const _process = (_bookmarks) => {
            this._bookmarks = _bookmarks;
            this._bookmarks = _bookmarks.sort((a, b) => {
                if (a.uniqueId > b.uniqueId) return 1;
                if (a.uniqueId < b.uniqueId) return -1;
                return 0;
            });
            _bookmarks.forEach((element, index) => {
                let bookMark = this._getBookmark(element);
                _results_zone.appendChild(bookMark.wrapper);
                this._createParamModal(bookMark);
            });
        };
    }

    /**
     * 
     * @param {Bookmark} bookMark 
     */
    _addGui(_bookMark) {
        let _gui = new dat.GUI({
            load: JSON,
            autoPlace: false,
            closed: false
        });
        _gui.useLocalStorage = true;
        _gui.width = 498;

        /**
         * Draw the canvas with the desired number of triangle pairs.
         * @param el
         */
        const redrawNumberOfTriangles = (el) => {
            _bookMark.clearCanvasLayers();
            _bookMark.numberOfPairOfTriangles = el;
            _bookMark.render();
        };

        /**
         * Number of columns.
         * @param el
         */
        const redrawColumnsPerWidth = (el) => {
            _bookMark.columnsPerWidth = el;
            _bookMark.clearCanvasLayers();
            _bookMark.render();
        };

        /**
         * Change the height of the canvas.
         * @param el
         */
        const redrawHeight = (el) => {
            _bookMark.el_canvas.height = el;
            _bookMark.render();
        };

        /**
         * Draw bookmark with chamfer or not.
         * @param el
         */
        const redrawChamfer = (el) => {
            _bookMark.el_canvas.chamfer = el;
            redrawWidth(_bookMark.el_canvas.width);
            _bookMark.render();
        };

        /**
         * Draw the cut lines.
         * @param el
         */
        const redrawStrokes = (el) => {
            _bookMark.el_canvas.showStrokes = el;
            _bookMark.clearCanvasLayers();
            _bookMark.render();
        };

        /**
         * Change the width of the canvas.
         * @param el
         */
        const redrawWidth = (el) => {
            _bookMark.clearCanvasLayers();
            _bookMark.el_canvas.width = el;
            _bookMark.render();
        };

        /**
         * Draw the background pattern.
         * @param el
         */
        const redrawBackgroundPattern = (el) => {
            _bookMark.backgroundPattern = el;
            _bookMark.render();
            redrawWidth(_bookMark.el_canvas.width);
        };

        /**
         * Change the pattern of the even triangle.
         * @param el
         */
        const redrawTriangleEvenPattern = (el) => {
            _bookMark.el_canvas.backgroundPatternTriangleEven = el;
            _bookMark.render();
        };

        /**
         * Change the pattern of the odd triangle.
         * @param el
         */
        const redrawTriangleOddPattern = (el) => {
            _bookMark.el_canvas.backgroundPatternTriangleOdd = el;
            _bookMark.render();
        };

        /**
         * Enable the right top chamfer.
         * @param el
         */
        const redrawChamferRt = (el) => {
            _bookMark.el_canvas.chamferRt = el;
            redrawWidth(_bookMark.el_canvas.width);
            _bookMark.render();
        };

        /**
         * Enable the right bottom chamfer.
         * @param el
         */
        const redrawChamferRb = (el) => {
            _bookMark.el_canvas.chamferRb = el;
            redrawWidth(_bookMark.el_canvas.width);
            _bookMark.render();
        };

        /**
         * Enable the left top chamfer.
         * @param el
         */
        const redrawChamferLt = (el) => {
            _bookMark.el_canvas.chamferLt = el;
            redrawWidth(_bookMark.el_canvas.width);
            _bookMark.render();
        };

        /**
         * Enable the left bottom chamfer.
         * @param el
         */
        const redrawChamferLb = (el) => {
            _bookMark.el_canvas.chamferLb = el;
            redrawWidth(_bookMark.el_canvas.width);
            _bookMark.render();
        };

        // Specific patterns are excluded.
        let filteredBackgroundFull = _bookMark.getFilteredPatternsObjects('background');
        let filteredTrianglesFull = _bookMark.getFilteredPatternsObjects('triangles');

        // Attach param instance to the bookmark.
        _gui.add(_bookMark, 'numberOfPairOfTriangles', 1, 30, 1).onFinishChange(redrawNumberOfTriangles);
        _gui.add(_bookMark, 'columnsPerWidth', 1, 5, 1).onFinishChange(redrawColumnsPerWidth);

        _gui.add(_bookMark, 'height', 150, 1200, 0.5).onFinishChange(redrawHeight);
        _gui.add(_bookMark, 'width', 150, 1200, 0.5).onFinishChange(redrawWidth);

        _gui.add(_bookMark, 'backgroundPattern', filteredBackgroundFull).onFinishChange(redrawBackgroundPattern);

        _gui.add(_bookMark, 'enableTriangles', true, false).onFinishChange((el) => {
            _bookMark.enableTriangles = el;
            _bookMark.render();
        });

        _gui.add(_bookMark, 'triangleEvenPattern', filteredTrianglesFull).onFinishChange(redrawTriangleEvenPattern);
        _gui.add(_bookMark, 'triangleOddPattern', filteredTrianglesFull).onFinishChange(redrawTriangleOddPattern);

        _gui.add(_bookMark, 'showStrokes').onFinishChange(redrawStrokes);

        _gui.add(_bookMark, 'chamfer', 0, (_bookMark.el_canvas.width / 2), 1).onFinishChange(redrawChamfer);
        _gui.add(_bookMark, 'chamferRt').onFinishChange(redrawChamferRt);
        _gui.add(_bookMark, 'chamferRb').onFinishChange(redrawChamferRb);
        _gui.add(_bookMark, 'chamferLt').onFinishChange(redrawChamferLt);
        _gui.add(_bookMark, 'chamferLb').onFinishChange(redrawChamferLb);

        setTimeout(() => {
            let customContainer = document.getElementById('modal-content-' + _bookMark.uniqueId);
            customContainer.appendChild(_gui.domElement);
        }, TIMEOUT);

        // Enables you to save the settings in the localstorage.
        _gui.remember(_bookMark);
    }

    render() {
        let generateButton = document.querySelector('#generate');

        generateButton.addEventListener('click', _ => {
            let generatedBookMark = this._createBookmark();
            // Add to patterns
            try {
                (async() => {
                    const rawResponse = await fetch('/bookmarks', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(generatedBookMark)
                    });
                    const content = await rawResponse.json();
                    // .'The "data to append" was appended to file!'
                })();
            } catch (e) {
                console.log(e);
            }
        });
    }
}
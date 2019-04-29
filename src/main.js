'use strict';

import _ from 'lodash';
import '../scss/_custom.scss';
import dat from 'dat.gui';
import BookMark from '../src/Bookmark.class';


export class App {

    constructor() {
        this._init();
    }

    /**
     * 
     * @param {Bookmark} element 
     */
    _getBookmark(element) {
        // Initial arbitrary width value.
        return new BookMark(
            element.uniqueId,
            element.height,
            element.width,
            element.backgroundPattern,
            element.numberOfPairOfTriangles,
            element.enableTriangles,
            element.triangleEvenPattern,
            element.triangleOddPattern,
            element.showStrokes,
            element.columnsPerWidth,
            element.canDownload,
            element.patterns,
            element.chamfer,
            element.chamferRt,
            element.chamferRb,
            element.chamferLt,
            element.chamferLb
        );
    }

    _createBookmark() {

        let _results_zone = document.getElementById("results");

        // Initial arbitrary width value.
        let width = 200;
        let height = 200;

        let patterns = _.first(this._patterns);

        let bookmark = new BookMark(
            (this._bookmarks.length + 1),
            height,
            width,
            patterns.background[_.random(0, patterns.background.length - 1)].title,
            _.random(1, 30),
            true,
            patterns.triangles[_.random(0, patterns.triangles.length - 1)].title,
            patterns.triangles[_.random(0, patterns.triangles.length - 1)].title,
            false,
            _.random(1, 5),
            Boolean(_.random(0, 1)),
            patterns,
            _.random(1, 30),
            Boolean(_.random(0, 1)),
            Boolean(_.random(0, 1)),
            Boolean(_.random(0, 1)),
            Boolean(_.random(0, 1))
        );

        _results_zone.prepend(bookmark.el_canvas);

        return bookmark;
    }

    _init() {

        this._retrievePatterns();
        this._retrieveBookmarks();

        const addGui = _ => {

            let _gui = new dat.GUI({
                load: JSON
            });
            _gui.useLocalStorage = true;
            _gui.width = 380;

            let _folder = _gui.addFolder('Example ' + index);

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
            _folder.add(_bookMark, 'numberOfPairOfTriangles', 1, 30, 1).onFinishChange(redrawNumberOfTriangles);
            _folder.add(_bookMark, 'columnsPerWidth', 1, 5, 1).onFinishChange(redrawColumnsPerWidth);

            _folder.add(_bookMark, 'height', 150, 1200, 0.5).onFinishChange(redrawHeight);
            _folder.add(_bookMark, 'width', 150, 1200, 0.5).onFinishChange(redrawWidth);

            _folder.add(_bookMark, 'backgroundPattern', filteredBackgroundFull).onFinishChange(redrawBackgroundPattern);

            _folder.add(_bookMark, 'enableTriangles', true, false).onFinishChange((el) => {
                _bookMark.enableTriangles = el;
                _bookMark.render();
            });

            _folder.add(_bookMark, 'triangleEvenPattern', filteredTrianglesFull).onFinishChange(redrawTriangleEvenPattern);
            _folder.add(_bookMark, 'triangleOddPattern', filteredTrianglesFull).onFinishChange(redrawTriangleOddPattern);

            _folder.add(_bookMark, 'showStrokes').onFinishChange(redrawStrokes);

            _folder.add(_bookMark, 'chamfer', 0, (_bookMark.el_canvas.width / 2), 1).onFinishChange(redrawChamfer);
            _folder.add(_bookMark, 'chamferRt').onFinishChange(redrawChamferRt);
            _folder.add(_bookMark, 'chamferRb').onFinishChange(redrawChamferRb);
            _folder.add(_bookMark, 'chamferLt').onFinishChange(redrawChamferLt);
            _folder.add(_bookMark, 'chamferLb').onFinishChange(redrawChamferLb);

            // Enables you to save the settings in the localstorage.
            _gui.remember(_bookMark);
        };

    };

    _retrievePatterns() {

        let _results_zone = document.getElementById("results");

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
        let _results_zone = document.getElementById("results");

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

            this._bookmarks = _bookmarks.sort((a, b) => {
                if (a.uniqueId < b.uniqueId) return 1;
                if (a.uniqueId > b.uniqueId) return -1;
                return 0;

            });
            this._bookmarks.forEach((element, index) => {
                let _bookMark = this._getBookmark(element);
                _results_zone.appendChild(_bookMark.el_canvas);
            });
        };
    }
}

// When the page is loaded, the initialization function is called.
window.onload = _ => {
    let app = new App();
    let generateButton = document.getElementById('generate');

    generateButton.addEventListener('click', _ => {
        app.generatedBookMark = app._createBookmark();
        // Add to patterns
        (async() => {
            const rawResponse = await fetch('/bookmarks', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(app.generatedBookMark)

            });
            //const content = await rawResponse.json();
        })();
    });
};
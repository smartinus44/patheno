import _ from 'lodash';
import '../scss/_custom.scss';
import dat from '../node_modules/dat.gui/build/dat.gui.js'
import BookMark from '../src/Bookmark.class'

const NUMBER_OF_LAYERS = 3;

// When the page is loaded, the initialization function is called.
window.onload = function () {
	let init = function () {
		let _gui = new dat.GUI({load: JSON});
		_gui.useLocalStorage = true;
		_gui.width = 380;

		// Get the datasets from the server.
		fetch('http://127.0.0.1:3000/patterns')
			.then(dataset => dataset.json())
			.then(json => _process(json)
			).catch(function (ex) {
			console.log('parsing failed', ex)
		});

		/**
		 * Init demo container with datasets.
		 * @param _dataset
		 * @private
		 */
		function _process(_dataset) {

			for (let i = 1; i <= NUMBER_OF_LAYERS; i++) {

				let _bookMark = new BookMark(i, 1063, 295, _dataset[i - 1].background[0], _.random(1, 30), null, null, false, _.random(1, 5), true, _dataset[i - 1]);
				let _folder = _gui.addFolder('Example with dataset ' + i);

				/**
				 * Draw the canvas with the desired number of triangle pairs.
				 * @param el
				 */
				function redrawNumberOfTriangles(el) {
					_bookMark.clearCanvasLayers();
					_bookMark.numberOfPairOfTriangles = el;
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				/**
				 * Number of columns.
				 * @param el
				 */
				function redrawColumnsPerWidth(el) {
					_bookMark.columnsPerWidth = el;
					_bookMark.clearCanvasLayers();
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				/**
				 * Change the height of the canvas.
				 * @param el
				 */
				function redrawHeight(el) {
					_bookMark.el_canvas.height = el;
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				/**
				 * Change the width of the canvas.
				 * @param el
				 */
				function redrawWidth(el) {
					_bookMark.el_canvas.width = el;
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				/**
				 * Change the pattern of the even triangle.
				 * @param el
				 */
				function redrawTriangleEvenPattern(el) {
					_bookMark.el_canvas.backgroundPatternTriangleEven = el;
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				/**
				 * Change the pattern of the odd triangle.
				 * @param el
				 */
				function redrawTriangleOddPattern(el) {
					_bookMark.el_canvas.backgroundPatternTriangleOdd = el;
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				/**
				 * Draw the cut lines.
				 * @param el
				 */
				function redrawStrokes(el) {
					_bookMark.el_canvas.showStrokes = el;
					_bookMark.clearCanvasLayers();
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				/**
				 * Draw the background pattern.
				 * @param el
				 */
				function redrawBackgroundPattern(el) {
					_bookMark.el_ctx.fillStyle = _bookMark.images[el];
					_bookMark.el_ctx.fillRect(0, 0, _bookMark.el_canvas.width, _bookMark.el_canvas.height);
					_bookMark.drawTriangles();
				}

				// Attach param instance to the bookmark.
				_folder.add(_bookMark, 'numberOfPairOfTriangles', 1, 30, 1).onFinishChange(redrawNumberOfTriangles);
				_folder.add(_bookMark, 'columnsPerWidth', 1, 5, 1).onFinishChange(redrawColumnsPerWidth);
				_folder.add(_bookMark, 'height', 100, 1200, 0.5).onFinishChange(redrawHeight);
				_folder.add(_bookMark, 'width', 100, 335, 0.5).onFinishChange(redrawWidth);
				_folder.add(_bookMark, 'backgroundPattern', _bookMark.patterns['background']).onFinishChange(redrawBackgroundPattern);
				_folder.add(_bookMark, 'triangleEvenPattern', _bookMark.patterns['triangles']).onFinishChange(redrawTriangleEvenPattern);
				_folder.add(_bookMark, 'triangleOddPattern', _bookMark.patterns['triangles']).onFinishChange(redrawTriangleOddPattern);
				_folder.add(_bookMark, 'showStrokes').onFinishChange(redrawStrokes);

				// Enables you to save the settings in the localstorage.
				_gui.remember(_bookMark);
			}

			// Let's construct a non editable canvas without link.
			let demo = new BookMark('demo',
				300,
				300,
				"Frene",
				3,
				"Citronnier",
				"Cypres",
				false,
				1,
				true,
				_dataset[0]
			);
		}
	};
	init();
};

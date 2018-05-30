import _ from 'lodash';
import '../scss/_custom.scss';
import dat from 'dat.gui'
import BookMark from '../src/Bookmark.class'

const NUMBER_OF_LAYERS = 3;

// When the page is loaded, the initialization function is called.
window.onload = function () {
	let init = function () {
		let _gui = new dat.GUI({load: JSON});
		_gui.useLocalStorage = true;
		_gui.width = 380;

		// Get the datasets from the server.
		fetch('http://parthenojs.com/patterns')
			.then(dataset => dataset.json())
			.then(json => _process(json)
			).catch(function (ex) {
			console.log('parsing failed', ex);
			let _results_zone = document.getElementById("results");
			_results_zone.innerText = "Unable to fetch data.";
		});

		/**
		 * Init demo container with datasets.
		 * @param _dataset
		 * @private
		 */
		function _process(_dataset) {

			for (let i = 1; i <= NUMBER_OF_LAYERS; i++) {

				// Initial arbitrary width value.
				let width = 295;
				let _bookMark = new BookMark(i, 1063, width, _dataset[i - 1].background[0], _.random(1, 30), null, null,
					false, _.random(1, 5), true, _dataset[i - 1], _.random(1, (width / 2)), true, false, false, false);
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
				 * Draw bookmark with chamfer or not.
				 * @param el
				 */
				function redrawChamfer(el) {
					_bookMark.el_canvas.chamfer = el;
					_bookMark.el_canvas.width = _bookMark.width;
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
				 * Draw the background pattern.
				 * @param el
				 */
				function redrawBackgroundPattern(el) {
					_bookMark.el_ctx.fillStyle = _bookMark.images[el];
					_bookMark.el_ctx.fillRect(0, 0, _bookMark.el_canvas.width, _bookMark.el_canvas.height);
					_bookMark.drawTriangles();
				}

				/**
				 * Enable the right top chamfer.
				 * @param el
				 */
				function redrawChamferRt(el) {
					_bookMark.el_canvas.chamferRt = el;
					_bookMark.el_canvas.width = _bookMark.width;
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				/**
				 * Enable the right bottom chamfer.
				 * @param el
				 */
				function redrawChamferRb(el) {
					_bookMark.el_canvas.chamferRb = el;
					_bookMark.el_canvas.width = _bookMark.width;
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				/**
				 * Enable the left top chamfer.
				 * @param el
				 */
				function redrawChamferLt(el) {
					_bookMark.el_canvas.chamferLt = el;
					_bookMark.el_canvas.width = _bookMark.width;
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				/**
				 * Enable the left bottom chamfer.
				 * @param el
				 */
				function redrawChamferLb(el) {
					_bookMark.el_canvas.chamferLb = el;
					_bookMark.el_canvas.width = _bookMark.width;
					_bookMark.setBackgroundPattern(_bookMark.backgroundPattern);
					_bookMark.drawTriangles();
				}

				// Attach param instance to the bookmark.
				_folder.add(_bookMark, 'numberOfPairOfTriangles', 1, 30, 1).onFinishChange(redrawNumberOfTriangles);
				_folder.add(_bookMark, 'columnsPerWidth', 1, 5, 1).onFinishChange(redrawColumnsPerWidth);
				_folder.add(_bookMark, 'height', 100, 1200, 0.5).onFinishChange(redrawHeight);
				_folder.add(_bookMark, 'width', 150, 300, 0.5).onFinishChange(redrawWidth);
				_folder.add(_bookMark, 'backgroundPattern', _bookMark.patterns['background']).onFinishChange(redrawBackgroundPattern);
				_folder.add(_bookMark, 'triangleEvenPattern', _bookMark.patterns['triangles']).onFinishChange(redrawTriangleEvenPattern);
				_folder.add(_bookMark, 'triangleOddPattern', _bookMark.patterns['triangles']).onFinishChange(redrawTriangleOddPattern);
				_folder.add(_bookMark, 'showStrokes').onFinishChange(redrawStrokes);
				_folder.add(_bookMark, 'chamfer', 0, (_bookMark.el_canvas.width / 2), 1).onFinishChange(redrawChamfer);
				_folder.add(_bookMark, 'chamferRt').onFinishChange(redrawChamferRt);
				_folder.add(_bookMark, 'chamferRb').onFinishChange(redrawChamferRb);
				_folder.add(_bookMark, 'chamferLt').onFinishChange(redrawChamferLt);
				_folder.add(_bookMark, 'chamferLb').onFinishChange(redrawChamferLb);

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
				_dataset[0],
				10,
				false,
				false,
				false,
				false
			);
		}
	};
	init();
};

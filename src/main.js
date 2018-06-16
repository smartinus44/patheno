import _ from 'lodash';
import '../scss/_custom.scss';
import dat from 'dat.gui'
import BookMark from '../src/Bookmark.class'

// When the page is loaded, the initialization function is called.
window.onload = function () {
	let init = function () {
		let _gui = new dat.GUI({load: JSON});
		_gui.useLocalStorage = true;
		_gui.width = 380;

		// Get the datasets from the server.
		fetch('/patterns')
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

			for (let i = 1; i <= _dataset.length; i++) {

				// Initial arbitrary width value.
				let width = 295;
				let collection = _dataset[i - 1];
				let _bookMark = new BookMark(
					1063,
					width,
					collection.background[0].data,
					_.random(1, 30),
					true,
					null,
					null,
					false,
					_.random(1, 5),
					true,
					collection,
					_.random(1, (width / 2)),
					false,
					false,
					false,
					false
				);
				_bookMark.setUniqueId(i);

				let _folder = _gui.addFolder('Example with dataset ' + i);

				/**
				 * Draw the canvas with the desired number of triangle pairs.
				 * @param el
				 */
				function redrawNumberOfTriangles(el) {
					_bookMark.clearCanvasLayers();
					_bookMark.numberOfPairOfTriangles = el;
					_bookMark.render();
				}

				/**
				 * Number of columns.
				 * @param el
				 */
				function redrawColumnsPerWidth(el) {
					_bookMark.columnsPerWidth = el;
					_bookMark.clearCanvasLayers();
					_bookMark.render();
				}

				/**
				 * Change the height of the canvas.
				 * @param el
				 */
				function redrawHeight(el) {
					_bookMark.el_canvas.height = el;
					_bookMark.render();
				}

				/**
				 * Draw bookmark with chamfer or not.
				 * @param el
				 */
				function redrawChamfer(el) {
					_bookMark.el_canvas.chamfer = el;
					_bookMark.el_canvas.width = _bookMark.width;
					_bookMark.render();
				}

				/**
				 * Draw the cut lines.
				 * @param el
				 */
				function redrawStrokes(el) {
					_bookMark.el_canvas.showStrokes = el;
					_bookMark.clearCanvasLayers();
					_bookMark.render();
				}

				/**
				 * Change the pattern of the even triangle.
				 * @param el
				 */
				function redrawTriangleEvenPattern(el) {
					_bookMark.el_canvas.backgroundPatternTriangleEven = el;
					_bookMark.render();
				}

				/**
				 * Change the pattern of the odd triangle.
				 * @param el
				 */
				function redrawTriangleOddPattern(el) {
					_bookMark.el_canvas.backgroundPatternTriangleOdd = el;
					_bookMark.render();
				}

				/**
				 * Change the width of the canvas.
				 * @param el
				 */
				function redrawWidth(el) {
					_bookMark.el_canvas.width = el;
					_bookMark.render();
				}

				/**
				 * Draw the background pattern.
				 * @param el
				 */
				function redrawBackgroundPattern(el) {
					_bookMark.backgroundPattern = el;
					_bookMark.render();
					redrawWidth(_bookMark.el_canvas.width);
				}

				/**
				 * Enable the right top chamfer.
				 * @param el
				 */
				function redrawChamferRt(el) {
					_bookMark.el_canvas.chamferRt = el;
					redrawWidth(_bookMark.el_canvas.width);
					_bookMark.render();
				}

				/**
				 * Enable the right bottom chamfer.
				 * @param el
				 */
				function redrawChamferRb(el) {
					_bookMark.el_canvas.chamferRb = el;
					_bookMark.el_canvas.width = _bookMark.width;
					_bookMark.render();
				}

				/**
				 * Enable the left top chamfer.
				 * @param el
				 */
				function redrawChamferLt(el) {
					_bookMark.el_canvas.chamferLt = el;
					_bookMark.el_canvas.width = _bookMark.width;
					_bookMark.render();
				}

				/**
				 * Enable the left bottom chamfer.
				 * @param el
				 */
				function redrawChamferLb(el) {
					_bookMark.el_canvas.chamferLb = el;
					_bookMark.el_canvas.width = _bookMark.width;
					_bookMark.render();
				}

				// Specific patterns are excluded.
				let filteredBackgroundFull = _bookMark.getFilteredPatternsObjects('background');
				let filteredTrianglesFull = _bookMark.getFilteredPatternsObjects('triangles');

				// Attach param instance to the bookmark.
				_folder.add(_bookMark, 'numberOfPairOfTriangles', 1, 30, 1).onFinishChange(redrawNumberOfTriangles);
				_folder.add(_bookMark, 'columnsPerWidth', 1, 5, 1).onFinishChange(redrawColumnsPerWidth);

				_folder.add(_bookMark, 'height', 150, 1200, 0.5).onFinishChange(redrawHeight);
				_folder.add(_bookMark, 'width', 150, 1200, 0.5).onFinishChange(redrawWidth);

				_folder.add(_bookMark, 'backgroundPattern', filteredBackgroundFull).onFinishChange(redrawBackgroundPattern);

				_folder.add(_bookMark, 'enableTriangles', true, false).onFinishChange(function (el) {
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
			}

			// Let's construct a non editable canvas without link.
			/*
			let demo = new BookMark(
				'demo'
				300,
				300,
				"/images/dataset/1/etre.jpg",
				3,
				true,
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
			);*/
		}
	};
	init();
};

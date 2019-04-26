import _ from 'lodash';
import '../scss/_custom.scss';
import dat from 'dat.gui'
import BookMark from '../src/Bookmark.class'

// When the page is loaded, the initialization function is called.
window.onload = () => {
	let init = () => {
		let _gui = new dat.GUI({load: JSON});
		_gui.useLocalStorage = true;
		_gui.width = 380;

		// Get the datasets from the server.
		fetch('/patterns')
			.then(dataset => dataset.json())
			.then(json => _process(json)
			).catch((ex) => {
			console.log('parsing failed', ex);
			let _results_zone = document.getElementById("results");
			_results_zone.innerText = "Unable to fetch data.";
		});

		/**
		 * Init demo container with datasets.
		 * @param _dataset
		 * @private
		 */
		const _process = (_dataset) => {

			_dataset.forEach((element, index) => {
		
				// Initial arbitrary width value.
				let width = 295;
				let collection = element;
				let _bookMark = new BookMark(
					index,
					1063,
					width,
					collection.background[0].title,
					_.random(1, 30),
					true,
					collection.triangles[0].title,
					collection.triangles[1].title,
					false,
					_.random(1, 5),
					true,
					collection,
					0,
					false,
					false,
					false,
					false
				);

				let _folder = _gui.addFolder('Example ' + index);

				/**
				 * Draw the canvas with the desired number of triangle pairs.
				 * @param el
				 */
				const redrawNumberOfTriangles = (el) => {
					_bookMark.clearCanvasLayers();
					_bookMark.numberOfPairOfTriangles = el;
					_bookMark.render();
				}

				/**
				 * Number of columns.
				 * @param el
				 */
				const redrawColumnsPerWidth = (el) => {
					_bookMark.columnsPerWidth = el;
					_bookMark.clearCanvasLayers();
					_bookMark.render();
				}

				/**
				 * Change the height of the canvas.
				 * @param el
				 */
				const redrawHeight = (el) => {
					_bookMark.el_canvas.height = el;
					_bookMark.render();
				}

				/**
				 * Draw bookmark with chamfer or not.
				 * @param el
				 */
				const redrawChamfer = (el) => {
					_bookMark.el_canvas.chamfer = el;
					redrawWidth(_bookMark.el_canvas.width);
					_bookMark.render();
				}

				/**
				 * Draw the cut lines.
				 * @param el
				 */
				const redrawStrokes = (el) => {
					_bookMark.el_canvas.showStrokes = el;
					_bookMark.clearCanvasLayers();
					_bookMark.render();
				}

				/**
				 * Change the width of the canvas.
				 * @param el
				 */
				const redrawWidth = (el) => {
					_bookMark.clearCanvasLayers();
					_bookMark.el_canvas.width = el;
					_bookMark.render();
				}

				/**
				 * Draw the background pattern.
				 * @param el
				 */
				const redrawBackgroundPattern = (el) => {
					_bookMark.backgroundPattern = el;
					_bookMark.render();
					redrawWidth(_bookMark.el_canvas.width);
				}

				/**
				 * Change the pattern of the even triangle.
				 * @param el
				 */
				const redrawTriangleEvenPattern = (el) => {
					_bookMark.el_canvas.backgroundPatternTriangleEven = el;
					_bookMark.render();
				}

				/**
				 * Change the pattern of the odd triangle.
				 * @param el
				 */
				const redrawTriangleOddPattern = (el) => {
					_bookMark.el_canvas.backgroundPatternTriangleOdd = el;
					_bookMark.render();
				}

				/**
				 * Enable the right top chamfer.
				 * @param el
				 */
				const redrawChamferRt = (el) => {
					_bookMark.el_canvas.chamferRt = el;
					redrawWidth(_bookMark.el_canvas.width);
					_bookMark.render();
				}

				/**
				 * Enable the right bottom chamfer.
				 * @param el
				 */
				const redrawChamferRb = (el) => {
					_bookMark.el_canvas.chamferRb = el;
					redrawWidth(_bookMark.el_canvas.width);
					_bookMark.render();
				}

				/**
				 * Enable the left top chamfer.
				 * @param el
				 */
				const redrawChamferLt = (el) => {
					_bookMark.el_canvas.chamferLt = el;
					redrawWidth(_bookMark.el_canvas.width);
					_bookMark.render();
				}

				/**
				 * Enable the left bottom chamfer.
				 * @param el
				 */
				const redrawChamferLb = (el) => {
					_bookMark.el_canvas.chamferLb = el;
					redrawWidth(_bookMark.el_canvas.width);
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
			});
		}
	};
	init();
};

//import 'bootstrap';
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
		let _patterns = {
			'background': ["Frene", "Erable", "Sycomore", "Chene"],
			'triangles': ["Poirier", "Citronnier", "Cypres", "Etre", "Merisier"]
		};
		for (let i = 1; i <= NUMBER_OF_LAYERS; i++) {
			let _bookMark = new BookMark(i, 485, 300, "Frene", _.random(1, 15), null, null, false, _.random(1, 15), true, _patterns);
			let _folder = _gui.addFolder('Example ' + i);

			/**
			 * Draw the canvas with the desired number of triangle pairs.
			 * @param el
			 */
			function redrawNumberOfTriangles(el) {
				_bookMark.clearCanvasLayers();
				_bookMark.numberOfPairOfTriangles = el;
				_bookMark.setBackgroundPattern(_bookMark.color);
				_bookMark.drawTriangles();
			}

			/**
			 * Number of columns.
			 * @param el
			 */
			function redrawColumnsPerWidth(el) {
				_bookMark.columnsPerWidth = el;
				_bookMark.clearCanvasLayers();
				_bookMark.setBackgroundPattern(_bookMark.color);
				_bookMark.drawTriangles();
			}

			/**
			 * Change the height of the canvas.
			 * @param el
			 */
			function redrawHeight(el) {
				_bookMark.el_canvas.height = el;
				_bookMark.setBackgroundPattern(_bookMark.color);
				_bookMark.drawTriangles();
			}

			/**
			 * Change the width of the canvas.
			 * @param el
			 */
			function redrawWidth(el) {
				_bookMark.el_canvas.width = el;
				_bookMark.setBackgroundPattern(_bookMark.color);
				_bookMark.drawTriangles();
			}

			/**
			 * Change the pattern of the even triangle.
			 * @param el
			 */
			function redrawTriangleEvenPattern(el) {
				_bookMark.el_canvas.colorTriangleEven = el;
				_bookMark.setBackgroundPattern(_bookMark.color);
				_bookMark.drawTriangles();
			}

			/**
			 * Change the pattern of the odd triangle.
			 * @param el
			 */
			function redrawTriangleOddPattern(el) {
				_bookMark.el_canvas.colorTriangleOdd = el;
				_bookMark.setBackgroundPattern(_bookMark.color);
				_bookMark.drawTriangles();
			}

			/**
			 * Draw the cut lines.
			 * @param el
			 */
			function redrawStrokes(el) {
				_bookMark.el_canvas.showStrokes = el;
				_bookMark.clearCanvasLayers();
				_bookMark.setBackgroundPattern(_bookMark.color);
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
			_folder.add(_bookMark, 'numberOfPairOfTriangles', 1, 15, 1).onFinishChange(redrawNumberOfTriangles);
			_folder.add(_bookMark, 'columnsPerWidth', 1, 15, 1).onFinishChange(redrawColumnsPerWidth);
			_folder.add(_bookMark, 'height', 100, 1000, 0.5).onFinishChange(redrawHeight);
			_folder.add(_bookMark, 'width', 100, 300, 0.5).onFinishChange(redrawWidth);
			_folder.add(_bookMark, 'color', _bookMark.patterns['background']).onFinishChange(redrawBackgroundPattern);
			_folder.add(_bookMark, 'triangleEvenPattern', _bookMark.patterns['triangles']).onFinishChange(redrawTriangleEvenPattern);
			_folder.add(_bookMark, 'triangleOddPattern', _bookMark.patterns['triangles']).onFinishChange(redrawTriangleOddPattern);
			_folder.add(_bookMark, 'showStrokes').onFinishChange(redrawStrokes);

			// Enables you to save the settings in the localstorage.
			_gui.remember(_bookMark);
		}

		// Let's construct a non editable canvas without link.
		let canvasOfDemo = new BookMark('demo',
			300,
			300,
			"Frene",
			3,
			"Citronnier",
			"Cypres",
			false,
			1,
			true,
			_patterns
		);
	};

	init();
};

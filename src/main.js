//import _ from 'lodash';
//import 'bootstrap';
import '../scss/_custom.scss';
import dat from '../node_modules/dat.gui/build/dat.gui.js'
import BookMark from '../src/bookmark.class'
import Params from '../src/params.class'

const NUMBER_OF_LAYERS = 3;

// When the page is loaded, the initialization function is called.
window.onload = function () {
	let init = function () {
		let _gui = new dat.GUI({load: JSON});
		_gui.useLocalStorage = true;
		_gui.width = 380;
		let _patterns = ["Erable", "Poirier", "Sycomore", "Etre", "Citronnier", "Chene", "Cypres", "Frene", "Merisier"];
		for (let i = 1; i <= NUMBER_OF_LAYERS; i++) {
			let _params = new Params(485, 300, "Frene", i, null, null, false, 3, true);
			let _bookMark = new BookMark(i, _params, _patterns);
			let _folder = _gui.addFolder('Example ' + i);

			/**
			 * Draw the canvas with the desired number of triangle pairs.
			 * @param el
			 */
			function redrawNumberOfTriangles(el) {
				_bookMark.clearCanvasLayers();
				_bookMark.numberOfPairOfTriangles = el;
				_bookMark.setBackgroundPattern(_bookMark.params.color);
				_bookMark.drawTriangles(_bookMark.params);
			}

			/**
			 * Number of columns.
			 * @param el
			 */
			function redrawColumnsPerWidth(el) {
				_bookMark.params.columnsPerWidth = el;
				_bookMark.clearCanvasLayers();
				_bookMark.setBackgroundPattern(_bookMark.params.color);
				_bookMark.drawTriangles(_bookMark.params);
			}

			/**
			 * Change the height of the canvas.
			 * @param el
			 */
			function redrawHeight(el) {
				_bookMark.el_canvas.height = el;
				_bookMark.setBackgroundPattern(_bookMark.params.color);
				_bookMark.drawTriangles(_bookMark.params);
			}

			/**
			 * Change the width of the canvas.
			 * @param el
			 */
			function redrawWidth(el) {
				_bookMark.el_canvas.width = el;
				_bookMark.setBackgroundPattern(_bookMark.params.color);
				_bookMark.drawTriangles(_bookMark.params);
			}

			/**
			 * Change the pattern of the even triangle.
			 * @param el
			 */
			function redrawTriangleEvenPattern(el) {
				_bookMark.el_canvas.colorTriangleEven = el;
				_bookMark.setBackgroundPattern(_bookMark.params.color);
				_bookMark.drawTriangles(_bookMark.params);
			}

			/**
			 * Change the pattern of the odd triangle.
			 * @param el
			 */
			function redrawTriangleOddPattern(el) {
				_bookMark.el_canvas.colorTriangleOdd = el;
				_bookMark.setBackgroundPattern(_bookMark.params.color);
				_bookMark.drawTriangles(_bookMark.params);
			}

			/**
			 * Draw the cut lines.
			 * @param el
			 */
			function redrawStrokes(el) {
				_bookMark.el_canvas.showStrokes = el;
				_bookMark.clearCanvasLayers();
				_bookMark.setBackgroundPattern(_bookMark.params.color);
				_bookMark.drawTriangles(_bookMark.params);
			}

			/**
			 * Draw the background pattern.
			 * @param el
			 */
			function redrawBackgroundPattern(el) {
				_bookMark.el_ctx.fillStyle = _bookMark.images[el];
				_bookMark.el_ctx.fillRect(0, 0, _bookMark.el_canvas.width, _bookMark.el_canvas.height);
				_bookMark.drawTriangles(_bookMark.params);
			}

			// Attach param instance to the bookmark.
			_folder.add(_bookMark.params, 'numberOfPairOfTriangles', 1, 15, 1).onFinishChange(redrawNumberOfTriangles);
			_folder.add(_bookMark.params, 'columnsPerWidth', 1, 15, 1).onFinishChange(redrawColumnsPerWidth);
			_folder.add(_bookMark.params, 'height', 100, 1000, 0.5).onFinishChange(redrawHeight);
			_folder.add(_bookMark.params, 'width', 100, 300, 0.5).onFinishChange(redrawWidth);
			_folder.add(_bookMark.params, 'color', _bookMark.patterns).onFinishChange(redrawBackgroundPattern);
			_folder.add(_bookMark.params, 'triangleEvenPattern', _bookMark.patterns).onFinishChange(redrawTriangleEvenPattern);
			_folder.add(_bookMark.params, 'triangleOddPattern', _bookMark.patterns).onFinishChange(redrawTriangleOddPattern);
			_folder.add(_bookMark.params, 'showStrokes').onFinishChange(redrawStrokes);

			// Enables you to save the settings in the localstorage.
			_gui.remember(_bookMark.params);
		}

		// Let's construct a non editable canvas without link.
		let canvasOfDemo = new BookMark('demo', new Params(
			300,
			300,
			"Frene",
			3,
			"Citronnier",
			"Cypres",
			false,
			1,
			true
		), _patterns);
	};

	init();
};

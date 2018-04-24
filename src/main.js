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

		// @todo: this should be externalized in a service.
		let _patterns_dataset = [{
			'background': [
				"images/dataset/1/bubimga.jpg",
				"images/dataset/1/teck.jpg",
				"images/dataset/1/sycomore.jpg",
				"images/dataset/1/etre.jpg",
			],
			'triangles': [
				"images/dataset/1/eucalyptus.jpg",
				"images/dataset/1/chene.jpg",
				"images/dataset/1/aniegré.jpg",
				"images/dataset/1/merisier.jpg",
				"images/dataset/1/noyer.jpg",
			]
		},
		{
			'background': [
				"images/dataset/2/FreneJapon.jpg",
				"images/dataset/2/ErableUS.jpg",
				"images/dataset/2/Sycomore.jpg",
				"images/dataset/2/cheneLargeVanille.jpg",
			],
			'triangles': [
				"images/dataset/2/Poirier.jpg",
				"images/dataset/2/Citronnier.jpg",
				"images/dataset/2/Cypres.jpg",
				"images/dataset/2/EtreBlanc.jpg",
				"images/dataset/2/MerisierDeFrance.jpg"
			]
		},
		{
			'background': [
				"images/dataset/3/Frene.jpg",
				"images/dataset/3/Erable.jpg",
				"images/dataset/3/Sycomore.jpg",
				"images/dataset/3/Chene.jpg",
			],
			'triangles': [
				"images/dataset/3/Poirier.jpg",
				"images/dataset/3/Citronnier.jpg",
				"images/dataset/3/Cypres.jpg",
				"images/dataset/3/Etre.jpg",
				"images/dataset/3/Merisier.jpg"
			]
		}];

		for (let i = 1; i <= NUMBER_OF_LAYERS; i++) {

			let _bookMark = new BookMark(i, 1063, 295, _patterns_dataset[i-1].background[0], _.random(1, 30), null, null, false, _.random(1, 5), true, _patterns_dataset[i-1]);
			let _folder = _gui.addFolder('Example avec le jeu de données ' + i);

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
			_patterns_dataset[0]
		);
	};
	init();
};

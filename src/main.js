//import _ from 'lodash';
import 'bootstrap';
import '../scss/_custom.scss';
import dat from '../node_modules/dat.gui/build/dat.gui.js'
import BookMark from '../src/parthenon'

const NUMBER_OF_LAYERS = 3;

// When the page is loaded, the initialization function is called.
window.onload = function () {
	let init = function () {
		let gui = new dat.GUI({load: JSON});
		gui.useLocalStorage = true;
		gui.width = 380;

		for (let i = 1; i <= NUMBER_OF_LAYERS; i++) {
			let bookMark = new BookMark(i);
			// Créé un lien de téléchargement de l'image liée au canvas.
			let link = document.createElement('a');
			link.innerHTML = 'Télécharger l\'image';
			link.className = "btn btn-dark";
			link.href = "#";
			link.role = "button";
			link.addEventListener('click', function () {
				link.href = bookMark.el_canvas.toDataURL();
				link.download = "bookmark.jpg";
			}, false);
			let zone = document.getElementById("zone-" + i);
			zone.appendChild(link);
			zone.appendChild(document.createElement('br'));
			zone.appendChild(document.createElement('br'));

			bookMark.el_canvas = bookMark.createCanvas('canva-' + i, 'zone-' + i, bookMark.params);
			bookMark.el_ctx = bookMark.el_canvas.getContext('2d');
			bookMark.initPatterns(bookMark.el_ctx, i);

			let folder = gui.addFolder('Example ' + i);

			/**
			 * Draw the canvas with the desired number of triangle pairs.
			 * @param el
			 */
			function redrawNumberOfTriangles(el) {
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.numberOfPairOfTriangles = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Number of columns.
			 * @param el
			 */
			function redrawColumnsPerWidth(el) {
				bookMark.params.columnsPerWidth = el;
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change the height of the canvas.
			 * @param el
			 */
			function redrawHeight(el) {
				bookMark.el_canvas.height = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change the width of the canvas.
			 * @param el
			 */
			function redrawWidth(el) {
				bookMark.el_canvas.width = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change the pattern of the even triangle.
			 * @param el
			 */
			function redrawTriangleEvenPattern(el) {
				bookMark.el_canvas.colorTriangleEven = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Change the pattern of the odd triangle.
			 * @param el
			 */
			function redrawTriangleOddPattern(el) {
				bookMark.el_canvas.colorTriangleOdd = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Draw the cut lines.
			 * @param el
			 */
			function redrawStrokes(el) {
				bookMark.el_canvas.showStrokes = el;
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Force the canvas high so that the triangles are all equilateral.
			 * @param el
			 */
			function redrawEquilateral(el) {
				bookMark.clearCanvasLayers(bookMark.el_ctx);
				bookMark.el_canvas.height = 600;
				bookMark.equilateral = el;
				bookMark.setBackgroundPattern(bookMark.el_canvas, bookMark.el_ctx, bookMark.params.color);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			/**
			 * Draw the background pattern.
			 * @param el
			 */
			function redrawBackgroundPattern(el) {
				bookMark.el_ctx.fillStyle = bookMark.images[el];
				bookMark.el_ctx.fillRect(0, 0, bookMark.el_canvas.width, bookMark.el_canvas.height);
				bookMark.drawTriangles(bookMark.el_canvas, bookMark.el_ctx, bookMark.params);
			}

			folder.add(bookMark.params, 'numberOfPairOfTriangles', 1, 15, 1).onFinishChange(redrawNumberOfTriangles);
			folder.add(bookMark.params, 'columnsPerWidth', 1, 15, 1).onFinishChange(redrawColumnsPerWidth);
			folder.add(bookMark.params, 'height', 100, 1000, 5).onFinishChange(redrawHeight);
			folder.add(bookMark.params, 'width', 100, 300, 5).onFinishChange(redrawWidth);
			folder.add(bookMark.params, 'color', bookMark.patterns).onFinishChange(redrawBackgroundPattern);
			folder.add(bookMark.params, 'triangleEvenPattern', bookMark.patterns).onFinishChange(redrawTriangleEvenPattern);
			folder.add(bookMark.params, 'triangleOddPattern', bookMark.patterns).onFinishChange(redrawTriangleOddPattern);
			folder.add(bookMark.params, 'equilateral', true, false).onFinishChange(redrawEquilateral);
			folder.add(bookMark.params, 'showStrokes').onFinishChange(redrawStrokes);

			// Enables you to save the settings in the localstorage.
			gui.remember(bookMark.params);
		}
	};

	init();
};

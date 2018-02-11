import _ from 'lodash';
import 'bootstrap';
import '../scss/_custom.scss';
import dat from '../node_modules/dat.gui/build/dat.gui.js'

/**
 * Dessine un canvas.
 * @param elementId
 * @param zoneId
 * @param params
 * @returns {Element}
 */
function createCanvas(elementId, zoneId, params) {

	let canvas = document.createElement('canvas');

	canvas.id = elementId;
	canvas.width = 100;
	canvas.height = 100;
	canvas.style.backgroundColor = '#333333';

	let zone = document.getElementById(zoneId);
	zone.appendChild(canvas);

	clearCanvas(canvas.getContext('2d'));

	return canvas;
}

/**
 * Efface un canvas.
 * @param ctx
 */
function clearCanvas(ctx) {
	/* because the GUI will re-draw the canvas, we need to be able to clear
	   it before drawing things another time. This function clears the
	   canvas to white by finding out how big it is and drawing a white
	   rectangle. */
	let canvas = ctx.canvas;
	let w = canvas.clientWidth;
	let h = canvas.clientHeight;
	ctx.clearRect(0, 0, w, h);
}

/**
 *
 * @param el_canvas
 * @param elctx
 * @param numberOfTriangles
 */
function drawTriangles(el_canvas, elctx, numberOfTriangles) {

	let equi = false;

	for (let j = 1; j <= numberOfTriangles; j++) {

		if (el_canvas) {

			let _w = el_canvas.width;
			let _h = el_canvas.height;
			let _a = _w / 2;
			let _b;

			// Cas spécifique, on veut un triangle equilatéral, on le calcul en fonction de la largeur du canvas.
			if (equi === true) {
				_b = Math.sqrt((Math.pow(_w, 2) + Math.pow((_a / 2), 2)));

				if (j === 1) {
					el_canvas.height = _b * numberOfTriangles * 2;
				}
			} else {
				_b = _h / (numberOfTriangles * 2);
			}

			if (elctx) {

				elctx.lineWidth = 1;

				let coef = 2 * (_b * j - _b);
				let coef2 = coef + 2 * _b;
				let coef3 = (coef2 - _b) / j * j;

				// Dessine une paire de triangle.
				for (let k = 1; k <= 2; k++) {
					elctx.beginPath();

					elctx.moveTo(_a, coef3);

					let red = _.random(0, 255);
					let green = _.random(0, 255);
					let blue = _.random(0, 255);

					if (k % 2 === 1) {
						elctx.lineTo(_w, coef);
						elctx.lineTo(0, coef);
					} else {
						elctx.lineTo(_w, coef2);
						elctx.lineTo(0, coef2);
					}

					elctx.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
					elctx.fill();
					elctx.stroke();
					elctx.closePath();
				}
			}
		}
	}

}

let Params = function () {
	this.canvas1height = 100;
	this.canvas1width = 100;
	this.canvas1color = '#000';
	this.canvas1numberOfTriangles = 3;

	this.canvas2height = 100;
	this.canvas2width = 100;
	this.canvas2color = '#000';
	this.canvas2numberOfTriangles = 3;

	this.canvas3height = 100;
	this.canvas3width = 100;
	this.canvas3color = '#000';
	this.canvas3numberOfTriangles = 3;
};

window.onload = function () {

	let params = new Params();
	let gui = new dat.GUI();

	let numberOflayer = 3;

	for (let i = 1; i <= numberOflayer; i++) {

		let el_canvas = createCanvas('canva-' + i, 'zone-' + i, params);
		let elctx = el_canvas.getContext('2d');

		let folder = gui.addFolder('Example ' + i);
		let numberOfTriangles = 3;

		let redrawNumberOfTriangles = function (el) {
			clearCanvas(elctx);
			numberOfTriangles = el;
			drawTriangles(el_canvas, elctx, el);
		};

		let redrawHeight = function (el) {
			clearCanvas(elctx);
			el_canvas.height = el;
			drawTriangles(el_canvas, elctx, numberOfTriangles);
		};

		let redrawWidth = function (el) {
			clearCanvas(elctx);
			el_canvas.width = el;
			drawTriangles(el_canvas, elctx, numberOfTriangles);
		};

		let redrawColor = function (el) {
			clearCanvas(elctx);
			el_canvas.style.backgroundColor = el;
			drawTriangles(el_canvas, elctx, numberOfTriangles);
		};

		folder.add(params, 'canvas' + i + 'numberOfTriangles', 3, 15, 1).onFinishChange(redrawNumberOfTriangles);
		folder.add(params, 'canvas' + i + 'height', 100, 1000, 100).onFinishChange(redrawHeight);
		folder.add(params, 'canvas' + i + 'width', 100, 300, 100).onFinishChange(redrawWidth);
		folder.addColor(params, 'canvas' + i + 'color').onFinishChange(redrawColor);

		drawTriangles(el_canvas, elctx, numberOfTriangles);

	}
};
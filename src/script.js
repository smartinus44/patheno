import _ from 'lodash';
import 'bootstrap';
import '../scss/_custom.scss';
import dat from '../node_modules/dat.gui/build/dat.gui.js'


let BookMark = {};

let Params = function () {
	this.canvas1height = 600;
	this.canvas1width = 300;
	this.canvas1color = '#000';
	this.canvas1numberOfTriangles = 3;

	this.canvas2height = 600;
	this.canvas2width = 300;
	this.canvas2color = '#000';
	this.canvas2numberOfTriangles = 3;

	this.canvas3height = 600;
	this.canvas3width = 300;
	this.canvas3color = '#000';
	this.canvas3numberOfTriangles = 3;
};

BookMark.init = function () {

	let params = new Params();
	let gui = new dat.GUI();

	let numberOflayer = 3;

	for (let i = 1; i <= numberOflayer; i++) {

		let el_canvas = this.createCanvas('canva-' + i, 'zone-' + i, params);
		let elctx = el_canvas.getContext('2d');

		let folder = gui.addFolder('Example ' + i);
		let numberOfTriangles = 3;

		let redrawNumberOfTriangles = function (el) {
			BookMark.clearCanvas(elctx);
			numberOfTriangles = el;
			BookMark.drawTriangles(el_canvas, elctx, el);
		};

		let redrawHeight = function (el) {
			BookMark.clearCanvas(elctx);
			el_canvas.height = el;
			BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles);
		};

		let redrawWidth = function (el) {
			BookMark.clearCanvas(elctx);
			el_canvas.width = el;
			BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles);
		};

		let redrawColor = function (el) {
			BookMark.clearCanvas(elctx);
			el_canvas.style.backgroundColor = el;
			BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles);
		};

		folder.add(params, 'canvas' + i + 'numberOfTriangles', 3, 15, 1).onFinishChange(redrawNumberOfTriangles);
		folder.add(params, 'canvas' + i + 'height', 100, 1000, 100).onFinishChange(redrawHeight);
		folder.add(params, 'canvas' + i + 'width', 100, 300, 100).onFinishChange(redrawWidth);
		folder.addColor(params, 'canvas' + i + 'color').onFinishChange(redrawColor);

		BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles);

	}
};

/**
 * Dessine un canvas.
 * @param elementId
 * @param zoneId
 * @param params
 * @returns {Element}
 */
BookMark.createCanvas = function (elementId, zoneId, params) {

	let canvas = document.createElement('canvas');

	canvas.id = elementId;
	canvas.width = params.canvas1width;
	canvas.height = params.canvas1height;
	canvas.style.backgroundColor = params.canvas1color;

	let zone = document.getElementById(zoneId);
	zone.appendChild(canvas);

	this.clearCanvas(canvas.getContext('2d'));

	return canvas;
};

/**
 * Efface un canvas.
 * @param ctx
 */
BookMark.clearCanvas = function (ctx) {

	let canvas = ctx.canvas;
	let w = canvas.clientWidth;
	let h = canvas.clientHeight;
	ctx.clearRect(0, 0, w, h);
};

/**
 * Dessine les couples de triangles.
 * @param el_canvas
 * @param elctx
 * @param numberOfTriangles
 */
BookMark.drawTriangles = function (el_canvas, elctx, numberOfTriangles) {

	let equi = false;

	for (let j = 1; j <= numberOfTriangles; j++) {

		if (el_canvas) {

			let _width = el_canvas.width;
			let _height = el_canvas.height;
			let _half_width = _width / 2;
			let _triangle_height;

			// Cas spécifique, on veut un triangle equilatéral, on le calcul en fonction de la largeur du canvas.
			if (equi === true) {
				_triangle_height = Math.sqrt((Math.pow(_width, 2) + Math.pow((_half_width / 2), 2)));

				if (j === 1) {
					el_canvas.height = _triangle_height * numberOfTriangles * 2;
				}
			} else {
				_triangle_height = _height / (numberOfTriangles * 2);
			}

			if (elctx) {

				elctx.lineWidth = 1;

				let first_coef = 2 * (_triangle_height * j - _triangle_height);
				let second_coef = first_coef + 2 * _triangle_height;
				let third_coef = (second_coef - _triangle_height) / j * j;

				// Dessine une paire de triangle.
				for (let k = 1; k <= 2; k++) {
					elctx.beginPath();

					elctx.moveTo(_half_width, third_coef);

					let red = _.random(0, 255);
					let green = _.random(0, 255);
					let blue = _.random(0, 255);

					if (k % 2 === 1) {
						elctx.lineTo(_width, first_coef);
						elctx.lineTo(0, first_coef);
					} else {
						elctx.lineTo(_width, second_coef);
						elctx.lineTo(0, second_coef);
					}

					elctx.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
					elctx.fill();
					elctx.stroke();
					elctx.closePath();
				}
			}
		}
	}
};

window.onload = function () {
	BookMark.init();
};
import _ from 'lodash';
import 'bootstrap';
import '../scss/_custom.scss';
import dat from '../node_modules/dat.gui/build/dat.gui.js'


let BookMark = {};

let Params = function () {
	this.canvas1height = 600;
	this.canvas1width = 300;
	this.canvas1color = 'ErableUS';
	this.canvas1numberOfTriangles = 3;
	this.canvas1triangle1color = "Poirier";
	this.canvas1triangle2color = "Sycomore";
	this.canvas1equilateral = false;

	this.canvas2height = 600;
	this.canvas2width = 300;
	this.canvas2color = 'ErableUS';
	this.canvas2numberOfTriangles = 3;
	this.canvas2triangle1color = "Poirier";
	this.canvas2triangle2color = "Sycomore";
	this.canvas2equilateral = false;

	this.canvas3height = 600;
	this.canvas3width = 300;
	this.canvas3color = 'ErableUS';
	this.canvas3numberOfTriangles = 3;
	this.canvas3triangle1color = "Poirier";
	this.canvas3triangle2color = "Sycomore";
	this.canvas3equilateral = false;
};

BookMark.init = function () {

	let params = new Params();
	let gui = new dat.GUI();

	let number_of_layer = 3;

	for (let i = 1; i <= number_of_layer; i++) {

		let el_canvas = this.createCanvas('canva-' + i, 'zone-' + i, params);
		let elctx = el_canvas.getContext('2d');

		let folder = gui.addFolder('Example ' + i);
		let numberOfTriangles = 3;
		let equi = false;

		let redrawNumberOfTriangles = function (el) {
			BookMark.clearCanvas(elctx);
			numberOfTriangles = el;
			BookMark.drawTriangles(el_canvas, elctx, el, equi);
		};

		let redrawHeight = function (el) {
			BookMark.clearCanvas(elctx);
			el_canvas.height = el;
			BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles, equi);
		};

		let redrawWidth = function (el) {
			BookMark.clearCanvas(elctx);
			el_canvas.width = el;
			BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles, equi);
		};

		let redrawColor = function (el) {
			BookMark.clearCanvas(elctx);
			el_canvas.style.backgroundImage = 'url(' + el + '.png)';
			BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles, equi);
		};
		let redrawTriangle1Color = function (el) {
			BookMark.clearCanvas(elctx);
			el_canvas.colorTriangle1 = el;
			BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles, equi);
		};
		let redrawTriangle2Color = function (el) {
			BookMark.clearCanvas(elctx);
			el_canvas.colorTriangle2 = el;
			BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles, equi);
		};

		let redrawEquilateral = function (el) {
			el_canvas.height = 600;
			BookMark.clearCanvas(elctx);
			BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles, el);
		};

		// Clou rouillé
		// Parasol
		// Terre de Sienne
		// Verge d'or sombre
		// Brun cuir
//		let colors = ["#8b5a2b", "#ffa54f", "#a0522d", "#cd8500", "#8b4513"];

		// Travail avec des textures.
		let colors = ["ErableUS", "Poirier", "Sycomore"];
		folder.add(params, 'canvas' + i + 'numberOfTriangles', 3, 15, 1).onFinishChange(redrawNumberOfTriangles);
		folder.add(params, 'canvas' + i + 'height', 100, 1000, 100).onFinishChange(redrawHeight);
		folder.add(params, 'canvas' + i + 'width', 100, 300, 100).onFinishChange(redrawWidth);
		folder.add(params, 'canvas' + i + 'color', colors).onFinishChange(redrawColor);
		folder.add(params, 'canvas' + i + 'triangle1color', colors).onFinishChange(redrawTriangle1Color);
		folder.add(params, 'canvas' + i + 'triangle2color', colors).onFinishChange(redrawTriangle2Color);
		folder.add(params, 'canvas' + i + 'equilateral', true, false).onFinishChange(redrawEquilateral);

		BookMark.drawTriangles(el_canvas, elctx, numberOfTriangles, equi);

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
	canvas.style.backgroundImage = 'url(images/' + params.canvas1color + '.jpg)';
	canvas.colorTriangle1 = params.canvas1triangle1color;
	canvas.colorTriangle2 = params.canvas1triangle2color;

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
 * @param equi
 */
BookMark.drawTriangles = function (el_canvas, elctx, numberOfTriangles, equi) {
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
				let second_coef = first_coef + (2 * _triangle_height);
				let third_coef = ((second_coef - _triangle_height) / j) * j;

				// Dessine une paire de triangle.
				for (let k = 1; k <= 2; k++) {
					elctx.beginPath();

					elctx.moveTo(_half_width, third_coef);

					let image;
					if (k % 2 === 1) {
						elctx.lineTo(_width, first_coef);
						elctx.lineTo(0, first_coef);
						image = el_canvas.colorTriangle1;
					} else {
						elctx.lineTo(_width, second_coef);
						elctx.lineTo(0, second_coef);
						image = el_canvas.colorTriangle2;
					}
					let material = new Image();
					material.src = 'images/' + image + '.jpg';
					material.onload = function () {
						elctx.fillStyle = elctx.createPattern(this, "repeat");
					};

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
import _ from 'lodash';
import 'bootstrap';
import '../scss/_custom.scss';

/**
 * Dessine un canvas.
 * @param {string} elementId 
 * @returns 
 */
function drawCanvas(elementId) {
    return document.getElementById(elementId);
}

/**
 * Dessine un triangle.
 * @param {any} elcanvas 
 * @param {any} ctx 
 * @param {integer} i 
 * @param {integer} max 
 * @param {boolean} equi 
 */
function drawTriangle(elcanvas, ctx, i, max, equi) {

    var _w = elcanvas.width;
    var _h = elcanvas.height;

    var _a = _w / 2;
    var _b;
    // Cas spécifique, on veut un triangle equilatéral, on le calcul en fonction de la largeur du canvas.
    if (equi === true) {
        _b = Math.sqrt((Math.pow(_w, 2) + Math.pow((_a / 2), 2)));

        if (i == 1) {
            elcanvas.height = _b * max * 2;
        }
    } else {
        _b = _h / (max * 2);
    }

    if (canvas.getContext) {

        ctx.lineWidth = 1;

        var coef = 2 * (_b * i - _b);
        //    var coef2 = 2 * _b * i;
        var coef2 = coef + 2 * _b;
        //    var coef3 = _b * (i + (i - 1) / i * i);
        //    var coef3 = _b * ((2 * i - 1) / i * i);
        var coef3 = (coef2 - _b) / i * i;

        for (var j = 1; j <= 2; j++) {
            ctx.beginPath();

            ctx.moveTo(_a, coef3);

            var red = _.random(0, 255);
            var green = _.random(0, 255);
            var blue = _.random(0, 255);

            if (j % 2 == 1) {
                ctx.lineTo(_w, coef);
                ctx.lineTo(0, coef);
            } else {
                ctx.lineTo(_w, coef2);
                ctx.lineTo(0, coef2);
            }

            ctx.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }
}

// Nombre de pair de triangle dans chaque canvas.
var numberOfTriangle = 3;

// Nombre de canvas.
var numberOflayer = 3;

for (var i = 1; i <= numberOflayer; i++) {
    var canvas = drawCanvas('canva-' + i);
    var ctx = canvas.getContext("2d");
    for (var j = 1; j <= numberOfTriangle; j++) {
        drawTriangle(canvas, ctx, j, numberOfTriangle, false);
    }
}
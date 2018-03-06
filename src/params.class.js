'use strict';

// Settings
export default class Params {
	constructor(_height, _width, _background, _numberOfpairs, _evenPattern, _oddPattern, _equilateral, _showStrokes, _columns_per_width, _can_download) {
		this.height = _height;
		this.width = _width;
		this.color = _background;
		this.numberOfPairOfTriangles = _numberOfpairs;
		this.triangleEvenPattern = _evenPattern;
		this.triangleOddPattern = _oddPattern;
		this.equilateral = _equilateral;
		this.showStrokes = _showStrokes;
		this.columnsPerWidth = _columns_per_width;
		this.canDownload = _can_download;
	}
}

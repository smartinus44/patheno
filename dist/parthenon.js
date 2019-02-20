(function(t){var e={};function n(a){if(e[a]){return e[a].exports}var r=e[a]={i:a,l:false,exports:{}};t[a].call(r.exports,r,r.exports,n);r.l=true;return r.exports}n.m=t;n.c=e;n.d=function(t,e,a){if(!n.o(t,e)){Object.defineProperty(t,e,{configurable:false,enumerable:true,get:a})}};n.r=function(t){Object.defineProperty(t,"__esModule",{value:true})};n.n=function(t){var e=t&&t.__esModule?function e(){return t["default"]}:function e(){return t};n.d(e,"a",e);return e};n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};n.p="";return n(n.s=0)})([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.default=void 0;function a(t,e){if(!(t instanceof e)){throw new TypeError("Cannot call a class as a function")}}function r(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||false;a.configurable=true;if("value"in a)a.writable=true;Object.defineProperty(t,a.key,a)}}function i(t,e,n){if(e)r(t.prototype,e);if(n)r(t,n);return t}var s="#FF0000";var l=1;var o=function(){function t(e,n,r,i,s,l,o,c,h,u,f){a(this,t);this.images=[];this.numberOfPairOfTriangles=3;this.patterns=f;this.height=n;this.width=r;if(!i)this.backgroundPattern=this.getRandomPattern("background");else this.backgroundPattern=i;if(!l)this.triangleEvenPattern=this.getRandomPattern("triangles");else this.triangleEvenPattern=l;if(!o)this.triangleOddPattern=this.getRandomPattern("triangles");else this.triangleOddPattern=o;this.numberOfPairOfTriangles=s;this.showStrokes=c;this.columnsPerWidth=h;this.canDownload=u;this.el_canvas=this.createCanvas("canva-"+e,"zone-"+e);if(this.canDownload===true)this.createDownloadLink(e);this.el_ctx=this.el_canvas.getContext("2d");this.initPatterns("triangles");this.initPatterns("background")}i(t,[{key:"getRandomPattern",value:function t(e){var n=Math.floor(Math.random()*this.patterns[e].length);return this.patterns[e][n]}},{key:"setBackgroundPattern",value:function t(e){this.el_ctx.fillStyle=this.images[e];this.el_ctx.fillRect(0,0,this.el_canvas.width,this.el_canvas.height)}},{key:"createCanvas",value:function t(e,n){var a=document.createElement("canvas");a.innerHTML="Votre navigateur ne supporte pas canvas.<br>Essayez avec Firefox, Safari, Chrome ou Opera.";var r=document.getElementById(n);a.id=e;a.width=this.width;a.height=this.height;a.showStrokes=this.showStrokes;a.backgroundPatternTriangleEven=this.triangleEvenPattern;a.backgroundPatternTriangleOdd=this.triangleOddPattern;r.appendChild(a);this.clearCanvasLayers();return a}},{key:"clearCanvasLayers",value:function t(){if(this.el_canvas){var e=this.el_canvas.clientWidth;var n=this.el_canvas.clientHeight;this.el_ctx.clearRect(0,0,e,n)}}},{key:"initPatterns",value:function t(e){var n=this.patterns[e].length;var a=this;this.patterns[e].forEach(function(t){var e=encodeURI(t);var r=new Image;r.onload=function(){a.images[e]=a.el_ctx.createPattern(r,"repeat");--n;if(n===0)a._onPatternsLoaded()};r.src=e})}},{key:"createDownloadLink",value:function t(e){var n=document.getElementById("zone-"+e);var a=document.createElement("a");var r=this;a.innerHTML="Télécharger l'image";a.className="btn btn-dark";a.href="#";a.role="button";a.addEventListener("click",function(){a.href=r.el_canvas.toDataURL();a.download="bookmark.jpg"},false);n.insertBefore(document.createElement("br"),n.firstChild);n.insertBefore(document.createElement("br"),n.firstChild);var i=document.createElement("textarea");i.cols=80;i.rows=10;i.readOnly=true;i.innerHTML=JSON.stringify(r);n.insertBefore(a,n.firstChild)}},{key:"drawTriangles",value:function t(){var e;var n=this.el_canvas.width/this.columnsPerWidth;var a=n/2;for(var r=1;r<=this.numberOfPairOfTriangles;r++){for(var i=0;i<this.columnsPerWidth;i++){e=this.el_canvas.height/(this.numberOfPairOfTriangles*2);this.el_ctx.lineWidth=l;var o=i*n;var c=2*(e*r-e);var h=c+2*e;var u=(h-e)/r*r;for(var f=1;f<=2;f++){this.el_ctx.beginPath();this.el_ctx.moveTo(a+o,u);if(f%2===1){this.el_ctx.fillStyle=this.images[this.el_canvas.backgroundPatternTriangleEven];this.el_ctx.lineTo(n+o,c);this.el_ctx.lineTo(o,c)}else{this.el_ctx.fillStyle=this.images[this.el_canvas.backgroundPatternTriangleOdd];this.el_ctx.lineTo(n+o,h);this.el_ctx.lineTo(o,h)}this.el_ctx.closePath();if(this.el_canvas.showStrokes===true){this.el_ctx.strokeStyle=s;this.el_ctx.stroke()}this.el_ctx.fill()}}}}},{key:"_onPatternsLoaded",value:function t(){this.clearCanvasLayers();this.setBackgroundPattern(this.backgroundPattern);this.drawTriangles()}}]);return t}();e.default=o}]);
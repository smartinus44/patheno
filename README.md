# Geometric bookmark patterns

## Params

| Param title | Possible value |
| --- | --- | 
| `height` | from 100 to 1000 |
| `width` | from 100 to 300 |
| `background` | _see List of pattern species_ |
| `numberOfpairs` | from 1 to 15 |
| `evenPattern` | _see List of pattern species_ |
| `oddPattern` | _see List of pattern species_ |
| `equilateral` | true/false |
| `showStrokes` | true/false |
| `columns_per_width` | from 1 to 15 |
| `can_download` | true/false |


## List of pattern species

| Value | Show |
| --- | --- |
| ErableUS | ![alt text](https://gitlab.com/smartinus44/geometricanvas/blob/master/dist/images/ErableUS.jpg) |
| Poirier | ![alt text](https://gitlab.com/smartinus44/geometricanvas/blob/master/dist/images/Poirier.jpg) |
| Sycomore | ![alt text](https://gitlab.com/smartinus44/geometricanvas/blob/master/dist/images/Sycomore.jpg) |
| EtreBlanc | ![alt text](https://gitlab.com/smartinus44/geometricanvas/blob/master/dist/images/EtreBlanc.jpg) |
| Citronnier | ![alt text](https://gitlab.com/smartinus44/geometricanvas/blob/master/dist/images/Citronnier.jpg) |
| cheneLargeVanille | ![alt text](https://gitlab.com/smartinus44/geometricanvas/blob/master/dist/images/cheneLargeVanille.jpg) |
| Cypres | ![alt text](https://gitlab.com/smartinus44/geometricanvas/blob/master/dist/images/Cypres.jpg) |
| FreneJapon | ![alt text](https://gitlab.com/smartinus44/geometricanvas/blob/master/dist/images/FreneJapon.jpg) |

## Example of utilisation

_In a html file:_

```html
<div id="zone-demo"></div>
```

_In a javascript file:_

```javascript
    window.onload = function () {
        // Let's construct a non editable canvas without link.
        let canvasOfDemo = new BookMark('demo',  new Params(
            300,
            300,
            "FreneJapon",
            3,
            "Citronnier",
            "Cypres",
            false,
            false,
            1,
            true
        ));
    };
```

# Geometric bookmark patterns

Setup your own bookmarks! Build inlay frieze with different wood species. 

You are free to adjust:

- The number of pairs of triangles.
- The number of columns of triangles.
- The dimensions of the bookmark.
- The wood specie used for the background.
- Even and odd background wood species for triangles.
- Mind the cutting lines with show strokes option.
- Set if downloadable or not.

## Params

| Param title | Possible value |
| --- | --- | 
| `uniqueId` | an unique HTML id |
| `height` | from 100 to 1000 |
| `width` | from 100 to 300 |
| `background` | _see List of pattern species_ |
| `numberOfpairs` | from 1 to 15 |
| `evenPattern` | _see List of pattern species_ |
| `oddPattern` | _see List of pattern species_ |
| `showStrokes` | true/false |
| `columns_per_width` | from 1 to 15 |
| `can_download` | true/false |
| `patterns` | a javascript array of "string" values |


## List of pattern species

| Dataset | Value | Show |
| --- | --- | --- |
| 1 | Aniegré | ![alt text](dist/images/dataset/1/aniegré.jpg) |
| 1 | Bubimga | ![alt text](dist/images/dataset/1/bubimga.jpg) |
| 1 | Chene | ![alt text](dist/images/dataset/1/chene.jpg) |
| 1 | Etre | ![alt text](dist/images/dataset/1/etre.jpg) |
| 1 | Eucalyptus | ![alt text](dist/images/dataset/1/eucalyptus.jpg) |
| 1 | Merisier | ![alt text](dist/images/dataset/1/merisier.jpg) |
| 1 | Noyer | ![alt text](dist/images/dataset/1/noyer.jpg) |
| 1 | Sycomore | ![alt text](dist/images/dataset/1/sycomore.jpg) |
| 1 | Teck | ![alt text](dist/images/dataset/1/teck.jpg) |
| 2 | Chene large vanille | ![alt text](dist/images/dataset/2/cheneLargeVanille.jpg) |
| 2 | Citronnier | ![alt text](dist/images/dataset/2/Citronnier.jpg) |
| 2 | Cypres | ![alt text](dist/images/dataset/2/Cypres.jpg) |
| 2 | Erable US | ![alt text](dist/images/dataset/2/ErableUS.jpg) |
| 2 | Etre Blanc | ![alt text](dist/images/dataset/2/EtreBlanc.jpg) |
| 2 | Frêne du Japon | ![alt text](dist/images/dataset/2/FreneJapon.jpg) |
| 2 | Merisier de France | ![alt text](dist/images/dataset/2/MerisierDeFrance.jpg) |
| 2 | Poirier | ![alt text](dist/images/dataset/2/Poirier.jpg) |
| 2 | Sycomore | ![alt text](dist/images/dataset/2/Sycomore.jpg) |
| 3 | Erable | ![alt text](dist/images/dataset/3/Erable.jpg) |
| 3 | Poirier | ![alt text](dist/images/dataset/3/Poirier.jpg) |
| 3 | Sycomore | ![alt text](dist/images/dataset/3/Sycomore.jpg) |
| 3 | Etre Blanc | ![alt text](dist/images/dataset/3/Etre.jpg) |
| 3 | Citronnier | ![alt text](dist/images/dataset/3/Citronnier.jpg) |
| 3 | Chene | ![alt text](dist/images/dataset/3/Chene.jpg) |
| 3 | Cypres | ![alt text](dist/images/dataset/3/Cypres.jpg) |
| 3 | Frene | ![alt text](dist/images/dataset/3/Frene.jpg) |
| 3 | Merisier | ![alt text](dist/images/dataset/3/Merisier.jpg) |

## Example of utilisation

_In a div in a html file:_

```html
<div id="zone-demo"></div>
```

_In a javascript file:_

```javascript
    window.onload = function () {
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
            ["Erable", "Poirier", "Sycomore", "Etre", "Citronnier", "Chene", "Cypres", "Frene", "Merisier"]
        );
    };
```

_It gives the following result:_

![alt text](src/common/images/demo.jpg)
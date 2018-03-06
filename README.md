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

| Value |
| --- |
| ErableUS |
| Poirier |
| Sycomore |
| EtreBlanc | 
| Citronnier | 
| cheneLargeVanille | 
| Cypres |
| FreneJapon |

## Example of utilisation

_In a html file:_

```html
<div id="zone-demo"></div>
```

_In a javascript file:_

```javascript
    window.onload = function () {
        // Let's construct a non editable canvas without link.
        let canvasOfDemo = new BookMark('demo'|  new Params(
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

# rgb-scale

> RGB color scale.

[![NPM](https://nodei.co/npm/rgb-scale.png)](https://nodei.co/npm/rgb-scale)

# Install

```bash
npm install rgb-scale
```

```bash
bower install rgb-scale
```

# Usage

```javascript
var RGBScale = require('rgb-scale');

var colors = [[0,0,0,1], [255,0,0,1], [255,255,0,0], [255,255,255,1]];
var positions = [0, 0.25, 0.75, 1];
var domain = [0, 100];

var scale = RGBScale(colors, positions, domain);

console.log(scale(-1)); // [0,0,0,1]
console.log(scale(0)); // [0,0,0,1]
console.log(scale(25)); // [255,0,0,1]
console.log(scale(35)); // [255,50.999999999999986,0,0.8]
console.log(scale(75)); // [255,255,0,0]
console.log(scale(99)); // [255, 255, 244.79999999999998, 0.96]
console.log(scale(100)); // [255,255,255,1]
console.log(scale(101)); // [255,255,255,1]
```

# Test

```bash
npm test
```

# License

MIT

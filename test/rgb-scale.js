var test = require('tape');
var RGBScale = require('../rgb-scale');

test('RGBScale', function (t) {
  'use strict';

  t.plan(25);

  (function() {
    // invalid inputs
    var scale = RGBScale(343);
    t.deepEqual(scale(344), [0,0,0,1]);

    scale = RGBScale(554,'asd');
    t.deepEqual(scale('adf'), [0,0,0,1]);

    scale = RGBScale(554,'asd',435);
    t.deepEqual(scale(5653), [0,0,0,1]);
  })();

  (function() {
    var colors = [[0,0,0], [255,255,255]];
    var scale = RGBScale(colors);

    t.deepEqual(scale(-1), [0,0,0,1]);
    t.deepEqual(scale(0), [0,0,0,1]);
    t.deepEqual(scale(0.5), [127.5,127.5,127.5,1]);
    t.deepEqual(scale(1), [255,255,255,1]);
    t.deepEqual(scale(2), [255,255,255,1]);
  })();

  (function() {
    var colors = [[0,0,0], [255,255,255]];
    var positions = [0, 0.75];
    var scale = RGBScale(colors, positions);

    t.deepEqual(scale(-1), [0,0,0,1]);
    t.deepEqual(scale(0), [0,0,0,1]);
    t.deepEqual(scale(0.5), [170, 170, 170, 1]);
    t.deepEqual(scale(1), [255,255,255,1]);
    t.deepEqual(scale(2), [255,255,255,1]);
  })();

  (function() {
    var colors = [[0,0,0,1], [255,0,0,1], [255,255,0,0], [255,255,255,1]];
    var positions = [0, 0.25, 0.75, 1];
    var domain = [0, 100];

    var scale = RGBScale(colors, positions, domain);

    t.deepEqual(scale(-100), [0,0,0,1]);
    t.deepEqual(scale(-1), [0,0,0,1]);
    t.deepEqual(scale(0), [0,0,0,1]);
    t.deepEqual(scale(25), [255,0,0,1]);
    t.deepEqual(scale(35), [255,50.999999999999986,0,0.8]);
    t.deepEqual(scale(38), [255,66.3,0,0.74]);
    t.deepEqual(scale(50), [255,127.5,0,0.5]);
    t.deepEqual(scale(75), [255,255,0,0]);
    t.deepEqual(scale(99), [255, 255, 244.79999999999998, 0.96]);
    t.deepEqual(scale(100), [255,255,255,1]);
    t.deepEqual(scale(101), [255,255,255,1]);
    t.deepEqual(scale(200), [255,255,255,1]);
  })();
});

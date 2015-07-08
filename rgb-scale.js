(function(root) {
  'use strict';

  /**
   * RGBScale
   * @desc RGB color scale.
   * @param {number[]} colors - rgb colors in array
   * @param {number[]} positions - color position offsets
   * @param {number[]} domain - scale domain
   * @return {function} scale function
   */
  function RGBScale(colors, positions, domain) {
    if (!(this instanceof RGBScale)) {
      return new RGBScale(colors, positions, domain);
    }

    this._colors = [];
    this._positions = [];
    this._domain = [0,1];
    this._min = 0;
    this._max = 1;
    this._numClasses = 0;
    this._colorCache = {};

    this.colors(colors);
    this.positions(positions);
    this.domain(domain);

    return function(value) {
      return this._getColor(value);
    }.bind(this);
  }

  /**
   * colors
   * @desc Set color values
   * @param {number[]} colors - RGB color values
   */
  RGBScale.prototype.colors = function(colors) {
    if (Array.isArray(colors)) {
      this._resetCache();
      this._colors = colors.slice(0);

      for (var i = 0; i < this._colors.length; i++) {
        if (this._colors[i].length === 3) {
          this._colors[i][3] = 1;
        }
      }
    }

    return this;
  };

  /**
   * positions
   * @desc Set position values
   * @param {number[]} positions - position values
   */
  RGBScale.prototype.positions = function(positions) {
    if (Array.isArray(positions)) {
      this._positions = positions.slice(0);
    } else {
      positions = [];

      var colorsLength = this._colors.length;
      var c = 0;
      var w = 0;
      var ref = colorsLength - 1;

      for (; 0 <= ref ? w <= ref : w >= ref; c = (0 <= ref ? ++w : --w)) {
        this._positions.push(c / (colorsLength - 1));
      }
    }

    return this;
  };

  /**
   * domain
   * @desc Set domain and min/max values
   * @param {number[]} domain - domain values
   */
  RGBScale.prototype.domain = function(domain) {
    if (Array.isArray(domain)) {
      this._domain = domain.slice(0);
      this._min = domain[0];
      this._max = domain[domain.length - 1];

      this._resetCache();
    }

    if (this._domain.length === 2) {
      this._numClasses = 0;
    } else {
      this._numClasses = domain.length - 1;
    }

    return this;
  };

  /**
   * resetCache
   * @desc Reset color cache
   */
  RGBScale.prototype._resetCache = function() {
    this._colorCache = {};
  };

  /**
   * getClass
   * @desc Return class for domain value
   * @param {number} value - domain value
   * @return {number} class value
   */
  RGBScale.prototype._getClass = function(value) {
    if (this._domain.length) {
      var n = this._domain.length;
      var i = 0;

      while (i < n && value >= this._domain[i]) {
        i++;
      }

      return i - 1;
    }

    return 0;
  };

  /**
   * getColor
   * @desc Return color for domain value
   * @param {number} value - domain value
   * @return {number[]} RGB color
   */
  RGBScale.prototype._getColor = function(value) {
    var t;
    var color;

    if (typeof value !== 'number') {
      value = 0;
    }

    if (this._domain.length > 2) {
      var c = this._getClass(value);
      t = c / (this._numClasses - 1);
    } else {
      t = (this.min !== this._max ? (value - this._min) / (this._max - this._min) : 0);
      t = Math.min(1, Math.max(0, t));
    }

    var k = Math.floor(t * 10000);

    if (this._colorCache[k]) {
      color = this._colorCache[k];
    } else {
      var i = 0;
      var o = 0;
      var ref = this._positions.length - 1;

      for (; 0 <= ref ? o <= ref : o >= ref; i = (0 <= ref ? ++o : --o)) {
        var p = this._positions[i];

        if ((t <= p) || (t >= p && i === this._positions.length - 1)) {
          color = this._colors[i];
          break;
        }

        if (t > p && t < this._positions[i + 1]) {
          t = (t - p) / (this._positions[i + 1] - p);
          color = RGBScale._interpolateRGB(this._colors[i], this._colors[i + 1], t);
          break;
        }
      }

      if (color) {
        this._colorCache[k] = color;
      } else {
        color = [0,0,0,1];
      }
    }

    return color;
  };

  /**
   * clipRGB
   * @desc clamp colors to 0 or to 255 if out of bounds
   * @param {number[]} rgb - rgb colors in array
   */
  RGBScale._clipRGB = function(rgb) {
    if (!(Array.isArray(rgb) && rgb.length >= 3)) {
      rgb = [0,0,0,1];
    }

    for (var i = 0; i < rgb.length; i++) {
      if (i < 3) {
        if (rgb[i] < 0) {
          rgb[i] = 0;
        } else if (rgb[i] > 255) {
          rgb[i] = 255;
        }
      } else if (i === 3) {
        if (rgb[i] < 0) {
          rgb[i] = 0;
        } else if (rgb[i] > 1) {
          rgb[i] = 1;
        }
      }
    }

    return rgb;
  };

  /**
   * clipT
   * @desc Clips target value to stay within constraints 0-1
   * @param {number} target - target value
   * @return clipped value
   */
  RGBScale._clipT = function(t) {
    if (typeof t !== 'number') {
      t = 0;
    }

    if (t > 1) {
      t = 1;
    } else if (t < 0) {
      t = 0;
    }

    return t;
  };

  /**
   * interpolateRGB
   * @desc Interpolate RGB colors.
   * @param {number[]} rgb1 - rgb array
   * @param {number[]} rgb2 - rgb array
   * @param {number} target - target value between units 0 - 1
   * @return interpolated rgb color array
   */
  RGBScale._interpolateRGB =  function(rgb1, rgb2, t) {
    rgb1 = RGBScale._clipRGB(rgb1);
    rgb2 = RGBScale._clipRGB(rgb2);
    t = RGBScale._clipT(t);

    var r_1 = rgb1[0];
    var g_1 = rgb1[1];
    var b_1 = rgb1[2];
    var a_1 = rgb1[3];

    var r_2 = rgb2[0];
    var g_2 = rgb2[1];
    var b_2 = rgb2[2];
    var a_2 = rgb2[3];

    var r_3 = r_1 + t * (r_2 - r_1);
    var g_3 = g_1 + t * (g_2 - g_1);
    var b_3 = b_1 + t * (b_2 - b_1);
    var a_3 = a_1 + t * (a_2 - a_1);

    var result = [r_3, g_3, b_3, a_3];
    return result;
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = RGBScale;
    }
    exports.RGBScale = RGBScale;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return RGBScale;
    });
  } else {
    root.RGBScale = RGBScale;
  }
})(this);

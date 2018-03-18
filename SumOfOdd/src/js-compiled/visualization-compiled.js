"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Visualization = function () {
    function Visualization(element) {
        _classCallCheck(this, Visualization);

        this.svg = null;
        this.margin = { top: -0, right: -0, bottom: -0, left: -0 };
        this.width = 1800;
        this.height = 900;

        this.currentStep = 0;
        this.maxStep = 0;

        var realWidth = this.width + this.margin.left + this.margin.right;
        var realHeight = this.height + this.margin.top + this.margin.bottom;
        // Constants
        this.sqrSize = 100;
        this.numLayers = 8;
        this.translate = [(realWidth - this.numLayers * this.sqrSize) * 0.5, 0];
        this.scale = 1;

        var svg = d3.select(element).append("svg").attr("viewBox", "0 0 " + realWidth + " " + realHeight).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.right + ")");

        this.svg = svg;

        var rect = svg.append("rect").attr("class", "svgOuterRect").attr("x", -this.margin.left).attr("y", -this.margin.top).attr("width", realWidth).attr("height", realHeight);

        var container = svg.append("g").attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + "),scale(" + this.scale + ")");
        this.container = container;
        this.squares = this.container.append('g');
        this.texts = this.container.append('g');

        this.redraw(0);
    }

    _createClass(Visualization, [{
        key: "createData",
        value: function createData() {
            var sqrArr = [];
            for (var i = 0; i < this.numLayers; i++) {
                for (var j = 0; j < this.numLayers; j++) {
                    var xPos = j * this.sqrSize;
                    var yPos = i * this.sqrSize;
                    var type = Math.max(this.numLayers - 1 - i, j);
                    type = type % 2;
                    var obj = { id: [i, j], x: xPos, y: yPos, type: type };
                    sqrArr.push(obj);
                }
            }
            this.squareData = sqrArr;

            var txtArr = [];
            for (var _i = 0; _i < this.numLayers; _i++) {
                var caption = 2 * (_i + 1) - 1;
                if (_i === this.numLayers - 2) caption = "⋰";else if (_i === this.numLayers - 1) caption = "2n-1";
                var _obj = { x: (_i + 0.5) * this.sqrSize, y: (this.numLayers - 0.4 - _i) * this.sqrSize, caption: caption, type: _i % 2 };
                txtArr.push(_obj);
            }
            for (var _i2 = 0; _i2 < this.numLayers; _i2++) {
                var _caption = _i2 + 1;
                if (_i2 === this.numLayers - 2) _caption = "…";else if (_i2 === this.numLayers - 1) _caption = "n";
                var _obj2 = { x: (_i2 + 0.5) * this.sqrSize, y: (this.numLayers + 0.6) * this.sqrSize, caption: _caption, type: 2 };
                txtArr.push(_obj2);
            }
            this.textData = txtArr;
        }
    }, {
        key: "redraw",
        value: function redraw() {
            var step = arguments.length <= 0 || arguments[0] === undefined ? this.currentStep : arguments[0];

            this.currentStep = step;
            this.createData();
            this.createPolygons();
        }
    }, {
        key: "createPolygons",
        value: function createPolygons() {
            var squares = this.squares.selectAll(".square").data(this.squareData);
            squares.enter().append('rect').attr('class', 'square');
            this.squares.selectAll(".square").attr('width', this.sqrSize).attr('height', this.sqrSize).attr('x', function (d) {
                return d.x;
            }).attr('y', function (d) {
                return d.y;
            }).classed('firstColor', function (d) {
                return d.type == 0;
            }).classed('secondColor', function (d) {
                return d.type == 1;
            });

            var texts = this.texts.selectAll(".txt").data(this.textData).enter().append('text').attr('class', 'txt');
            texts = this.texts.selectAll(".txt").text(function (d) {
                return d.caption;
            }).attr('text-anchor', "middle") // horizontal alignment
            .attr('dominant-baseline', "middle") // vertical alignment
            .attr('transform', function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            }).classed('firstColor', function (d) {
                return d.type == 1;
            }).classed('secondColor', function (d) {
                return d.type == 0;
            });
        }
    }]);

    return Visualization;
}();
//# sourceMappingURL=visualization-compiled.js.map

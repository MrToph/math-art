"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Visualization = function () {
    function Visualization(element) {
        _classCallCheck(this, Visualization);

        this.svg = null;
        this.margin = { top: -0, right: -0, bottom: -0, left: -0 };
        this.width = 1000;
        this.height = 500;

        this.currentStep = 0;
        this.maxStep = 0;

        var realWidth = this.width + this.margin.left + this.margin.right;
        var realHeight = this.height + this.margin.top + this.margin.bottom;
        this.translate = [realWidth * 0.33, 0];
        this.scale = 1;

        var svg = d3.select(element).append("svg").attr("viewBox", "0 0 " + realWidth + " " + realHeight).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.right + ")");

        this.svg = svg;

        var rect = svg.append("rect").attr("class", "svgOuterRect").attr("x", -this.margin.left).attr("y", -this.margin.top).attr("width", realWidth).attr("height", realHeight);

        var container = svg.append("g").attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + "),scale(" + this.scale + ")");
        this.container = container;
        this.squares = this.container.append('g');
        this.triangles = this.container.append('g');
        this.links = [];

        // Constants
        this.colors = ["#ff3232", "#32CD32", "#3232ff", "#ffa500", "#8A2BE2"];
        this.sqrSize = 100;
        this.numLayers = 5;

        this.redraw(0);
    }

    _createClass(Visualization, [{
        key: "createData",
        value: function createData() {
            var sqrArr = [];
            var trArr = [];
            for (var i = 0; i < this.numLayers; i++) {
                for (var j = 0; j < i; j++) {
                    var xPos = j * this.sqrSize;
                    var yPos = i * this.sqrSize;
                    var obj = { id: [i, j], x: xPos, y: yPos };
                    sqrArr.push(obj);
                }
                for (var _j = 0; _j < 2; _j++) {
                    var a = [i * this.sqrSize, i * this.sqrSize]; // topleft
                    var b = _j == 0 ? [i * this.sqrSize, (i + 1) * this.sqrSize] : [(i + 1) * this.sqrSize, i * this.sqrSize]; // botleft // topRight
                    var c = [(i + 1) * this.sqrSize, (i + 1) * this.sqrSize]; // botRight
                    var _obj = { a: a, b: b, c: c, type: _j };
                    trArr.push(_obj);
                }
            }
            this.squareData = sqrArr;
            this.triangleData = trArr;
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
            });

            var triangles = this.triangles.selectAll(".triangle").data(this.triangleData);
            triangles.enter().append('polygon').attr('class', 'triangle');
            this.triangles.selectAll(".triangle").attr('points', function (d) {
                return d.a[0] + "," + d.a[1] + " " + d.b[0] + "," + d.b[1] + " " + d.c[0] + "," + d.c[1] + " ";
            }).classed('lowerTriangle', function (d) {
                return d.type == 0;
            }).classed('upperTriangle', function (d) {
                return d.type == 1;
            });
        }
    }]);

    return Visualization;
}();
//# sourceMappingURL=visualization-compiled.js.map

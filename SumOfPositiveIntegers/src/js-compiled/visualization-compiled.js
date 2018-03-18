"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Visualization = function (_ISteppable) {
    _inherits(Visualization, _ISteppable);

    function Visualization(element) {
        _classCallCheck(this, Visualization);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Visualization).call(this));

        _this.svg = null;
        _this.margin = { top: -0, right: -0, bottom: -0, left: -0 };
        _this.width = 1000;
        _this.height = 500;

        _this.currentStep = 0;
        _this.maxStep = 2;

        _this.translate = [0, 0];
        _this.scale = 1;

        var realWidth = _this.width + _this.margin.left + _this.margin.right;
        var realHeight = _this.height + _this.margin.top + _this.margin.bottom;
        var svg = d3.select(element).append("svg").attr("viewBox", "0 0 " + realWidth + " " + realHeight).append("g").attr("transform", "translate(" + _this.margin.left + "," + _this.margin.right + ")");

        _this.svg = svg;

        var rect = svg.append("rect").attr("class", "svgOuterRect").attr("x", -_this.margin.left).attr("y", -_this.margin.top).attr("width", realWidth).attr("height", realHeight);

        var container = svg.append("g").attr("transform", "translate(" + _this.translate[0] + "," + _this.translate[1] + "),scale(" + _this.scale + ")");
        _this.container = container;
        _this.triangles = [_this.container.append('g'), _this.container.append('g')];

        // Constants
        _this.colors = ["#ff3232", "#3232ff", "#32CD32", "#ffa500", "#8A2BE2"];
        _this.trWidth = 100;
        _this.trHeight = _this.trWidth;
        _this.margin = 2 * _this.trWidth;
        _this.numCells = 5;

        _this.redraw(0);
        return _this;
    }

    // http://www.fileformat.info/info/unicode/category/Sm/list.htm
    // \dots = \u2026   \vdots = \u22ee \ddots = \u22f0 (/) \u22f1 (\)


    _createClass(Visualization, [{
        key: "createData",
        value: function createData(step) {
            switch (step) {
                default:
                    {
                        this.triangleDrawData = [];
                        this.triangleDrawData.push(this.createTriangleData(false));
                        this.triangleDrawData.push(this.createTriangleData(true));
                        break;
                    }
            }
        }

        // idToText is a function that maps (row, column) to (text, layer) where layer is from 0 .. this.numCells [-1]
        // layer represents the structural layout of the triangle (layer 0: is where the 1's are, layer 1: where the 2's ... layer numCells - 1: where text = n)

    }, {
        key: "createTriangleData",
        value: function createTriangleData(upwards) {
            var arr = [];
            for (var i = 0; i < this.numCells; i++) {
                for (var j = 0; j <= i; j++) {
                    var jj = upwards ? this.numCells - 1 - j : j;
                    var ii = upwards ? this.numCells - 1 - i : i;
                    var xOffset = upwards ? this.numCells * this.trWidth : 0;
                    var xPos = jj * this.trWidth + xOffset;
                    var yPos = ii * this.trHeight;
                    var layer = i;
                    arr.push({ id: [i, j], width: this.trWidth, height: this.trHeight, layer: layer,
                        x: xPos, y: yPos });
                }
            }
            return arr;
        }
    }, {
        key: "redraw",
        value: function redraw() {
            var _this2 = this;

            var step = arguments.length <= 0 || arguments[0] === undefined ? this.currentStep : arguments[0];

            this.currentStep = step;

            this.createData(step);
            for (var i = 0; i < 2; i++) {
                this.createTriangle(step, i);
            }
            if (step === 1) {
                (function () {
                    var translationDuration = 3000;
                    var xOffset = (_this2.numCells - 1) / 2 * _this2.trWidth;
                    _this2.triangles[0].selectAll('.square').transition().ease('linear').duration(translationDuration).attr("x", function (d) {
                        return d.x + xOffset;
                    });

                    xOffset = -xOffset;
                    _this2.triangles[1].selectAll('.square').transition().ease('linear').duration(translationDuration).attr("x", function (d) {
                        return d.x + xOffset;
                    }).call(endAll, function () {
                        stepper.onForward();
                    });
                })();
            }
        }
    }, {
        key: "createTriangle",
        value: function createTriangle(step, index) {
            var _this3 = this;

            var triangleWidth = this.numCells * this.trWidth;
            this.triangles[index].selectAll(".square").remove();
            var squares = this.triangles[index].selectAll(".square").data(this.triangleDrawData[index]);
            squares.enter().append('rect').attr('class', 'square');

            // update
            var xOffset = step === 2 ? (this.numCells - 1) / 2 * this.trWidth : 0;
            xOffset = index === 0 ? xOffset : -xOffset;
            squares = this.triangles[index].selectAll(".square").attr('width', function (d) {
                return d.width;
            }).attr('height', function (d) {
                return d.height;
            }).attr('x', function (d) {
                return d.x + xOffset;
            }).attr('y', function (d) {
                return d.y;
            }).attr("fill", function (d, i) {
                if (step === 0) return _this3.colors[d.layer];else return _this3.colors[index];
            });
        }
    }, {
        key: "onStep",
        value: function onStep(forward) {
            // always stop all transitions
            this.container.selectAll('.square').transition();
            return _get(Object.getPrototypeOf(Visualization.prototype), "onStep", this).call(this, forward);
        }
    }]);

    return Visualization;
}(ISteppable);

function endAll(transition, callback) {
    var n;

    if (transition.empty()) {
        callback();
    } else {
        n = transition.size();
        transition.each("end", function () {
            n--;
            if (n === 0) {
                callback();
            }
        });
    }
}
//# sourceMappingURL=visualization-compiled.js.map

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
        _this.width = 2600;
        _this.height = 500;

        _this.currentStep = 0;
        _this.maxStep = 1;

        _this.translate = [0, 0];
        _this.scale = 1;

        var realWidth = _this.width + _this.margin.left + _this.margin.right;
        var realHeight = _this.height + _this.margin.top + _this.margin.bottom;
        var svg = d3.select(element).append("svg").attr("viewBox", "0 0 " + realWidth + " " + realHeight).append("g").attr("transform", "translate(" + _this.margin.left + "," + _this.margin.right + ")");

        _this.svg = svg;

        var rect = svg.append("rect").attr("class", "svgOuterRect").attr("x", -_this.margin.left).attr("y", -_this.margin.top).attr("width", realWidth).attr("height", realHeight);

        var container = svg.append("g").attr("transform", "translate(" + _this.translate[0] + "," + _this.translate[1] + "),scale(" + _this.scale + ")");
        _this.container = container;
        _this.triangles = container.append('svg:g');
        _this.texts = container.append('svg:g');

        // Constants
        _this.colors = ["#ff3232", "#32CD32", "#3232ff", "#000000", "#ffa500", "#8A2BE2"];
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
            var _this2 = this;

            switch (step) {
                default:
                    {
                        this.triangleDrawData = [];
                        this.triangleDrawData.push(this.createTriangleData(function (_ref) {
                            var _ref2 = _slicedToArray(_ref, 2);

                            var i = _ref2[0];
                            var j = _ref2[1];

                            var layer = i;
                            var text = i + 1;
                            if (i === _this2.numCells - 2) {
                                text = j < 3 ? "⋮" : "⋱";
                            } else if (i === _this2.numCells - 1) text = "n";
                            return [text, layer];
                        }));
                        this.triangleDrawData.push(this.createTriangleData(function (_ref3) {
                            var _ref4 = _slicedToArray(_ref3, 2);

                            var i = _ref4[0];
                            var j = _ref4[1];

                            var layer = _this2.numCells - 1 - (i - j);
                            var text = _this2.numCells - (i - j);
                            if (text == _this2.numCells - 1) {
                                switch (j) {
                                    case 0:
                                        text = "⋮";
                                        break;
                                    case 3:
                                        text = "…";
                                        break;
                                    default:
                                        text = "⋰";
                                }
                            } else if (text == _this2.numCells) text = "n";
                            return [text, layer];
                        }));
                        this.triangleDrawData.push(this.createTriangleData(function (_ref5) {
                            var _ref6 = _slicedToArray(_ref5, 2);

                            var i = _ref6[0];
                            var j = _ref6[1];

                            var layer = _this2.numCells - 1 - j;
                            var text = _this2.numCells - j;
                            if (text == _this2.numCells - 1) {
                                switch (i) {
                                    case 1:
                                        text = "⋱";
                                        break;
                                    default:
                                        text = "…";
                                }
                            } else if (text == _this2.numCells) text = "n";
                            return [text, layer];
                        }));
                        this.triangleDrawData.push(this.createTriangleData(function (_ref7) {
                            var _ref8 = _slicedToArray(_ref7, 2);

                            var i = _ref8[0];
                            var j = _ref8[1];
                            return ["2n+1", _this2.numCells];
                        }));

                        // +, +, = between the triangles
                        var triangleWidth = this.numCells * this.trWidth;
                        this.operandData = [{ x: triangleWidth + 0.5 * this.margin, y: 0.5 * triangleWidth, caption: "+", fontSize: "96pt" }, { x: 2 * triangleWidth + 1.5 * this.margin, y: 0.5 * triangleWidth, caption: "+", fontSize: "96pt" }, { x: 3 * triangleWidth + 2.5 * this.margin, y: 0.5 * triangleWidth, caption: "=", fontSize: "96pt" }];
                        break;
                    }
            }
        }

        // idToText is a function that maps (row, column) to (text, layer) where layer is from 0 .. this.numCells [-1]
        // layer represents the structural layout of the triangle (layer 0: is where the 1's are, layer 1: where the 2's ... layer numCells - 1: where text = n)

    }, {
        key: "createTriangleData",
        value: function createTriangleData(idToText) {
            var arr = [];
            for (var i = 0; i < this.numCells; i++) {
                for (var j = 0; j <= i; j++) {
                    var xPos = j * this.trWidth;
                    var yPos = i * this.trHeight;

                    var _idToText = idToText([i, j]);

                    var _idToText2 = _slicedToArray(_idToText, 2);

                    var text = _idToText2[0];
                    var layer = _idToText2[1];

                    arr.push({ id: [i, j], width: this.trWidth, height: this.trHeight, caption: text, layer: layer,
                        x: xPos, y: yPos });
                }
            }
            return arr;
        }
    }, {
        key: "redraw",
        value: function redraw() {
            var _this3 = this;

            var step = arguments.length <= 0 || arguments[0] === undefined ? this.currentStep : arguments[0];

            this.currentStep = step;

            this.createData(step);
            this.triangles.selectAll('.squareContainer0, .squareContainer1, .squareContainer2, .squareContainer3').remove();
            for (var i = 0; i < 4; i++) {
                this.createTriangle(i);
            }
            this.createOperands();
            if (step === 0) {
                (function () {
                    var opacityDuration = 2250;
                    var triangles = _this3.triangles.selectAll('.squareContainer0, .squareContainer1, .squareContainer2, .squareContainer3').select('.squareText');
                    triangles.style("opacity", 0.0).transition().ease('linear').duration(opacityDuration).delay(function (d) {
                        return d.layer * opacityDuration;
                    }).style("opacity", 1.0).call(endAll, function () {
                        stepper.onForward();
                    });
                })();
            }
        }
    }, {
        key: "createOperands",
        value: function createOperands() {
            var texts = this.texts.selectAll(".operand").data(this.operandData).enter().append('text').attr('class', 'operand');
            texts = this.texts.selectAll(".operand").text(function (d) {
                return d.caption;
            }).attr('text-anchor', "middle") // horizontal alignment
            .attr('dominant-baseline', "middle") // vertical alignment
            .attr('transform', function (d) {
                return "translate(" + d.x + "," + 1.1 * d.y + ")";
            }).attr("font-size", function (d) {
                return d.fontSize;
            });
        }
    }, {
        key: "createTriangle",
        value: function createTriangle(index) {
            var _this4 = this;

            var triangleWidth = this.numCells * this.trWidth;
            var squares = this.triangles.selectAll(".squareContainer" + index).data(this.triangleDrawData[index]);
            var squaresContainer = squares.enter().append('g').attr('class', 'squareContainer' + index);
            squaresContainer.append('rect').attr('class', 'square');
            squaresContainer.append('text').attr('class', 'squareText');
            // update
            squares = this.triangles.selectAll(".squareContainer" + index);
            squares.attr('transform', 'translate(' + index * (triangleWidth + this.margin) + ', 0)');
            squares.selectAll(".square").data(function (d) {
                return [d];
            }) // descend parent data into children, d comes from parent selection (need to select .squareContainer because of that)
            .attr('width', function (d) {
                return d.width;
            }).attr('height', function (d) {
                return d.height;
            }).attr('x', function (d) {
                return d.x;
            }).attr('y', function (d) {
                return d.y;
            });

            var fontSize = index === 3 ? "23pt" : "36pt";
            squares.selectAll('.squareText').data(function (d) {
                return [d];
            }) // descend parent data into children
            .text(function (d) {
                return d.caption;
            }).attr('text-anchor', "middle") // horizontal alignment
            .attr('dominant-baseline', "middle") // vertical alignment
            .attr('transform', function (d) {
                return "translate(" + (d.x + 0.5 * d.width) + "," + (d.y + 0.55 * d.height) + ")";
            }).attr("font-size", fontSize).style("opacity", 1.0).attr("fill", function (d) {
                return _this4.colors[d.layer];
            });
        }
    }, {
        key: "onStep",
        value: function onStep(forward) {
            // always stop all transitions
            this.container.selectAll('.squareText').transition();
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

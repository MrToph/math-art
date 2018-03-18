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
        _this.width = 500;
        _this.height = 500;

        _this.currentStep = 0;
        _this.maxStep = 998;

        var realWidth = _this.width + _this.margin.left + _this.margin.right;
        var realHeight = _this.height + _this.margin.top + _this.margin.bottom;
        var svg = d3.select(element).append("svg").attr("viewBox", "0 0 " + realWidth + " " + realHeight).append("g").attr("transform", "translate(" + _this.margin.left + "," + _this.margin.right + ")");

        _this.svg = svg;

        var rect = svg.append("rect").attr("class", "svgOuterRect").attr("x", -_this.margin.left).attr("y", -_this.margin.top).attr("width", realWidth).attr("height", realHeight);

        _this.translate = [0 * realWidth, 0];
        _this.scale = 1;
        var container = svg.append("g").attr("transform", "translate(" + _this.translate[0] + "," + _this.translate[1] + "),scale(" + _this.scale + ")");
        _this.container = container;
        _this.squares = container.append('svg:g');
        _this.texts = container.append('svg:g');

        // Constants
        _this.colors = ["#ff3232", "#32CD32", "#3232ff", "#000000", "#ffa500", "#8A2BE2"];
        _this.sqSize = realHeight;

        _this.redraw(0);
        return _this;
    }

    _createClass(Visualization, [{
        key: "createData",
        value: function createData(step) {
            this.textData = [{ id: 1, x: 0.5 * this.sqSize, y: 0.75 * this.sqSize, fontSize: "48pt" }, { id: 2, x: 0.25 * this.sqSize, y: 0.25 * this.sqSize, fontSize: "24pt" }];
            this.sqData = [];
            var stepMod = step % 4;

            this.sqData.push({ x: 0, y: 0, width: this.sqSize, height: this.sqSize });
            if (stepMod >= 1) this.sqData.push({ x: 0, y: 0.5 * this.sqSize, width: this.sqSize, height: 0.5 * this.sqSize });
            if (stepMod >= 2) this.sqData.push({ x: 0, y: 0, width: 0.5 * this.sqSize, height: 0.5 * this.sqSize });
        }
    }, {
        key: "redraw",
        value: function redraw() {
            var step = arguments.length <= 0 || arguments[0] === undefined ? this.currentStep : arguments[0];
            var forward = arguments[1];

            this.currentStep = step;

            this.createData(step);
            this.squares.selectAll('.square').remove();
            this.createSquares();
            this.createText(step);
            this.container.attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + ")scale(" + 1 + ")");
            if (step % 4 === 3) {
                this.container.transition().duration(2000).attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + ")scale(" + 2 + ")translate(" + -0.5 * this.sqSize + "," + 0 + ")").each('end', function () {
                    return stepper.onForward();
                });
            }
        }
    }, {
        key: "createText",
        value: function createText(step) {
            var texts = this.texts.selectAll(".txt").data(this.textData).enter().append('text').attr('class', 'txt');
            texts = this.texts.selectAll(".txt").text(function (d) {
                var stepMod = step % 4;
                if (d.id > stepMod) return "";
                var inv = 0;
                if (d.id == 1) {
                    inv = Math.ceil((stepMod === 3 ? step - 1 : step) / 2);
                } else {
                    // d.id == 2
                    inv = Math.ceil((step + 1) / 2);
                }
                if (inv < 31) {
                    inv = "1/" + Math.pow(2, inv);
                } else {
                    inv = "2^-" + inv;
                }
                return inv;
            }).attr('text-anchor', "middle") // horizontal alignment
            .attr('dominant-baseline', "middle") // vertical alignment
            .attr('transform', function (d) {
                return "translate(" + d.x + "," + 1.1 * d.y + ")";
            }).attr("font-size", function (d) {
                return d.fontSize;
            });
        }
    }, {
        key: "createSquares",
        value: function createSquares() {
            var squares = this.squares.selectAll(".square").data(this.sqData).enter().append('rect').attr('class', 'square');

            squares = this.squares.selectAll(".square").attr('width', function (d) {
                return d.width;
            }).attr('height', function (d) {
                return d.height;
            }).attr('x', function (d) {
                return d.x;
            }).attr('y', function (d) {
                return d.y;
            });
        }
    }, {
        key: "onStep",
        value: function onStep(forward) {
            // always stop all transitions
            this.container.interrupt().transition();
            return _get(Object.getPrototypeOf(Visualization.prototype), "onStep", this).call(this, forward); // calls redraw
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

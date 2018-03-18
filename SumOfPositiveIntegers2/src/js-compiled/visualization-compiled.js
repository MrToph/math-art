"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Visualization = function () {
    function Visualization(element) {
        _classCallCheck(this, Visualization);

        this.svg = null;
        this.margin = { top: -0, right: -0, bottom: -0, left: -0 };
        this.width = 1400;
        this.height = 700;

        this.currentStep = 0;
        this.maxStep = 0;

        this.translate = [0, 0];
        this.scale = 1;

        var realWidth = this.width + this.margin.left + this.margin.right;
        var realHeight = this.height + this.margin.top + this.margin.bottom;
        var svg = d3.select(element).append("svg").attr("viewBox", "0 0 " + realWidth + " " + realHeight).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.right + ")");

        this.svg = svg;

        var rect = svg.append("rect").attr("class", "svgOuterRect").attr("x", -this.margin.left).attr("y", -this.margin.top).attr("width", realWidth).attr("height", realHeight);

        var container = svg.append("g").attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + "),scale(" + this.scale + ")");
        this.container = container;
        this.circles = this.container.append('g').attr("transform", "translate(" + realWidth * 0.5 + "," + 0 + ")");
        this.links = [];

        // Constants
        this.colors = ["#ff3232", "#32CD32", "#3232ff", "#ffa500", "#8A2BE2"];
        this.circRadius = 50;
        this.numLayers = 7;

        this.redraw(0);
    }

    _createClass(Visualization, [{
        key: "createData",
        value: function createData() {
            var arr = [];
            for (var i = 0; i < this.numLayers; i++) {
                var xOffset = i * this.circRadius;
                for (var j = 0; j <= i; j++) {
                    var xPos = j * (2 * this.circRadius) - xOffset;
                    var yPos = (i * 2 + 1) * this.circRadius;
                    var layer = i;
                    var obj = { id: [i, j], radius: this.circRadius * 0.9, x: xPos, y: yPos,
                        class: i === this.numLayers - 1 ? "lowerCircle" : "upperCircle" };
                    arr.push(obj);
                }
            }
            this.circleData = arr;
        }
    }, {
        key: "redraw",
        value: function redraw() {
            var step = arguments.length <= 0 || arguments[0] === undefined ? this.currentStep : arguments[0];

            this.currentStep = step;
            // create the circles
            this.createData();
            this.createCircles();
            // create the links
            var linksContainer = this.circles.append('g');
            for (var i = 0; i < 2; i++) {
                this.links[i] = linksContainer.append('line').attr("class", "link").classed("svgHidden", true).attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 0);
            }
            // update the circles
            this.updateCircles();
        }
    }, {
        key: "createCircles",
        value: function createCircles() {
            var circles = this.circles.selectAll(".circle").data(this.circleData);
            circles.enter().append('circle').attr('class', 'circle');
        }
    }, {
        key: "updateCircles",
        value: function updateCircles() {
            this.circles.selectAll(".circle").attr('id', function (d) {
                return d.id[0] + "," + d.id[1];
            }).attr('r', function (d) {
                return d.radius;
            }).attr('cx', function (d) {
                return d.x;
            }).attr('cy', function (d) {
                return d.y;
            }).attr('class', function (d) {
                return 'circle ' + d.class;
            });
            var _this = this;
            this.circles.selectAll(".upperCircle").on("mouseover", function (d) {
                // this.style.cursor='pointer';
                _this.pointLinks(d3.select(this));
            }).on("mouseout", function (d) {
                _this.hideLinks();
            });
        }
    }, {
        key: "hideLinks",
        value: function hideLinks() {
            this.circles.selectAll('.lowerCircle').classed("lowerCircleSelected", false);
            for (var i = 0; i < 2; i++) {
                this.links[i].classed("svgHidden", true);
            }
        }
    }, {
        key: "pointLinks",
        value: function pointLinks(circ) {
            var _this2 = this;

            for (var i = 0; i < 2; i++) {
                this.links[i].classed("svgHidden", false).attr("x1", circ.attr("cx")).attr("y1", circ.attr("cy"));
            }

            var _circ$attr$split = circ.attr("id").split(',');

            var _circ$attr$split2 = _slicedToArray(_circ$attr$split, 2);

            var r = _circ$attr$split2[0];
            var c = _circ$attr$split2[1];

            r = parseInt(r);
            c = parseInt(c);

            var _loop = function _loop(_i) {
                var c2 = _i === 0 ? c : _this2.numLayers - 1 - r + c;
                var circTo = _this2.circles.selectAll('.lowerCircle').filter(function (d, index) {
                    return index === c2;
                });
                _this2.links[_i].attr("x2", circTo.attr("cx")).attr("y2", circTo.attr("cy"));
                circTo.classed("lowerCircleSelected", true);
            };

            for (var _i = 0; _i < 2; _i++) {
                _loop(_i);
            }
        }
    }]);

    return Visualization;
}();
//# sourceMappingURL=visualization-compiled.js.map

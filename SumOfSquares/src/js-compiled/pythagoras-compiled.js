"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pythagoras = function (_ISteppable) {
    _inherits(Pythagoras, _ISteppable);

    function Pythagoras() {
        _classCallCheck(this, Pythagoras);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Pythagoras).call(this));

        _this2.svg = null;
        _this2.margin = { top: -5, right: -5, bottom: -5, left: -5 };
        _this2.width = 1200 - _this2.margin.left - _this2.margin.right;
        _this2.height = 500 - _this2.margin.top - _this2.margin.bottom;

        _this2.currentStep = 0;
        _this2.squareSize = 450;
        _this2.squareOffset = [{ top: 25, left: 50 }, { top: 25, left: _this2.width - _this2.squareSize - 50 }];
        _this2.r = _this2.squareSize * .7;

        _this2.colors = ["#ff3232", "#32ff32", "#3232ff"];
        _this2.maxStep = 7;

        _this2.translate = [0, 0];
        _this2.scale = 1;
        return _this2;
    }

    _createClass(Pythagoras, [{
        key: "init",
        value: function init(element) {
            var realWidth = this.width + this.margin.left + this.margin.right;
            var realHeight = this.height + this.margin.top + this.margin.bottom;
            var svg = d3.select(element).append("svg").attr("viewBox", "0 0 " + realWidth + " " + realHeight)
            // .attr('width', "100%") // automatically resize
            // .attr('height', "100%")
            .append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.right + ")");

            this.svg = svg;

            var rect = svg.append("rect").attr("x", -this.margin.left).attr("y", -this.margin.top).attr("width", realWidth).attr("height", realHeight);

            var container = svg.append("g").attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + "),scale(" + this.scale + ")");
            this.createGradient();
            this.container = container;
            this.triangles = container.append('svg:g');
            this.squares = container.append('svg:g');
            this.texts = container.append('svg:g');
            this.dragPoint = container.append('svg:g');
            this.redraw(0);
        }
    }, {
        key: "getSVG",
        value: function getSVG() {
            return this.svg;
        }
    }, {
        key: "toSVGCoordinates",
        value: function toSVGCoordinates(point) {
            var p = [point[0], point[1]];
            p[0] = (p[0] - this.translate[0]) / this.scale;
            p[1] = (p[1] - this.translate[1]) / this.scale;
            return p;
        }
    }, {
        key: "idToPoint",
        value: function idToPoint(id) {
            return $.grep(this.points, function (e) {
                return e.id === id;
            })[0];
        }

        // triangleData Explanation:
        // a, b, c: The inherent shape of the triangle (no position/translation data here).
        // pivot: Where the pivot will be w.r.t a,b,c (also no position data)
        // rotate: rotation in degrees. Rotates around pivot
        // translate: World coordinate where the pivot will be set to offset by + this.squareOffsets[squareOffset]
        // squareOffset: offsets translate by + this.squareOffsets[squareOffset]

    }, {
        key: "createShapes",
        value: function createShapes(step) {
            switch (step) {
                case 0:
                    {
                        this.points = [{ id: 100, x: 0, y: 0 }, { id: 101, x: this.r, y: 0 }, { id: 102, x: 0, y: this.squareSize - this.r }, { id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top }];
                        this.triangleData = [{ a: 100, b: 101, c: 102, pivot: 100, translate: 100, squareIndex: 0, rotation: 0 }];
                        this.squareData = [];
                        this.dragPointData = [{ index: 999 }];
                        this.textData = [];
                        break;
                    }
                case 1:
                    {
                        this.points = [{ id: 1, x: 0, y: 0 }, { id: 2, x: this.r, y: 0 }, { id: 3, x: this.squareSize, y: this.r }, { id: 4, x: this.squareSize - this.r, y: this.squareSize }, { id: 5, x: 0, y: this.squareSize - this.r }, { id: 100, x: 0, y: 0 }, { id: 101, x: this.r, y: 0 }, { id: 102, x: 0, y: this.squareSize - this.r }, { id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top }];
                        this.triangleData = [{ a: 100, b: 101, c: 102, pivot: 100, translate: 1, squareIndex: 0, rotation: 0 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 2, squareIndex: 0, rotation: 180 }, // rotate from 180 to 90
                        { a: 100, b: 101, c: 102, pivot: 102, translate: 3, squareIndex: 0, rotation: 270 }, // rotate from 270 to 180
                        { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 0, rotation: 360 } // rotate from 0 to 270
                        ];
                        this.squareData = [{ a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0] }];
                        this.dragPointData = [];
                        this.textData = [];
                        break;
                    }
                case 2:
                    {
                        this.points = [{ id: 1, x: 0, y: 0 }, { id: 2, x: this.r, y: 0 }, { id: 3, x: this.squareSize, y: this.r }, { id: 4, x: this.squareSize - this.r, y: this.squareSize }, { id: 5, x: 0, y: this.squareSize - this.r }, { id: 100, x: 0, y: 0 }, { id: 101, x: this.r, y: 0 }, { id: 102, x: 0, y: this.squareSize - this.r }, { id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top }];
                        this.triangleData = [{ a: 100, b: 101, c: 102, pivot: 100, translate: 1, squareIndex: 0, rotation: 0 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 2, squareIndex: 0, rotation: 90 }, // rotate from 180 to 90
                        { a: 100, b: 101, c: 102, pivot: 102, translate: 3, squareIndex: 0, rotation: 180 }, // rotate from 270 to 180
                        { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 0, rotation: 270 } // rotate from 0 to 270
                        ];
                        this.squareData = [{ a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0] }];
                        this.dragPointData = [{ index: 999 }];
                        this.textData = [];
                        break;
                    }
                case 3:
                    {
                        this.points = [{ id: 1, x: 0, y: 0 }, { id: 2, x: this.r, y: 0 }, { id: 3, x: this.squareSize, y: this.r }, { id: 4, x: this.squareSize - this.r, y: this.squareSize }, { id: 5, x: 0, y: this.squareSize - this.r }, { id: 100, x: 0, y: 0 }, { id: 101, x: this.r, y: 0 }, { id: 102, x: 0, y: this.squareSize - this.r }, { id: 998, x: (this.squareOffset[0].left + this.squareSize + this.squareOffset[1].left) / 2 - 22, y: this.squareOffset[0].top + this.squareSize / 2 + 43 }, { id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top }];
                        this.triangleData = [{ a: 100, b: 101, c: 102, pivot: 100, translate: 1, squareIndex: 0, rotation: 0 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 2, squareIndex: 0, rotation: 90 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 3, squareIndex: 0, rotation: 180 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 0, rotation: 270 }, { a: 100, b: 101, c: 102, pivot: 100, translate: 1, squareIndex: 1, rotation: 0 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 2, squareIndex: 1, rotation: 90 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 3, squareIndex: 1, rotation: 180 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 1, rotation: 270 }];
                        this.squareData = [{ a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0] }, { a: 2, b: 3, c: 4, d: 5, squareIndex: 1, color: "url(#gradient)" }];
                        this.dragPointData = [{ index: 999 }];
                        this.textData = [{ caption: "=", fontSize: "72pt", translate: 998 }];
                        break;
                    }
                case 4:
                    {
                        this.points = [{ id: 1, x: 0, y: 0 }, { id: 2, x: this.r, y: 0 }, { id: 3, x: this.squareSize, y: this.r }, { id: 4, x: this.squareSize - this.r, y: this.squareSize }, { id: 5, x: 0, y: this.squareSize - this.r }, { id: 100, x: 0, y: 0 }, { id: 101, x: this.r, y: 0 }, { id: 102, x: 0, y: this.squareSize - this.r }, { id: 200, x: this.squareSize - this.r, y: 0 }, { id: 201, x: this.squareSize, y: 0 }, { id: 202, x: this.squareSize - this.r, y: this.r }, { id: 203, x: this.squareSize, y: this.r }, { id: 204, x: 0, y: this.r }, { id: 205, x: 0, y: this.squareSize }, { id: 206, x: this.squareSize - this.r, y: this.squareSize }, { id: 998, x: (this.squareOffset[0].left + this.squareSize + this.squareOffset[1].left) / 2 - 22, y: this.squareOffset[0].top + this.squareSize / 2 + 43 }, { id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top }];
                        this.triangleData = [{ a: 100, b: 101, c: 102, pivot: 101, translate: 2, squareIndex: 0, rotation: 0 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 2, squareIndex: 0, rotation: 90 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 3, squareIndex: 0, rotation: 180 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 0, rotation: 270 }, { a: 100, b: 101, c: 102, pivot: 101, translate: 2, squareIndex: 1, rotation: 0, rotationTo: -90, moveTo: 1 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 2, squareIndex: 1, rotation: 90, moveTo: 1 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 3, squareIndex: 1, rotation: 180 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 1, rotation: 270, rotationTo: 360 }];
                        this.squareData = [{ a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0] }, { a: 2, b: 3, c: 4, d: 5, squareIndex: 1, color: "url(#gradient)" }, { a: 200, b: 201, c: 203, d: 202, squareIndex: 1, color: this.colors[1] }, { a: 204, b: 202, c: 206, d: 205, squareIndex: 1, color: this.colors[2] }];
                        this.dragPointData = [];
                        this.textData = [{ caption: "=", fontSize: "72pt", translate: 998 }];
                        break;
                    }
                case 5:
                    {
                        this.points = [{ id: 1, x: 0, y: 0 }, { id: 2, x: this.r, y: 0 }, { id: 3, x: this.squareSize, y: this.r }, { id: 4, x: this.squareSize - this.r, y: this.squareSize }, { id: 5, x: 0, y: this.squareSize - this.r }, { id: 100, x: 0, y: 0 }, { id: 101, x: this.r, y: 0 }, { id: 102, x: 0, y: this.squareSize - this.r }, { id: 200, x: this.squareSize - this.r, y: 0 }, { id: 201, x: this.squareSize, y: 0 }, { id: 202, x: this.squareSize - this.r, y: this.r }, { id: 203, x: this.squareSize, y: this.r }, { id: 204, x: 0, y: this.r }, { id: 205, x: 0, y: this.squareSize }, { id: 206, x: this.squareSize - this.r, y: this.squareSize }, { id: 998, x: (this.squareOffset[0].left + this.squareSize + this.squareOffset[1].left) / 2 - 22, y: this.squareOffset[0].top + this.squareSize / 2 + 43 }, { id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top }];
                        this.triangleData = [{ a: 100, b: 101, c: 102, pivot: 101, translate: 2, squareIndex: 0, rotation: 0 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 2, squareIndex: 0, rotation: 90 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 3, squareIndex: 0, rotation: 180 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 0, rotation: 270 }, { a: 100, b: 101, c: 102, pivot: 101, translate: 1, squareIndex: 1, rotation: 270 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 1, squareIndex: 1, rotation: 90 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 3, squareIndex: 1, rotation: 180 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 1, rotation: 0 }];
                        this.squareData = [{ a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0] }, { a: 200, b: 201, c: 203, d: 202, squareIndex: 1, color: this.colors[1] }, { a: 204, b: 202, c: 206, d: 205, squareIndex: 1, color: this.colors[2] }];
                        this.dragPointData = [{ index: 999 }];
                        this.textData = [{ caption: "=", fontSize: "72pt", translate: 998 }];
                        break;
                    }
                case 6:
                    {
                        this.points = [{ id: 1, x: 0, y: 0 }, { id: 2, x: this.r, y: 0 }, { id: 3, x: this.squareSize, y: this.r }, { id: 4, x: this.squareSize - this.r, y: this.squareSize }, { id: 5, x: 0, y: this.squareSize - this.r }, { id: 100, x: 0, y: 0 }, { id: 101, x: this.r, y: 0 }, { id: 102, x: 0, y: this.squareSize - this.r }, { id: 200, x: this.squareSize - this.r, y: 0 }, { id: 201, x: this.squareSize, y: 0 }, { id: 202, x: this.squareSize - this.r, y: this.r }, { id: 203, x: this.squareSize, y: this.r }, { id: 204, x: 0, y: this.r }, { id: 205, x: 0, y: this.squareSize }, { id: 206, x: this.squareSize - this.r, y: this.squareSize }, { id: 998, x: (this.squareOffset[0].left + this.squareSize + this.squareOffset[1].left) / 2 - 22, y: this.squareOffset[0].top + this.squareSize / 2 + 43 }, { id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top }];
                        this.triangleData = [{ a: 100, b: 101, c: 102, pivot: 101, translate: 2, squareIndex: 0, rotation: 0 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 2, squareIndex: 0, rotation: 90 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 3, squareIndex: 0, rotation: 180 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 0, rotation: 270 }, { a: 100, b: 101, c: 102, pivot: 101, translate: 1, squareIndex: 1, rotation: 270 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 1, squareIndex: 1, rotation: 90 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 3, squareIndex: 1, rotation: 180 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 1, rotation: 0 }];
                        this.squareData = [{ a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0] }, { a: 200, b: 201, c: 203, d: 202, squareIndex: 1, color: this.colors[1] }, { a: 204, b: 202, c: 206, d: 205, squareIndex: 1, color: this.colors[2] }];
                        this.dragPointData = [];
                        this.textData = [{ caption: "=", fontSize: "72pt", translate: 998 }];
                        break;
                    }
                case 7:
                    {
                        this.points = [{ id: 1, x: 0, y: 0 }, { id: 2, x: this.r, y: 0 }, { id: 3, x: this.squareSize, y: this.r }, { id: 4, x: this.squareSize - this.r, y: this.squareSize }, { id: 5, x: 0, y: this.squareSize - this.r }, { id: 100, x: 0, y: 0 }, { id: 101, x: this.r, y: 0 }, { id: 102, x: 0, y: this.squareSize - this.r }, { id: 200, x: this.squareSize - this.r, y: 0 }, { id: 201, x: this.squareSize, y: 0 }, { id: 202, x: this.squareSize - this.r, y: this.r }, { id: 203, x: this.squareSize, y: this.r }, { id: 204, x: 0, y: this.r }, { id: 205, x: 0, y: this.squareSize }, { id: 206, x: this.squareSize - this.r, y: this.squareSize }, { id: 998, x: (this.squareOffset[0].left + this.squareSize + this.squareOffset[1].left) / 2 - 22, y: this.squareOffset[0].top + this.squareSize / 2 + 43 }, { id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top }];
                        this.triangleData = [{ a: 100, b: 101, c: 102, pivot: 101, translate: 2, squareIndex: 0, rotation: 0 }, { a: 100, b: 101, c: 102, pivot: 102, translate: 4, squareIndex: 1, rotation: 0 }];
                        this.squareData = [{ a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0] }, { a: 200, b: 201, c: 203, d: 202, squareIndex: 1, color: this.colors[1] }, { a: 204, b: 202, c: 206, d: 205, squareIndex: 1, color: this.colors[2] }];
                        this.dragPointData = [{ index: 999 }];
                        this.textData = [{ caption: "=", fontSize: "72pt", translate: 998 }];
                        break;
                    }
            }
        }
    }, {
        key: "redraw",
        value: function redraw() {
            var _this3 = this;

            var step = arguments.length <= 0 || arguments[0] === undefined ? this.currentStep : arguments[0];

            this.currentStep = step;

            var _this = this;
            this.createShapes(step);

            ////////////////////
            ///// TRIANGLES ////
            ////////////////////
            this.triangles.selectAll('.outerTriangle').remove(); // kill it to as otherwise when its transition gets canceled it stops mid rotation
            var trianglePolys = this.triangles.selectAll(".outerTriangle").data(this.triangleData); // data() which returns the update selection. this represents the selected DOM elements that were successfully bound to the specified data elements
            // handle new triangles
            var g = trianglePolys.enter();
            this.createTriangles(g);
            trianglePolys.exit().remove();

            // update existing triangles
            this.updateTriangles();

            ////////////////////
            //// DRAG POINT ////
            ////////////////////
            var drag = d3.behavior.drag().origin(function (d) {
                return _this.idToPoint(d.index);
            }).on("drag", function (d, i) {
                var maxR = _this.squareSize;
                _this.r = (d3.event.x - _this.squareOffset[0].left).clamp(0, maxR);
                _this.redraw();
            });

            var dragPoint = this.dragPoint.selectAll("circle").data(this.dragPointData);
            // update existing drag point
            dragPoint.attr("cx", function (d) {
                return _this.idToPoint(d.index).x;
            }).attr("cy", function (d) {
                return _this.idToPoint(d.index).y;
            });

            // handle new dragPoint
            dragPoint.enter().append("circle").attr('class', 'dragpoint').attr("r", 10).attr("cx", function (d) {
                return _this.idToPoint(d.index).x;
            }).attr("cy", function (d) {
                return _this.idToPoint(d.index).y;
            }).call(drag);

            dragPoint.exit().remove();

            ////////////////////
            ////// SQUARES /////
            ////////////////////
            this.squares.selectAll('.square').remove(); // if its transition got canceled, we need to restore its opacity to 1.0
            var squares = this.squares.selectAll(".square").data(this.squareData);
            var g = squares.enter();
            this.createSquares(g);
            squares.exit().remove();
            this.updateSquares();

            ////////////////////
            /////// TEXTS //////
            ////////////////////
            var texts = this.texts.selectAll('text').data(this.textData);
            texts.exit().remove();
            texts.enter().append("text");
            this.texts.selectAll('text').attr('transform', function (d) {
                return "translate(" + _this.idToPoint(d.translate).x + "," + _this.idToPoint(d.translate).y + ")";
            }).text(function (d) {
                return d.caption;
            }).attr("font-size", function (d) {
                return d.fontSize;
            });

            ////////////////////
            ///// ANIMATIONS ///
            ////////////////////
            if (step == 1) {
                var rotateFn = function rotateFn() {
                    // We only use 'd', but list d,i,a as params just to show can have them as params.
                    // Code only really uses d and t.
                    return function (d, i) {
                        var interpolater = d3.interpolate(d.rotation, d.rotation - 90);
                        return function (t) {
                            return "rotate(" + interpolater(t) % 360 + ")";
                        };
                    };
                };

                var opacityDuration = 1000,
                    rotateDuration = 2000;

                this.squares.selectAll('.square').style("opacity", 0.0).transition().ease('linear').duration(opacityDuration).delay(function (d, i) {
                    return 3 * (opacityDuration + rotateDuration);
                }).style("opacity", 1.0).each('end', function () {
                    stepper.onForward();
                });
                this.triangles.selectAll('.outerTriangle').filter(function (d, i) {
                    return i > 0;
                }) // all except first triangle
                .style("opacity", 0.0).transition().ease('linear').duration(opacityDuration).delay(function (d, i) {
                    return i * (opacityDuration + rotateDuration);
                }).style("opacity", 1.0).transition().selectAll('.middleTriangle').ease('linear').duration(rotateDuration).attrTween("transform", rotateFn());
            } else if (step == 4) {
                var opacityDuration, rotateDuration, moveDuration;

                (function () {
                    var rotateFn = function rotateFn() {
                        return function (d, i) {
                            var interpolater = d3.interpolate(d.rotation, d.rotationTo);
                            return function (t) {
                                return "rotate(" + interpolater(t) % 360 + ")";
                            };
                        };
                    };

                    var translateFn = function translateFn() {
                        return function (d, i) {
                            var a = "translate(" + (_this.squareOffset[d.squareIndex].left + _this.idToPoint(d.translate).x) + "," + (_this.squareOffset[d.squareIndex].top + _this.idToPoint(d.translate).y) + ")";
                            var b = "translate(" + (_this.squareOffset[d.squareIndex].left + _this.idToPoint(d.moveTo).x) + "," + (_this.squareOffset[d.squareIndex].top + _this.idToPoint(d.moveTo).y) + ")";
                            var interpolater = d3.interpolateString(a, b);
                            return function (t) {
                                return interpolater(t);
                            };
                        };
                    };

                    opacityDuration = 1000;
                    rotateDuration = 2000;
                    moveDuration = 2000;

                    _this3.squares.selectAll('.square').filter(function (d, i) {
                        return i > 1 && d.squareIndex === 1;
                    }).style("opacity", 0.0);
                    // hide square => rotate 4th/7th triangle => move 4th/5th triangle => show two squares
                    _this3.squares.selectAll('.square').filter(function (d, i) {
                        return i === 1;
                    }).transition().style("opacity", 0.0).ease('linear').duration(opacityDuration).each('end', function () {
                        _this.triangles.selectAll('.middleTriangle').filter(function (d, i) {
                            return i === 4 || i === 7;
                        }).transition().ease('linear').duration(rotateDuration).delay(function (d, i) {
                            return (1 - i) * rotateDuration;
                        }) // want to rotate the 7th triangle before the 4th
                        .attrTween("transform", rotateFn()).call(endAll, function () {
                            _this.triangles.selectAll('.outerTriangle').filter(function (d, i) {
                                return i === 4 || i === 5;
                            }).transition().ease('linear').duration(moveDuration).attrTween("transform", translateFn()).call(endAll, function () {
                                _this.squares.selectAll('.square').filter(function (d, i) {
                                    return i > 1 && d.squareIndex === 1;
                                }).transition().style("opacity", 1.0).ease('linear').duration(opacityDuration).call(endAll, function () {
                                    stepper.onForward();
                                });
                            });
                        });
                    });
                })();
            } else if (step == 6) {
                var opacityDuration = 2000;
                this.triangles.selectAll('.outerTriangle').filter(function (d, i) {
                    return i === 1 || i === 4;
                }).style("opacity", 1.0).transition().ease('linear').duration(opacityDuration).delay(0).style("opacity", 0.0);
                this.triangles.selectAll('.outerTriangle').filter(function (d, i) {
                    return i === 2 || i === 5;
                }).style("opacity", 1.0).transition().ease('linear').duration(opacityDuration).delay(opacityDuration).style("opacity", 0.0);
                this.triangles.selectAll('.outerTriangle').filter(function (d, i) {
                    return i === 3 || i === 6;
                }).style("opacity", 1.0).transition().ease('linear').duration(opacityDuration).delay(2 * opacityDuration).style("opacity", 0.0).call(endAll, function () {
                    stepper.onForward();
                });
            }
        }
    }, {
        key: "createTriangles",
        value: function createTriangles(selection) {
            var _this = this;
            var g = selection.append('svg:g').attr('class', 'outerTriangle');
            var h = g.append('svg:g').attr('class', 'middleTriangle');
            var j = h.append("polygon").attr('class', 'innerTriangle');
        }
    }, {
        key: "createSquares",
        value: function createSquares(selection) {
            selection.append('polygon').attr('class', 'square');
        }

        // http://stackoverflow.com/questions/18831949/d3js-make-new-parent-data-descend-into-child-nodes
        // The values array specifies the data for each group in the selection. Thus, if the selection has multiple groups (such as a d3.selectAll followed by a selection.selectAll),
        // then data should be specified as a function that returns an array (assuming that you want different data for each group).
        // The function will be passed the current group data (or undefined) and the index, with the group as the this context.
        // For example, you may bind a two-dimensional array to an initial selection, and then bind the contained inner arrays to each subselection.
        // The values function in this case is the identity function: it is invoked for each group of child elements, being passed the data bound to the parent element,
        // and returns this array of data.

    }, {
        key: "updateTriangles",
        value: function updateTriangles() {
            var _this = this;
            var outer = this.triangles.selectAll('.outerTriangle').attr("transform", function (d) {
                return "translate(" + (_this.squareOffset[d.squareIndex].left + _this.idToPoint(d.translate).x) + "," + (_this.squareOffset[d.squareIndex].top + _this.idToPoint(d.translate).y) + ")";
            }).style("opacity", 1.0);
            //console.log(outer.selectAll('.middleTriangle'));
            var middle = outer.selectAll('.middleTriangle').data(function (d) {
                return [d];
            }) // descend parent data into children
            .attr('transform', function (d) {
                return 'rotate(' + d.rotation + ')';
            });
            var inner = middle.selectAll('.innerTriangle').data(function (d) {
                return [d];
            }) // descend parent data into children
            .attr("points", function (d) {
                // console.log("Updated triangle: ", d.a, d.b, d.c);
                return _this.idToPoint(d.a).x + " " + _this.idToPoint(d.a).y + ", " + _this.idToPoint(d.b).x + " " + _this.idToPoint(d.b).y + ", " + _this.idToPoint(d.c).x + " " + _this.idToPoint(d.c).y;
            }).attr("transform", function (d) {
                return "translate(" + -_this.idToPoint(d.pivot).x + "," + -_this.idToPoint(d.pivot).y + ")";
            });
        }
    }, {
        key: "updateSquares",
        value: function updateSquares() {
            var _this = this;
            this.squares.selectAll('.square').attr("points", function (d) {
                // console.log("Updated triangle: ", d.a, d.b, d.c);
                return _this.idToPoint(d.a).x + " " + _this.idToPoint(d.a).y + ", " + _this.idToPoint(d.b).x + " " + _this.idToPoint(d.b).y + ", " + _this.idToPoint(d.c).x + " " + _this.idToPoint(d.c).y + ", " + _this.idToPoint(d.d).x + " " + _this.idToPoint(d.d).y;
            }).style("fill", function (d) {
                return d.color;
            }).attr("transform", function (d) {
                return "translate(" + _this.squareOffset[d.squareIndex].left + "," + _this.squareOffset[d.squareIndex].top + ")";
            });
        }
    }, {
        key: "onStep",
        value: function onStep(forward) {
            // always stop all transitions
            this.container.selectAll('.outerTriangle, .middleTriangle, .innerTriangle, .square').transition();
            return _get(Object.getPrototypeOf(Pythagoras.prototype), "onStep", this).call(this, forward);
        }
    }, {
        key: "createGradient",
        value: function createGradient() {
            var gradient = this.svg.append("defs").append("linearGradient").attr("id", "gradient").attr("x1", "30%").attr("y1", "30%").attr("x2", "100%").attr("y2", "100%").attr("spreadMethod", "pad");

            gradient.append("stop").attr("offset", "0%").attr("stop-color", this.colors[1]).attr("stop-opacity", 1);

            gradient.append("stop").attr("offset", "100%").attr("stop-color", this.colors[2]).attr("stop-opacity", 1);
        }
    }]);

    return Pythagoras;
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
//# sourceMappingURL=pythagoras-compiled.js.map

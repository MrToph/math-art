class Pythagoras extends ISteppable{
  constructor() {
    super();
    this.svg = null;
    this.margin = {top: -5, right: -5, bottom: -5, left: -5};
    this.width = 1200 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.currentStep = 0;
    this.squareSize = 450;
    this.squareOffset = [{top: 25, left: 50}, {top: 25, left: this.width - this.squareSize - 50}];
    this.r = this.squareSize * .7;

    this.colors = ["#ff3232", "#32ff32", "#3232ff"];
    this.maxStep = 7;

    this.translate = [0,0];
    this.scale = 1;
  }

  init(element){
    var realWidth = this.width + this.margin.left + this.margin.right;
    var realHeight = this.height + this.margin.top + this.margin.bottom;
    var svg = d3.select(element).append("svg")
        .attr("viewBox", "0 0 " + realWidth + " " + realHeight)
        // .attr('width', "100%") // automatically resize
        // .attr('height', "100%")
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.right + ")")

    this.svg = svg;

    var rect = svg.append("rect")
                .attr("class", "svgOuterRect")
                .attr("x", -this.margin.left)
                .attr("y", -this.margin.top)
                .attr("width", realWidth)
                .attr("height", realHeight);

    var container = svg.append("g")
                      .attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + "),scale(" + this.scale + ")");
    this.createGradient();
    this.container = container;
    this.triangles = container.append('svg:g');
    this.squares = container.append('svg:g');
    this.texts = container.append('svg:g');
    this.dragPoint = container.append('svg:g');
    this.redraw(0);
  }

  getSVG() {
    return this.svg;
  }

  toSVGCoordinates(point) {
    var p = [point[0], point[1]];
    p[0] = (p[0] - this.translate[0]) / this.scale;
    p[1] = (p[1] - this.translate[1]) / this.scale;
    return p;
  }

  idToPoint(id) {
    return jQuery.grep(this.points, e => e.id === id)[0];
  }

  // triangleData Explanation:
  // a, b, c: The inherent shape of the triangle (no position/translation data here).
  // pivot: Where the pivot will be w.r.t a,b,c (also no position data)
  // rotate: rotation in degrees. Rotates around pivot
  // translate: World coordinate where the pivot will be set to offset by + this.squareOffsets[squareOffset]
  // squareOffset: offsets translate by + this.squareOffsets[squareOffset]
  createShapes(step) {
    switch(step){
      case 0:{
        this.points = [
        {id: 100, x: 0, y: 0},
        {id: 101, x: this.r, y: 0},
        {id: 102, x: 0, y: this.squareSize - this.r},
        {id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top}];
        this.triangleData = [
        {a: 100, b:101, c:102, pivot: 100, translate: 100, squareIndex: 0, rotation: 0}
        ];
        this.squareData = [
        ];
        this.dragPointData = [{index: 999}];
        this.textData = [];
        break;
      }
      case 1:{
        this.points = [
        {id: 1, x: 0, y: 0},
        {id: 2, x: this.r, y: 0},
        {id: 3, x: this.squareSize, y: this.r},
        {id: 4, x: this.squareSize - this.r, y: this.squareSize},
        {id: 5, x: 0, y: this.squareSize - this.r},
        {id: 100, x: 0, y: 0},
        {id: 101, x: this.r, y: 0},
        {id: 102, x: 0, y: this.squareSize - this.r},
        {id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top}
        ];
        this.triangleData = [
        {a: 100, b:101, c:102, pivot: 100, translate: 1, squareIndex: 0, rotation: 0},
        {a: 100, b:101, c:102, pivot: 102, translate: 2, squareIndex: 0, rotation: 180 },   // rotate from 180 to 90
        {a: 100, b:101, c:102, pivot: 102, translate: 3, squareIndex: 0, rotation: 270},   // rotate from 270 to 180
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 0, rotation: 360}      // rotate from 0 to 270
        ];
        this.squareData = [
        {a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0]}
        ];
        this.dragPointData = [];
        this.textData = [];
        break;
      }
      case 2:{
        this.points = [
        {id: 1, x: 0, y: 0},
        {id: 2, x: this.r, y: 0},
        {id: 3, x: this.squareSize, y: this.r},
        {id: 4, x: this.squareSize - this.r, y: this.squareSize},
        {id: 5, x: 0, y: this.squareSize - this.r},
        {id: 100, x: 0, y: 0},
        {id: 101, x: this.r, y: 0},
        {id: 102, x: 0, y: this.squareSize - this.r},
        {id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top}
        ];
        this.triangleData = [
        {a: 100, b:101, c:102, pivot: 100, translate: 1, squareIndex: 0, rotation: 0},
        {a: 100, b:101, c:102, pivot: 102, translate: 2, squareIndex: 0, rotation: 90 },   // rotate from 180 to 90
        {a: 100, b:101, c:102, pivot: 102, translate: 3, squareIndex: 0, rotation: 180},   // rotate from 270 to 180
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 0, rotation: 270}      // rotate from 0 to 270
        ];
        this.squareData = [
        {a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0]}
        ];
        this.dragPointData = [{index: 999}];
        this.textData = [];
        break;
      }
      case 3:{
        this.points = [
        {id: 1, x: 0, y: 0},
        {id: 2, x: this.r, y: 0},
        {id: 3, x: this.squareSize, y: this.r},
        {id: 4, x: this.squareSize - this.r, y: this.squareSize},
        {id: 5, x: 0, y: this.squareSize - this.r},
        {id: 100, x: 0, y: 0},
        {id: 101, x: this.r, y: 0},
        {id: 102, x: 0, y: this.squareSize - this.r},
        {id: 998, x: (this.squareOffset[0].left + this.squareSize + this.squareOffset[1].left)/2 - 22, y: this.squareOffset[0].top + this.squareSize/2 + 43},
        {id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top}
        ];
        this.triangleData = [
        {a: 100, b:101, c:102, pivot: 100, translate: 1, squareIndex: 0, rotation: 0},
        {a: 100, b:101, c:102, pivot: 102, translate: 2, squareIndex: 0, rotation: 90 },
        {a: 100, b:101, c:102, pivot: 102, translate: 3, squareIndex: 0, rotation: 180},
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 0, rotation: 270},
        {a: 100, b:101, c:102, pivot: 100, translate: 1, squareIndex: 1, rotation: 0},
        {a: 100, b:101, c:102, pivot: 102, translate: 2, squareIndex: 1, rotation: 90 },
        {a: 100, b:101, c:102, pivot: 102, translate: 3, squareIndex: 1, rotation: 180},
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 1, rotation: 270},
        ];
        this.squareData = [
        {a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0]},
        {a: 2, b: 3, c: 4, d: 5, squareIndex: 1, color: "url(#gradient)"}
        ];
        this.dragPointData = [{index: 999}];
        this.textData = [{caption: "=", fontSize: "72pt", translate: 998}];
        break;
      }
      case 4:{
        this.points = [
        {id: 1, x: 0, y: 0},
        {id: 2, x: this.r, y: 0},
        {id: 3, x: this.squareSize, y: this.r},
        {id: 4, x: this.squareSize - this.r, y: this.squareSize},
        {id: 5, x: 0, y: this.squareSize - this.r},
        {id: 100, x: 0, y: 0},
        {id: 101, x: this.r, y: 0},
        {id: 102, x: 0, y: this.squareSize - this.r},
        {id: 200, x: this.squareSize - this.r, y: 0},
        {id: 201, x: this.squareSize, y: 0},
        {id: 202, x: this.squareSize - this.r, y: this.r},
        {id: 203, x: this.squareSize, y: this.r},
        {id: 204, x: 0, y: this.r},
        {id: 205, x: 0, y: this.squareSize},
        {id: 206, x: this.squareSize - this.r, y: this.squareSize},
        {id: 998, x: (this.squareOffset[0].left + this.squareSize + this.squareOffset[1].left)/2 - 22, y: this.squareOffset[0].top + this.squareSize/2 + 43},
        {id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top}
        ];
        this.triangleData = [
        {a: 100, b:101, c:102, pivot: 101, translate: 2, squareIndex: 0, rotation: 0},
        {a: 100, b:101, c:102, pivot: 102, translate: 2, squareIndex: 0, rotation: 90 },
        {a: 100, b:101, c:102, pivot: 102, translate: 3, squareIndex: 0, rotation: 180},
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 0, rotation: 270},
        {a: 100, b:101, c:102, pivot: 101, translate: 2, squareIndex: 1, rotation: 0, rotationTo: -90, moveTo: 1},
        {a: 100, b:101, c:102, pivot: 102, translate: 2, squareIndex: 1, rotation: 90, moveTo: 1},
        {a: 100, b:101, c:102, pivot: 102, translate: 3, squareIndex: 1, rotation: 180},
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 1, rotation: 270, rotationTo: 360},
        ];
        this.squareData = [
        {a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0]},
        {a: 2, b: 3, c: 4, d: 5, squareIndex: 1, color: "url(#gradient)"},
        {a: 200, b: 201, c: 203, d: 202, squareIndex: 1, color: this.colors[1]},
        {a: 204, b: 202, c: 206, d: 205, squareIndex: 1, color: this.colors[2]},
        ];
        this.dragPointData = [];
        this.textData = [{caption: "=", fontSize: "72pt", translate: 998}];
        break;
      }
      case 5:{
        this.points = [
        {id: 1, x: 0, y: 0},
        {id: 2, x: this.r, y: 0},
        {id: 3, x: this.squareSize, y: this.r},
        {id: 4, x: this.squareSize - this.r, y: this.squareSize},
        {id: 5, x: 0, y: this.squareSize - this.r},
        {id: 100, x: 0, y: 0},
        {id: 101, x: this.r, y: 0},
        {id: 102, x: 0, y: this.squareSize - this.r},
        {id: 200, x: this.squareSize - this.r, y: 0},
        {id: 201, x: this.squareSize, y: 0},
        {id: 202, x: this.squareSize - this.r, y: this.r},
        {id: 203, x: this.squareSize, y: this.r},
        {id: 204, x: 0, y: this.r},
        {id: 205, x: 0, y: this.squareSize},
        {id: 206, x: this.squareSize - this.r, y: this.squareSize},
        {id: 998, x: (this.squareOffset[0].left + this.squareSize + this.squareOffset[1].left)/2 - 22, y: this.squareOffset[0].top + this.squareSize/2 + 43},
        {id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top}
        ];
        this.triangleData = [
        {a: 100, b:101, c:102, pivot: 101, translate: 2, squareIndex: 0, rotation: 0},
        {a: 100, b:101, c:102, pivot: 102, translate: 2, squareIndex: 0, rotation: 90 },
        {a: 100, b:101, c:102, pivot: 102, translate: 3, squareIndex: 0, rotation: 180},
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 0, rotation: 270},
        {a: 100, b:101, c:102, pivot: 101, translate: 1, squareIndex: 1, rotation: 270},
        {a: 100, b:101, c:102, pivot: 102, translate: 1, squareIndex: 1, rotation: 90},
        {a: 100, b:101, c:102, pivot: 102, translate: 3, squareIndex: 1, rotation: 180},
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 1, rotation: 0},
        ];
        this.squareData = [
        {a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0]},
        {a: 200, b: 201, c: 203, d: 202, squareIndex: 1, color: this.colors[1]},
        {a: 204, b: 202, c: 206, d: 205, squareIndex: 1, color: this.colors[2]},
        ];
        this.dragPointData = [{index: 999}];
        this.textData = [{caption: "=", fontSize: "72pt", translate: 998}];
        break;
      }
      case 6:{
        this.points = [
        {id: 1, x: 0, y: 0},
        {id: 2, x: this.r, y: 0},
        {id: 3, x: this.squareSize, y: this.r},
        {id: 4, x: this.squareSize - this.r, y: this.squareSize},
        {id: 5, x: 0, y: this.squareSize - this.r},
        {id: 100, x: 0, y: 0},
        {id: 101, x: this.r, y: 0},
        {id: 102, x: 0, y: this.squareSize - this.r},
        {id: 200, x: this.squareSize - this.r, y: 0},
        {id: 201, x: this.squareSize, y: 0},
        {id: 202, x: this.squareSize - this.r, y: this.r},
        {id: 203, x: this.squareSize, y: this.r},
        {id: 204, x: 0, y: this.r},
        {id: 205, x: 0, y: this.squareSize},
        {id: 206, x: this.squareSize - this.r, y: this.squareSize},
        {id: 998, x: (this.squareOffset[0].left + this.squareSize + this.squareOffset[1].left)/2 - 22, y: this.squareOffset[0].top + this.squareSize/2 + 43},
        {id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top}
        ];
        this.triangleData = [
        {a: 100, b:101, c:102, pivot: 101, translate: 2, squareIndex: 0, rotation: 0},
        {a: 100, b:101, c:102, pivot: 102, translate: 2, squareIndex: 0, rotation: 90 },
        {a: 100, b:101, c:102, pivot: 102, translate: 3, squareIndex: 0, rotation: 180},
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 0, rotation: 270},
        {a: 100, b:101, c:102, pivot: 101, translate: 1, squareIndex: 1, rotation: 270},
        {a: 100, b:101, c:102, pivot: 102, translate: 1, squareIndex: 1, rotation: 90},
        {a: 100, b:101, c:102, pivot: 102, translate: 3, squareIndex: 1, rotation: 180},
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 1, rotation: 0},
        ];
        this.squareData = [
        {a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0]},
        {a: 200, b: 201, c: 203, d: 202, squareIndex: 1, color: this.colors[1]},
        {a: 204, b: 202, c: 206, d: 205, squareIndex: 1, color: this.colors[2]},
        ];
        this.dragPointData = [];
        this.textData = [{caption: "=", fontSize: "72pt", translate: 998}];
        break;
      }
      case 7:{
        this.points = [
        {id: 1, x: 0, y: 0},
        {id: 2, x: this.r, y: 0},
        {id: 3, x: this.squareSize, y: this.r},
        {id: 4, x: this.squareSize - this.r, y: this.squareSize},
        {id: 5, x: 0, y: this.squareSize - this.r},
        {id: 100, x: 0, y: 0},
        {id: 101, x: this.r, y: 0},
        {id: 102, x: 0, y: this.squareSize - this.r},
        {id: 200, x: this.squareSize - this.r, y: 0},
        {id: 201, x: this.squareSize, y: 0},
        {id: 202, x: this.squareSize - this.r, y: this.r},
        {id: 203, x: this.squareSize, y: this.r},
        {id: 204, x: 0, y: this.r},
        {id: 205, x: 0, y: this.squareSize},
        {id: 206, x: this.squareSize - this.r, y: this.squareSize},
        {id: 998, x: (this.squareOffset[0].left + this.squareSize + this.squareOffset[1].left)/2 - 22, y: this.squareOffset[0].top + this.squareSize/2 + 43},
        {id: 999, x: this.squareOffset[0].left + this.r, y: this.squareOffset[0].top}
        ];
        this.triangleData = [
        {a: 100, b:101, c:102, pivot: 101, translate: 2, squareIndex: 0, rotation: 0},
        {a: 100, b:101, c:102, pivot: 102, translate: 4, squareIndex: 1, rotation: 0},
        ];
        this.squareData = [
        {a: 2, b: 3, c: 4, d: 5, squareIndex: 0, color: this.colors[0]},
        {a: 200, b: 201, c: 203, d: 202, squareIndex: 1, color: this.colors[1]},
        {a: 204, b: 202, c: 206, d: 205, squareIndex: 1, color: this.colors[2]},
        ];
        this.dragPointData = [{index: 999}];
        this.textData = [{caption: "=", fontSize: "72pt", translate: 998}];
        break;
      }
    }
  }

  redraw(step = this.currentStep){
    this.currentStep = step;

    var _this = this;
    this.createShapes(step);

    ////////////////////
    ///// TRIANGLES ////
    ////////////////////
    this.triangles.selectAll('.outerTriangle').remove();  // kill it to as otherwise when its transition gets canceled it stops mid rotation
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
    var drag = d3.behavior.drag()
      .origin(d => _this.idToPoint(d.index))
      .on("drag", (d,i) => {
          var maxR = _this.squareSize;
          _this.r = (d3.event.x - _this.squareOffset[0].left).clamp(0, maxR);
          _this.redraw();
    });

    var dragPoint = this.dragPoint.selectAll("circle").data(this.dragPointData);
    // update existing drag point
    dragPoint.attr("cx", d => _this.idToPoint(d.index).x )
        .attr("cy", d => _this.idToPoint(d.index).y);

    // handle new dragPoint
    dragPoint.enter().append("circle")
        .attr('class', 'dragpoint')
        .attr("r", 10)
        .attr("cx", d => _this.idToPoint(d.index).x )
        .attr("cy", d => _this.idToPoint(d.index).y )
        .call(drag);

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
    this.texts.selectAll('text')
      .attr('transform', d => "translate(" + _this.idToPoint(d.translate).x + "," + _this.idToPoint(d.translate).y + ")")
      .text( d => d.caption)
      .attr("font-size", d => d.fontSize);

    ////////////////////
    ///// ANIMATIONS ///
    ////////////////////
    if(step == 1){
      var opacityDuration = 1000, rotateDuration = 2000;
      function rotateFn() {
          // We only use 'd', but list d,i,a as params just to show can have them as params.
          // Code only really uses d and t.
          return (d, i) => {
              var interpolater = d3.interpolate(d.rotation, d.rotation - 90); 
              return (t) => { return "rotate(" + (interpolater(t) % 360) + ")" }
          }
      }
      this.squares.selectAll('.square')
          .style("opacity", 0.0).transition().ease('linear')
          .duration(opacityDuration).delay((d,i) => 3*(opacityDuration + rotateDuration)).style("opacity", 1.0)
          .each('end', () => {
            stepper.onForward();
          });
      this.triangles.selectAll('.outerTriangle').filter((d, i) => i > 0 )  // all except first triangle
          .style("opacity", 0.0).transition().ease('linear')
          .duration(opacityDuration).delay((d,i) => i * (opacityDuration + rotateDuration)).style("opacity", 1.0)
          .transition().selectAll('.middleTriangle').ease('linear').duration(rotateDuration).attrTween("transform", rotateFn())
    }
    else if(step == 4){
      var opacityDuration = 1000, rotateDuration = 2000, moveDuration = 2000;
      function rotateFn() {
          return (d, i) => {
              var interpolater = d3.interpolate(d.rotation, d.rotationTo); 
              return (t) => "rotate(" + (interpolater(t) % 360) + ")"
          }
      }

      function translateFn() {
          return function(d, i) {
              var a = "translate(" + (_this.squareOffset[d.squareIndex].left + _this.idToPoint(d.translate).x) + "," + (_this.squareOffset[d.squareIndex].top + _this.idToPoint(d.translate).y) + ")";
              var b = "translate(" + (_this.squareOffset[d.squareIndex].left + _this.idToPoint(d.moveTo).x) + "," + (_this.squareOffset[d.squareIndex].top + _this.idToPoint(d.moveTo).y) + ")";
              var interpolater = d3.interpolateString(a, b); 
              return (t) => interpolater(t);
          }
      }
      this.squares.selectAll('.square').filter((d, i) => i > 1 && d.squareIndex === 1)
          .style("opacity", 0.0);
      // hide square => rotate 4th/7th triangle => move 4th/5th triangle => show two squares
      this.squares.selectAll('.square').filter((d, i) => i === 1)
          .transition().style("opacity", 0.0).ease('linear').duration(opacityDuration)
          .each('end', () => {
              _this.triangles.selectAll('.middleTriangle').filter((d, i) => { return i === 4 || i === 7 })
                .transition().ease('linear').duration(rotateDuration).delay((d,i) => {return (1-i) * rotateDuration})  // want to rotate the 7th triangle before the 4th
                .attrTween("transform", rotateFn())
                .call(endAll, () => {
                    _this.triangles.selectAll('.outerTriangle').filter((d, i) => { return i === 4 || i === 5 })
                        .transition().ease('linear').duration(moveDuration)
                        .attrTween("transform", translateFn())
                        .call(endAll, () => {
                            _this.squares.selectAll('.square').filter((d, i) => { return i > 1 && d.squareIndex === 1})
                              .transition().style("opacity", 1.0).ease('linear').duration(opacityDuration)
                              .call(endAll, () => {
                                 stepper.onForward();
                              });
                        });
                });
          });
    }
    else if(step == 6){
      var opacityDuration = 2000;
      this.triangles.selectAll('.outerTriangle').filter((d, i) => i === 1 || i === 4)
          .style("opacity", 1.0).transition().ease('linear')
          .duration(opacityDuration).delay(0).style("opacity", 0.0);
      this.triangles.selectAll('.outerTriangle').filter((d, i) => i === 2 || i === 5 )
          .style("opacity", 1.0).transition().ease('linear')
          .duration(opacityDuration).delay(opacityDuration).style("opacity", 0.0);
      this.triangles.selectAll('.outerTriangle').filter((d, i) => i === 3 || i === 6 )
          .style("opacity", 1.0).transition().ease('linear')
          .duration(opacityDuration).delay(2*opacityDuration).style("opacity", 0.0)
          .call(endAll, () => {
             stepper.onForward();
          });
    }
  }

  createTriangles(selection) {
      var _this = this;
      var g = selection.append('svg:g').attr('class', 'outerTriangle');
      var h = g.append('svg:g').attr('class', 'middleTriangle');
      var j = h.append("polygon").attr('class', 'innerTriangle');
  }

  createSquares(selection) {
      selection.append('polygon').attr('class', 'square');
  }

  // http://stackoverflow.com/questions/18831949/d3js-make-new-parent-data-descend-into-child-nodes
  // The values array specifies the data for each group in the selection. Thus, if the selection has multiple groups (such as a d3.selectAll followed by a selection.selectAll), 
  // then data should be specified as a function that returns an array (assuming that you want different data for each group). 
  // The function will be passed the current group data (or undefined) and the index, with the group as the this context. 
  // For example, you may bind a two-dimensional array to an initial selection, and then bind the contained inner arrays to each subselection. 
  // The values function in this case is the identity function: it is invoked for each group of child elements, being passed the data bound to the parent element, 
  // and returns this array of data.
  updateTriangles() {
      var _this = this;
      var outer = this.triangles.selectAll('.outerTriangle').attr("transform", (d) => {
          return "translate(" + (_this.squareOffset[d.squareIndex].left + _this.idToPoint(d.translate).x) + "," + (_this.squareOffset[d.squareIndex].top + _this.idToPoint(d.translate).y) + ")";
        })
        .style("opacity", 1.0);
      //console.log(outer.selectAll('.middleTriangle'));
      var middle = outer.selectAll('.middleTriangle').data((d) => [d]) // descend parent data into children
      .attr('transform', (d) => 'rotate(' + d.rotation + ')'
      );
      var inner = middle.selectAll('.innerTriangle').data((d) => [d]) // descend parent data into children
        .attr("points", (d) => { 
          // console.log("Updated triangle: ", d.a, d.b, d.c);
          return _this.idToPoint(d.a).x + " " + _this.idToPoint(d.a).y + ", "
                + _this.idToPoint(d.b).x + " " + _this.idToPoint(d.b).y + ", "
                + _this.idToPoint(d.c).x + " " + _this.idToPoint(d.c).y;
        })
        .attr("transform", (d) => "translate(" + -_this.idToPoint(d.pivot).x + "," +  -_this.idToPoint(d.pivot).y + ")"
        );
  }

  updateSquares() {
      var _this = this;
      this.squares.selectAll('.square')
        .attr("points", (d) => { 
          // console.log("Updated triangle: ", d.a, d.b, d.c);
          return _this.idToPoint(d.a).x + " " + _this.idToPoint(d.a).y + ", "
                + _this.idToPoint(d.b).x + " " + _this.idToPoint(d.b).y + ", "
                + _this.idToPoint(d.c).x + " " + _this.idToPoint(d.c).y + ", "
                + _this.idToPoint(d.d).x + " " + _this.idToPoint(d.d).y;
        })
        .style("fill", (d) => d.color)
        .attr("transform", (d) => "translate(" + (_this.squareOffset[d.squareIndex].left) + "," + (_this.squareOffset[d.squareIndex].top) + ")"
        );
  }

  onStep(forward){
    // always stop all transitions
    this.container.selectAll('.outerTriangle, .middleTriangle, .innerTriangle, .square').transition();
    return super.onStep(forward);
  }

  createGradient(){
    var gradient = this.svg.append("defs")
      .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "30%")
        .attr("y1", "30%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", this.colors[1])
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", this.colors[2])
        .attr("stop-opacity", 1);
  }
}

function endAll (transition, callback) {
    var n;

    if (transition.empty()) {
        callback();
    }
    else {
        n = transition.size();
        transition.each("end", () => {
            n--;
            if (n === 0) {
                callback();
            }
        });
    }
}
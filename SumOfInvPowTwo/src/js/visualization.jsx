class Visualization extends ISteppable{
  constructor(element) {
    super();
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 500;
    this.height = 500;

    this.currentStep = 0;
    this.maxStep = 998;

    let realWidth = this.width + this.margin.left + this.margin.right;
    let realHeight = this.height + this.margin.top + this.margin.bottom;
    let svg = d3.select(element).append("svg")
        .attr("viewBox", "0 0 " + realWidth + " " + realHeight)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.right + ")")

    this.svg = svg;

    let rect = svg.append("rect")
                .attr("class", "svgOuterRect")
                .attr("x", -this.margin.left)
                .attr("y", -this.margin.top)
                .attr("width", realWidth)
                .attr("height", realHeight);

    this.translate = [0 * realWidth, 0];
    this.scale = 1;
    let container = svg.append("g")
                      .attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + "),scale(" + this.scale + ")");
    this.container = container;
    this.squares = container.append('svg:g');
    this.texts = container.append('svg:g');

    // Constants
    this.colors = ["#ff3232", "#32CD32", "#3232ff", "#000000", "#ffa500", "#8A2BE2"];
    this.sqSize = realHeight;

    this.redraw(0);
  }

createData(step) {
    this.textData = [{id: 1, x: 0.5 * this.sqSize, y: 0.75* this.sqSize, fontSize: "48pt"},
                     {id: 2, x: 0.25 * this.sqSize, y: 0.25 * this.sqSize, fontSize: "24pt"}];
    this.sqData = [];
    let stepMod = step % 4;

    this.sqData.push({x: 0, y: 0, width: this.sqSize, height: this.sqSize});
    if(stepMod >= 1)
            this.sqData.push({x: 0, y: 0.5 * this.sqSize, width: this.sqSize, height: 0.5 * this.sqSize});
    if(stepMod >= 2)
        this.sqData.push({x: 0, y: 0, width: 0.5 * this.sqSize, height: 0.5 * this.sqSize});

}

redraw(step = this.currentStep, forward){
    this.currentStep = step;

    this.createData(step);
    this.squares.selectAll('.square').remove();
    this.createSquares();
    this.createText(step);
    this.container.attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + ")scale(" + 1 + ")");
    if(step % 4 === 3){
        this.container.transition()
          .duration(2000)
          .attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + ")scale(" + 2 + ")translate(" + -0.5*this.sqSize + "," + 0 + ")")
          .each('end', () => stepper.onForward());
    }
}

createText(step){
    let texts = this.texts.selectAll(".txt").data(this.textData).enter().append('text').attr('class', 'txt');
    texts = this.texts.selectAll(".txt")
                        .text( d => {
                            let stepMod = step % 4;
                            if(d.id > stepMod) return "";
                            let inv = 0;
                            if(d.id == 1){
                                inv = Math.ceil( ((stepMod === 3) ? step - 1 : step) / 2);
                            }
                            else{   // d.id == 2
                                inv = Math.ceil( (step + 1) / 2);
                            }
                            if(inv < 31){
                                inv = "1/" + Math.pow(2,inv);
                            }
                            else{
                                inv = "2^-" + inv;
                            }
                            return inv;
                        })
                        .attr('text-anchor', "middle")  // horizontal alignment
                        .attr('dominant-baseline', "middle")  // vertical alignment
                        .attr('transform', d => "translate(" + (d.x) + "," + (1.1 * d.y) + ")")
                        .attr("font-size", d => d.fontSize);
}

  createSquares(){
    let squares = this.squares.selectAll(".square").data(this.sqData).enter().append('rect').attr('class', 'square');

    squares = this.squares.selectAll(".square")
                .attr('width', d => d.width)
                .attr('height', d => d.height)
                .attr('x', d => d.x )
                .attr('y', d => d.y);
  }

  onStep(forward){
    // always stop all transitions
    this.container.interrupt().transition();
    return super.onStep(forward);   // calls redraw
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
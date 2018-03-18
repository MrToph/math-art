class Visualization {
  constructor(element) {
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 1400;
    this.height = 700;

    this.currentStep = 0;
    this.maxStep = 0;

    this.translate = [0,0];
    this.scale = 1;

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

    let container = svg.append("g")
                      .attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + "),scale(" + this.scale + ")");
    this.container = container;
    this.circles = this.container.append('g')
                    .attr("transform", "translate(" + (realWidth*0.5) + "," + 0 + ")");
    this.links = [];

    // Constants
    this.colors = ["#ff3232", "#32CD32", "#3232ff", "#ffa500", "#8A2BE2"];
    this.circRadius = 50;
    this.numLayers = 7;

    this.redraw(0);
  }

createData() {
    let arr = [];
    for(let i = 0; i < this.numLayers; i++){
        let xOffset = i * this.circRadius;
        for(let j = 0; j <= i; j++){
            let xPos = j * (2 * this.circRadius) - xOffset;
            let yPos = (i*2 + 1) * this.circRadius;
            let layer = i;
            let obj = {id: [i,j], radius: this.circRadius*0.9, x: xPos, y: yPos, 
                class: (i === this.numLayers - 1) ? "lowerCircle" : "upperCircle"};
            arr.push(obj);
        }
    }
    this.circleData = arr;
}

redraw(step = this.currentStep){
    this.currentStep = step;
    // create the circles
    this.createData();
    this.createCircles();
    // create the links
    let linksContainer = this.circles.append('g');
    for(let i = 0; i < 2; i++){
        this.links[i] = linksContainer.append('line')
            .attr("class", "link")
            .classed("svgHidden", true)
            .attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 0);
    }
    // update the circles
    this.updateCircles();

}

  createCircles(){
    let circles = this.circles.selectAll(".circle").data(this.circleData);
    circles.enter().append('circle').attr('class', 'circle');
  }

  updateCircles(){
    this.circles.selectAll(".circle")
                .attr('id', d => d.id[0] + "," + d.id[1])
                .attr('r', d => d.radius)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('class', d => 'circle ' + d.class);
    let _this = this;
    this.circles.selectAll(".upperCircle")
                .on("mouseover", function(d){
                    // this.style.cursor='pointer';
                    _this.pointLinks(d3.select(this));
                })
                .on("mouseout", function(d){
                    _this.hideLinks();
                });
  }

  hideLinks(){
    this.circles.selectAll('.lowerCircle').classed("lowerCircleSelected", false);
    for(let i = 0; i < 2; i++){
        this.links[i].classed("svgHidden", true);
    }
  }

  pointLinks(circ){
    for(let i = 0; i < 2; i++){
        this.links[i].classed("svgHidden", false)
            .attr("x1", circ.attr("cx"))
            .attr("y1", circ.attr("cy"));
    }
    let [r,c] = circ.attr("id").split(',');
    r = parseInt(r);
    c = parseInt(c);
    for(let i = 0; i < 2; i++){
        let c2 = (i === 0) ? c : this.numLayers - 1 - r + c;
        let circTo = this.circles.selectAll('.lowerCircle').filter((d,index) => index === c2);
        this.links[i]
            .attr("x2", circTo.attr("cx"))
            .attr("y2", circTo.attr("cy"));
        circTo.classed("lowerCircleSelected", true);
    }
  }
}
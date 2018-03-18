import ISteppable from './ISteppable'
import Vector2 from './Vector2'
require('../css/app.css')

export default class Visualization extends ISteppable {
  constructor (element) {
    super()
    this.svg = null
    this.margin = {top: -0, right: -0, bottom: -0, left: -0}
    this.width = 1000
    this.height = 1000

    this.currentStep = 0
    this.maxStep = 1

    let realWidth = this.width + this.margin.left + this.margin.right
    let realHeight = this.height + this.margin.top + this.margin.bottom

    let svg = d3.select(element).append('svg')
      .attr('viewBox', '0 0 ' + realWidth + ' ' + realHeight)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.right + ')')

    this.svg = svg

    // Constants
    this.numDigits = 4
    this.eleSize = 200
    this.translate = [0, 0]
    this.scale = 1

    svg.append('rect')
      .attr('class', 'svgOuterRect')
      .attr('x', -this.margin.left)
      .attr('y', -this.margin.top)
      .attr('width', realWidth)
      .attr('height', realHeight)
    let container = svg.append('g').attr('class', 'container')
      .attr('transform', `translate(${this.translate[0]},${this.translate[1]}), scale(${this.scale})`)
    this.container = container
    this.elements = this.container.append('g')
    this.redraw(0)
  }

  createData (step, forward = true) {
    console.log(step)
    let elementData = []
    let duplicateForHexagon = obj => {
      for (var i = 5; i >= 1; i--) {
        elementData.push({...obj, id: [obj.id[0], i], points: obj.points.map(x => x.clone()), rotate: i * 60})
      }
    }
    let eleSize = this.eleSize
    let borderPadding = 1.5 * eleSize
    let xOffset = 2.5 * eleSize
    for (let i = 0; i < 4; i++) {
      let r = Math.floor(i / 2)
      let c = i % 2
      let top = new Vector2(0, 0)
      let botLeft = top.clone().add(Vector2.fromAngle(240 / 180 * Math.PI).scale(eleSize))
      let botRight = top.clone().add(Vector2.fromAngle(300 / 180 * Math.PI).scale(eleSize))
      let points = [top, botLeft, botRight]
      let curXOffset = xOffset * c + borderPadding
      let yOffset = xOffset * r + borderPadding
      let obj = {id: [i, 0], type: 0, points, offset: [curXOffset, yOffset], rotate: 0}
      elementData.push(obj)
      if (step === 1) duplicateForHexagon(obj)
      switch (i) {
        case 0: {
          top = top.clone()
          botLeft = top.clone().add(Vector2.fromAngle(240 / 180 * Math.PI).scale(eleSize / Math.sqrt(2)))
          botRight = top.clone().add(Vector2.fromAngle(300 / 180 * Math.PI).scale(eleSize / Math.sqrt(2)))
          points = [top, botLeft, botRight]
          break
        }
        case 1: {
          top = top.clone()
          botLeft = top.clone().add(Vector2.fromAngle(240 / 180 * Math.PI).scale(eleSize / 2))
          botRight = top.clone().add(Vector2.fromAngle(300 / 180 * Math.PI).scale(eleSize))
          points = [top, botLeft, botRight]
          break
        }
        case 2: {
          top = top.clone()
          let left = top.clone().add(Vector2.fromAngle(240 / 180 * Math.PI).scale(eleSize / 2))
          let right = top.clone().add(Vector2.fromAngle(300 / 180 * Math.PI).scale(eleSize / 2))
          let bot = top.clone().add(Vector2.fromAngle(270 / 180 * Math.PI).scale(eleSize * Math.sqrt(3) / 2))
          points = [top, left, bot, right]
          break
        }
        case 3: {
          top = top.clone()
          points = [top]
          let radius = Math.sqrt(3 * Math.sqrt(3) / (4 * Math.PI))
          for (let i = 0, sample = 10; i <= sample; i++) {
            points.push(top.clone().add(Vector2.fromAngle((240 + i / sample * 60) / 180 * Math.PI).scale(eleSize * radius)))
          }
          break
        }
      }
      obj = {id: [i, 0], type: 1, points, offset: [curXOffset, yOffset], rotate: 0}
      elementData.push(obj)
      if (step === 1) duplicateForHexagon(obj)
    }
    this.elementData = elementData
  }

  redraw (step = this.currentStep , forward) {
    this.currentStep = step
    this.createData(step, forward)
    this.elements.selectAll('.cont').remove()
    this.createElements()
    this.createAnimations()
  }

  createElements () {
    console.log(this.elementData)
    let containers = this.elements.selectAll('.cont').data(this.elementData).enter().append('g').attr('class', 'cont')
      .attr('transform', d => `translate(${d.offset[0]}, ${d.offset[1]})`)
    let triangles = containers.selectAll('.element').data(d => [d]).enter().append('polygon').attr('class', 'element')
      .attr('points', d => d.points.map(x => x.flipY().toArray().join(',')).join(' '))
      .attr('transform', d => `rotate(0)`)
      .classed('type0', d => d.type === 0)
      .classed('type1', d => d.type === 1)
  }

  createAnimations () {
    let duration = 1000
    let triangles = this.elements.selectAll('.element')
    triangles.transition().ease('linear').duration((d, i) => d.rotate / 60 * duration)
      .attrTween('transform', d => d3.interpolateString(
        `rotate(0)`,
        `rotate(${d.rotate})`
      ))
  }

  onStep (forward) {
    this.elements.selectAll('.element').interrupt().transition()
    return super.onStep(forward) // calls redraw
  }
}

function endAll (transition, callback) {
  var n
  if (transition.empty()) {
    callback()
  } else {
    n = transition.size()
    transition.each('end', () => {
      n--
      if (n === 0) {
        callback()
      }
    })
  }
}

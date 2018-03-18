import ISteppable from './ISteppable'
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
    this.eleSize = [75, 75]
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
    let getRandomInt = (min, max) => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    let elementData = []
    let col1X = 50
    let col2X = 200
    let yOffset = 50
    let [eleSizeX, eleSizeY] = this.eleSize
    let numDigits = this.numDigits
    let diagonalDupliactes = [] // these get animated and need to come after every element in the svg hierarchy
    elementData.push({x: col1X, y: yOffset, text: 'n', type: 0})
    elementData.push({x: col2X, y: yOffset, text: 'f(n)', type: 0})
    for (let r = 0; r < numDigits; r++) {
      let y = yOffset + (r + 1) * eleSizeY
      // first column
      elementData.push({x: col1X, y: y, text: r.toString(), type: 0})
      // second column containing digits
      for (let c = 0; c <= numDigits; c++) {
        let x = col2X + c * eleSizeX
        let type = c === r + 1 ? 2 : 1
        let digit = getRandomInt(0, 9)
        let text = c === 0 ? '.' : digit.toString()
        elementData.push({x, y, text, type})
        if (c === r + 1) {
          let negatedDigit = getRandomInt(1, 7) // exclude 0 and 9, and text
          if (negatedDigit === digit) negatedDigit++
          let toY = yOffset + (numDigits + 1) * eleSizeY
          diagonalDupliactes.push({x, y, text, type: 2, diagonalDuplicate: true, negatedText: negatedDigit.toString(), toY})
        }
      }
    }
    this.elementData = elementData.concat(diagonalDupliactes)
  }

  redraw (step = this.currentStep , forward) {
    if (step > 0) return
    this.currentStep = step
    this.createData(step, forward)
    this.elements.selectAll('.txt').remove()
    this.createElements()
    this.createAnimations()
  }

  createElements () {
    this.elements.selectAll('.txt').data(this.elementData).enter().append('text').attr('class', 'txt')
      .text(d => d.text)
      .attr('text-anchor', 'middle') // horizontal alignment
      .attr('dominant-baseline', 'middle') // vertical alignment
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .classed('type0', d => d.type === 0)
      .classed('type1', d => d.type === 1)
      .classed('type2', d => d.type === 2)
      .classed('diagonalDuplicate', d => d.diagonalDuplicate)
  }

  createAnimations () {
    let duration = 1000
    let delayFunction = (d, i) => {
      let numDigits = this.numDigits
      // index i needs to wait till previous one is finished. Previous one is finished if its previous one is finished, etc => sum of previous ones
      // we want travel time for i to be (10-i)/10, i.e., it being proportional to the way the will travel
      // sum up all previous travel times
      let delay = (numDigits * i - (i - 1) * i / 2) / numDigits
      return delay * duration
    }
    let diagonalElements = this.elements.selectAll('.txt.diagonalDuplicate')
    diagonalElements.transition().delay(delayFunction).duration((d, i) => (1 - i / this.numDigits) * duration)
      .attr('transform', d => `translate(${d.x},${d.toY})`)
      .call(endAll, () => {
        diagonalElements.transition().delay((d, i) => ++i * 500)
          .text(d => d.negatedText)
          .each('start', function () {
            d3.select(this).classed('type2', false).classed('type3', true)
          })
          .call(endAll, () => window.stepper.onForward())
      })
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

export default class Stepper {
  constructor () {
    this.currentLayer = 1;
    this.callbacks = [];
    window.addEventListener('keydown', this.onKeyDown.bind(this), false); // need bind otherwise this = window
  }

  onForward (layer = this.currentLayer) {
    this.currentLayer = layer;
    this.doStep(true);
  }

  onBackward (layer = this.currentLayer) {
    this.currentLayer = layer;
    this.doStep(false);
  }

  doStep (forward) {
    var buttonActivatorObj = {canBackward: false, canForward: false};
    for (var i = 0; i < this.callbacks[this.currentLayer].length; i++) {
      buttonActivatorObj = this.callbacks[this.currentLayer][i](forward);
    }
    this.disableButtons(this.currentLayer, buttonActivatorObj);
  }

  disableButtons (layer, buttonActivatorObj) {
    document.getElementById('leftBtn' + layer).disabled = !buttonActivatorObj.canBackward;
    document.getElementById('rightBtn' + layer).disabled = !buttonActivatorObj.canForward;
  }

  registerCallback (layer, callback) {
    if (typeof this.callbacks[layer] === 'undefined') {
      // the variable is undefined
      this.callbacks[layer] = [];
    }
    this.callbacks[layer].push(callback);
    this.disableButtons(layer, {canBackward: false, canForward: true});
  }

  onKeyDown (e) {
    switch (e.keyCode) {
      case 65: // a
      case 37: // left arrow
        this.onBackward(1);
        break;
      case 68: // d
      case 39: // right arrow
        this.onForward(1);
        break;
    }
  }
};

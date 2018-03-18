"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stepper = function () {
  function Stepper() {
    _classCallCheck(this, Stepper);

    this.currentLayer = 1;
    this.callbacks = [];
    window.addEventListener("keydown", this.onKeyDown.bind(this), false); // need bind otherwise this = window
  }

  _createClass(Stepper, [{
    key: "onForward",
    value: function onForward() {
      var layer = arguments.length <= 0 || arguments[0] === undefined ? this.currentLayer : arguments[0];

      this.currentLayer = layer;
      this.doStep(true);
    }
  }, {
    key: "onBackward",
    value: function onBackward() {
      var layer = arguments.length <= 0 || arguments[0] === undefined ? this.currentLayer : arguments[0];

      this.currentLayer = layer;
      this.doStep(false);
    }
  }, {
    key: "doStep",
    value: function doStep(forward) {
      var buttonActivatorObj = { canBackward: false, canForward: false };
      for (var i = 0; i < this.callbacks[this.currentLayer].length; i++) {
        buttonActivatorObj = this.callbacks[this.currentLayer][i](forward);
      }
      this.disableButtons(this.currentLayer, buttonActivatorObj);
    }
  }, {
    key: "disableButtons",
    value: function disableButtons(layer, buttonActivatorObj) {
      document.getElementById("leftBtn" + layer).disabled = !buttonActivatorObj.canBackward;
      document.getElementById("rightBtn" + layer).disabled = !buttonActivatorObj.canForward;
    }
  }, {
    key: "registerCallback",
    value: function registerCallback(layer, callback) {
      if (typeof this.callbacks[layer] === 'undefined') {
        // the variable is undefined
        this.callbacks[layer] = [];
      }
      this.callbacks[layer].push(callback);
      this.disableButtons(layer, { canBackward: false, canForward: true });
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      switch (e.keyCode) {
        case 65: // a
        case 37:
          // left arrow
          this.onBackward(1);
          break;
        case 68: // d
        case 39:
          // right arrow
          this.onForward(1);
          break;
      }
    }
  }]);

  return Stepper;
}();
//# sourceMappingURL=stepper-compiled.js.map

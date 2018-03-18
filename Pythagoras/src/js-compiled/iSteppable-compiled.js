"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ISteppable = function () {
    function ISteppable() {
        _classCallCheck(this, ISteppable);

        this.maxStep = 0;
    }

    _createClass(ISteppable, [{
        key: "redraw",
        value: function redraw() {
            var step = arguments.length <= 0 || arguments[0] === undefined ? this.currentStep : arguments[0];
        }
    }, {
        key: "onStep",
        value: function onStep(forward) {
            var nextStep = this.currentStep;
            if (forward) nextStep++;else {
                nextStep--;
            }
            nextStep = nextStep.clamp(0, this.maxStep);
            var buttonActivatorObj = { canBackward: false, canForward: false };
            if (nextStep > 0) buttonActivatorObj.canBackward = true;
            if (nextStep < this.maxStep) buttonActivatorObj.canForward = true;

            if (nextStep === this.currentStep) return buttonActivatorObj;

            this.currentStep = nextStep;
            this.redraw(this.currentStep);
            return buttonActivatorObj;
        }
    }]);

    return ISteppable;
}();
//# sourceMappingURL=iSteppable-compiled.js.map

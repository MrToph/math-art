"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(["definecolor{colorRed}{RGB}{255,50,50}definecolor{colorGreen}{RGB}{50,205,50}\n                                    definecolor{colorBlue}{RGB}{50,50,255}definecolor{colorYellow}{RGB}{255,165,0}"], ["\\definecolor{colorRed}{RGB}{255,50,50}\\definecolor{colorGreen}{RGB}{50,205,50}\n                                    \\definecolor{colorBlue}{RGB}{50,50,255}\\definecolor{colorYellow}{RGB}{255,165,0}"]),
    _templateObject2 = _taggedTemplateLiteral(["\textcolor{colorRed}{1^2} + \textcolor{colorGreen}{2^2} + \textcolor{colorBlue}{3^2} + \textcolor{colorYellow}{4^2} + ldots + n^2"], ["\\textcolor{colorRed}{1^2} + \\textcolor{colorGreen}{2^2} + \\textcolor{colorBlue}{3^2} + \\textcolor{colorYellow}{4^2} + \\ldots + n^2"]),
    _templateObject3 = _taggedTemplateLiteral(["3 cdot (1^2 + 2^2 + 3^2 + 4^2 + ldots + n^2)"], ["3 \\cdot (1^2 + 2^2 + 3^2 + 4^2 + \\ldots + n^2)"]),
    _templateObject4 = _taggedTemplateLiteral(["3 cdot (1^2 + 2^2 + 3^2 + 4^2 + ldots + n^2) =  n (n+1) (n+\frac{1}{2})"], ["3 \\cdot (1^2 + 2^2 + 3^2 + 4^2 + \\ldots + n^2) =  n (n+1) (n+\\frac{1}{2})"]),
    _templateObject5 = _taggedTemplateLiteral(["1^2 + 2^2 + 3^2 + 4^2 + ldots + n^2 = \frac{1}{3} n (n+1) (n+\frac{1}{2})"], ["1^2 + 2^2 + 3^2 + 4^2 + \\ldots + n^2 = \\frac{1}{3} n (n+1) (n+\\frac{1}{2})"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MathContainer = function (_ISteppable) {
    _inherits(MathContainer, _ISteppable);

    function MathContainer(element) {
        _classCallCheck(this, MathContainer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MathContainer).call(this));

        _this.width = 1200;
        _this.height = 500;

        _this.currentStep = 0;
        // this.colors = ["#ff3232", "#32ff32", "#3232ff", "#ffa500"];
        _this.element = element;

        _this.maxStep = 8;
        _this.oldInnerHTML = "";

        MathJax.Hub.Queue(function () {
            _this.jax = MathJax.Hub.getAllJax("mathContainer")[0];
        }, function () {
            _this.redraw(0);
        });
        return _this;
    }

    _createClass(MathContainer, [{
        key: "redraw",
        value: function redraw() {
            var step = arguments.length <= 0 || arguments[0] === undefined ? this.currentStep : arguments[0];

            var innerHTML = this.getTextForCurrentStep();
            if (innerHTML !== this.oldInnerHTML) {
                this.oldInnerHTML = innerHTML;
                MathJax.Hub.queue.Push(["Text", this.jax, innerHTML]);
            }
        }
    }, {
        key: "getTextForCurrentStep",
        value: function getTextForCurrentStep() {
            var colorDefs = String.raw(_templateObject);
            var text = "";
            switch (this.currentStep) {
                case 0:
                    text = String.raw(_templateObject2);
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    text = String.raw(_templateObject3);
                    break;
                case 7:
                case 8:
                    text = String.raw(_templateObject4);
                    break;
                default:
                    text = String.raw(_templateObject5);
            }
            return colorDefs + " \\smash{" + text + "}";
        }
    }]);

    return MathContainer;
}(ISteppable);
//# sourceMappingURL=mathContainer-compiled.js.map

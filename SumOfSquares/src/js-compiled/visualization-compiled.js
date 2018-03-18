"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Visualization = function (_ISteppable) {
    _inherits(Visualization, _ISteppable);

    function Visualization(element) {
        _classCallCheck(this, Visualization);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Visualization).call(this));

        _this2.squareSize = 100;

        _this2.colors = ["#ff3232", "#32CD32", "#3232ff", "#ffa500"];
        _this2.currentStep = 0;
        _this2.maxStep = 8;
        _this2.init(element);
        return _this2;
    }

    _createClass(Visualization, [{
        key: "init",
        value: function init(element) {
            this.scene = new THREE.Scene();
            // renderer
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setClearColor(0xffffff);
            this.renderer.setSize(window.innerWidth, window.innerHeight, false);

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
            var pos = new THREE.Vector3(500, 750, 500);
            this.camera.position.set(pos.x, pos.y, pos.z);

            // init controls
            this.controls = new THREE.OrbitControls(this.camera, element); // new THREE.TrackballControls( this.camera );
            // this.controls.rotateSpeed = 8.0;
            // this.controls.zoomSpeed = 1.2;
            // this.controls.panSpeed = 0.8;  // not sure what this is for
            this.controls.enableZoom = true;
            this.controls.enablePan = true; // right mouse => translates
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.3;
            this.controls.keys = [65, 83, 68]; // a, s, d
            this.controls.addEventListener('change', this.render.bind(this));

            // document.body.insertBefore(this.renderer.domElement, $("#mathContainer").get(0).nextSibling);
            element.appendChild(this.renderer.domElement);

            this.cubeGeometry = new THREE.BoxGeometry(this.squareSize, this.squareSize, this.squareSize);
            this.materials = [];
            for (var i = 0; i < this.colors.length; i++) {
                var material = new THREE.MeshBasicMaterial({ color: this.colors[i], wireframe: false,
                    polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 5.0 }); // needed to make EdgesHelper look good when rotating (otherwise edges go inside mesh)
                this.materials.push(material);
            }

            window.addEventListener('resize', this.onWindowResize.bind(this), false);

            this.animate();
            this.redraw(0);
        }
    }, {
        key: "clearScene",
        value: function clearScene() {
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
        }
    }, {
        key: "onWindowResize",
        value: function onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight, false);
            // this.controls.handleResize();    // not needed for OrbitControls
            this.render();
        }
    }, {
        key: "animate",
        value: function animate() {
            requestAnimationFrame(this.animate.bind(this));
            TWEEN.update();
            this.controls.update();
            this.render();
        }
    }, {
        key: "render",
        value: function render() {
            // gets called from controls.change
            this.renderer.render(this.scene, this.camera);
        }
    }, {
        key: "createScene",
        value: function createScene(step) {
            var _this3 = this;

            var blockSize = this.colors.length * this.squareSize;
            var margin = 100;
            var offset = new THREE.Vector3(-1, 0, -1).multiplyScalar((blockSize + margin) / 2);
            var layers = this.colors.length;
            switch (step) {
                case 0:
                    {
                        var blockGeometry = new THREE.Geometry();
                        var blockGeomInit = false;
                        if (typeof this.blockGeometry === 'undefined') {
                            blockGeomInit = true;
                        }
                        for (var i = 0; i < layers; i++) {
                            for (var j = 0; j < i + 1; j++) {
                                for (var k = 0; k < i + 1; k++) {
                                    var cube = new THREE.Mesh(this.cubeGeometry, this.materials[i]);
                                    var pos = new THREE.Vector3(j * this.squareSize, (layers - 1 - i) * this.squareSize, k * this.squareSize);
                                    cube.position.set(pos.x, pos.y, pos.z);
                                    this.scene.add(cube);
                                    var edges = new THREE.EdgesHelper(cube, 0x000000);
                                    this.scene.add(edges);
                                    if (blockGeomInit) {
                                        cube.updateMatrix();
                                        blockGeometry.merge(cube.geometry, cube.matrix);
                                    }
                                }
                            }
                        }
                        if (blockGeomInit) {
                            this.blockGeometry = blockGeometry;
                            this.blockGeometry.center();
                            this.blockGeometry.mergeVertices(); // removes duplicate vertices
                        }
                    }
                    break;
                case 1:
                    {
                        var rotationTime = 3000,
                            rotationDelay = 0;
                        for (var _i = 0; _i < 3; _i++) {
                            var block = new THREE.Mesh(this.blockGeometry, this.materials[_i]);
                            var _pos = void 0;
                            if (_i == 0) {
                                _pos = new THREE.Vector3(0, 0, 0);
                            } else if (_i == 1) {
                                _pos = new THREE.Vector3(blockSize + margin, 0, 0);
                                var tween = new TWEEN.Tween(block.rotation).to({ x: Math.PI / 2, z: Math.PI / 2 }, rotationTime).delay(rotationDelay).start();
                            } else {
                                _pos = new THREE.Vector3(0, 0, blockSize + margin);
                                var _tween = new TWEEN.Tween(block.rotation).to({ x: -Math.PI / 2, y: Math.PI / 2 }, rotationTime).delay(rotationDelay + rotationTime).onComplete(function () {
                                    stepper.onForward();
                                }).start();
                            }
                            _pos.add(offset);
                            block.position.set(_pos.x, _pos.y, _pos.z);
                            this.scene.add(block);
                            var _edges = new THREE.EdgesHelper(block, 0x000000);
                            this.scene.add(_edges);
                        }
                    }
                    break;
                case 2:
                case 3:
                    {
                        var translationTime = 2000;

                        var _loop = function _loop(_i2) {
                            var block = new THREE.Mesh(_this3.blockGeometry, _this3.materials[_i2]);
                            var pos = void 0;
                            if (_i2 == 0) {
                                pos = new THREE.Vector3(0, 0, 0);
                            } else if (_i2 == 1) {
                                pos = new THREE.Vector3(blockSize + margin, 0, 0);
                                block.rotation.x = Math.PI / 2;
                                block.rotation.z = Math.PI / 2;
                                if (step === 3) {
                                    var _tween2 = new TWEEN.Tween(pos).to(new THREE.Vector3(_this3.squareSize, 0, 0), translationTime).onUpdate(function () {
                                        var p = pos.clone().add(offset);
                                        block.position.set(p.x, p.y, p.z);
                                    }).onComplete(function () {
                                        stepper.onForward();
                                    }).start();
                                }
                            } else {
                                pos = new THREE.Vector3(0, 0, blockSize + margin);
                                block.rotation.x = -Math.PI / 2;
                                block.rotation.y = Math.PI / 2;
                            }
                            pos.add(offset);
                            block.position.set(pos.x, pos.y, pos.z);
                            _this3.scene.add(block);
                            var edges = new THREE.EdgesHelper(block, 0x000000);
                            _this3.scene.add(edges);
                        };

                        for (var _i2 = 0; _i2 < 3; _i2++) {
                            _loop(_i2);
                        }
                    }
                    break;
                case 4:
                case 5:
                    {
                        var _translationTime = 2000;

                        var _loop2 = function _loop2(_i3) {
                            var block = new THREE.Mesh(_this3.blockGeometry, _this3.materials[_i3]);
                            var pos = void 0;
                            if (_i3 == 0) {
                                pos = new THREE.Vector3(0, 0, 0);
                            } else if (_i3 == 1) {
                                pos = new THREE.Vector3(_this3.squareSize, 0, 0);
                                block.rotation.x = Math.PI / 2;
                                block.rotation.z = Math.PI / 2;
                            } else {
                                pos = new THREE.Vector3(0, 0, blockSize + margin);
                                block.rotation.x = -Math.PI / 2;
                                block.rotation.y = Math.PI / 2;
                                if (step === 5) {
                                    var tweenA = new TWEEN.Tween(pos).to(new THREE.Vector3(0, _this3.squareSize, blockSize + margin), _translationTime / 2).onUpdate(function () {
                                        var p = pos.clone().add(offset);
                                        block.position.set(p.x, p.y, p.z);
                                    });
                                    var tweenB = new TWEEN.Tween(pos).to(new THREE.Vector3(0, _this3.squareSize, 0), _translationTime).onUpdate(function () {
                                        var p = pos.clone().add(offset);
                                        block.position.set(p.x, p.y, p.z);
                                    }).onComplete(function () {
                                        stepper.onForward();
                                    });
                                    tweenA.chain(tweenB);
                                    tweenA.start();
                                }
                            }
                            pos.add(offset);
                            block.position.set(pos.x, pos.y, pos.z);
                            _this3.scene.add(block);
                            var edges = new THREE.EdgesHelper(block, 0x000000);
                            _this3.scene.add(edges);
                        };

                        for (var _i3 = 0; _i3 < 3; _i3++) {
                            _loop2(_i3);
                        }
                    }
                    break;
                case 6:
                    {
                        for (var _i4 = 0; _i4 < 3; _i4++) {
                            var _block = new THREE.Mesh(this.blockGeometry, this.materials[_i4]);
                            var _pos2 = void 0;
                            if (_i4 == 0) {
                                _pos2 = new THREE.Vector3(0, 0, 0);
                            } else if (_i4 == 1) {
                                _pos2 = new THREE.Vector3(this.squareSize, 0, 0);
                                _block.rotation.x = Math.PI / 2;
                                _block.rotation.z = Math.PI / 2;
                            } else {
                                _pos2 = new THREE.Vector3(0, this.squareSize, 0);
                                _block.rotation.x = -Math.PI / 2;
                                _block.rotation.y = Math.PI / 2;
                            }
                            _pos2.add(offset);
                            _block.position.set(_pos2.x, _pos2.y, _pos2.z);
                            this.scene.add(_block);
                            var _edges2 = new THREE.EdgesHelper(_block, 0x000000);
                            this.scene.add(_edges2);
                        }
                    }
                    break;
                case 7:
                case 8:
                    {
                        // build first two blocks
                        for (var _i5 = 0; _i5 < 2; _i5++) {
                            var _block2 = new THREE.Mesh(this.blockGeometry, this.materials[_i5]);
                            var _pos3 = void 0;
                            if (_i5 == 0) {
                                _pos3 = new THREE.Vector3(0, 0, 0);
                            } else if (_i5 == 1) {
                                _pos3 = new THREE.Vector3(this.squareSize, 0, 0);
                                _block2.rotation.x = Math.PI / 2;
                                _block2.rotation.z = Math.PI / 2;
                            } else {
                                _pos3 = new THREE.Vector3(0, this.squareSize, 0);
                                _block2.rotation.x = -Math.PI / 2;
                                _block2.rotation.y = Math.PI / 2;
                            }
                            _pos3.add(offset);
                            _block2.position.set(_pos3.x, _pos3.y, _pos3.z);
                            this.scene.add(_block2);
                            var _edges3 = new THREE.EdgesHelper(_block2, 0x000000);
                            this.scene.add(_edges3);
                        }

                        // build bottom layers of third block
                        var offset2 = new THREE.Vector3(-layers * this.squareSize, -this.squareSize / 2, -layers * this.squareSize);
                        for (var _i6 = 0; _i6 < layers; _i6++) {
                            for (var _j = 0; _j < _i6 + 1; _j++) {
                                for (var _k = 1; _k < _i6 + 1; _k++) {
                                    var _cube = new THREE.Mesh(this.cubeGeometry, this.materials[2]);
                                    var _pos4 = new THREE.Vector3(_j * this.squareSize, (layers - 1 - _k) * this.squareSize, _i6 * this.squareSize);
                                    _pos4.add(offset2);
                                    _cube.position.set(_pos4.x, _pos4.y, _pos4.z);
                                    this.scene.add(_cube);
                                    var _edges4 = new THREE.EdgesHelper(_cube, 0x000000);
                                    this.scene.add(_edges4);
                                }
                            }
                        }

                        // Split top row of third block into 2 half/size cubes
                        if (typeof this.halfBlockGeometry === 'undefined') {
                            var halfCubeGeometry = new THREE.BoxGeometry(this.squareSize, this.squareSize / 2, this.squareSize);
                            var halfBlockGeometry = new THREE.Geometry();
                            for (var _i7 = 0; _i7 < layers; _i7++) {
                                for (var _j2 = 0; _j2 < _i7 + 1; _j2++) {
                                    var _cube2 = new THREE.Mesh(halfCubeGeometry, this.materials[2]);
                                    var _pos5 = new THREE.Vector3(_j2 * this.squareSize, (layers - 1 - 0.25) * this.squareSize, _i7 * this.squareSize);
                                    _cube2.position.set(_pos5.x, _pos5.y, _pos5.z);
                                    _cube2.updateMatrix();
                                    halfBlockGeometry.merge(_cube2.geometry, _cube2.matrix);
                                }
                            }
                            this.halfBlockGeometry = halfBlockGeometry;
                            this.halfBlockGeometry.center();
                            this.halfBlockGeometry.mergeVertices(); // removes duplicate vertices
                        }
                        var upperSquares = void 0;

                        for (var _i8 = 0; _i8 < 2; _i8++) {
                            var _pos6 = offset2.clone().add(new THREE.Vector3(1.5 * this.squareSize, (2.75 + _i8 / 2) * this.squareSize, 1.5 * this.squareSize));
                            var _block3 = new THREE.Mesh(this.halfBlockGeometry, this.materials[2]);
                            _block3.position.set(_pos6.x, _pos6.y, _pos6.z);
                            this.scene.add(_block3);
                            var _edges5 = new THREE.EdgesHelper(_block3, 0x000000);
                            this.scene.add(_edges5);
                            if (_i8 === 1) upperSquares = _block3;
                        }
                        if (step === 7) {
                            var _rotationTime = 2000,
                                _translationTime2 = 1000;
                            var tweenA = new TWEEN.Tween(upperSquares.rotation).to({ y: Math.PI }, _rotationTime);
                            var tweenB = new TWEEN.Tween(upperSquares.position).to({ x: "+" + this.squareSize }, _translationTime2);
                            var tweenC = new TWEEN.Tween(upperSquares.position).to({ y: "-" + this.squareSize / 2 }, _translationTime2).onComplete(function () {
                                stepper.onForward();
                            });
                            tweenA.chain(tweenB);
                            tweenB.chain(tweenC);
                            tweenA.start();
                        } else {
                            upperSquares.rotation.y = Math.PI;
                            var _pos7 = upperSquares.position.clone().add(new THREE.Vector3(this.squareSize, -this.squareSize / 2, 0));
                            upperSquares.position.set(_pos7.x, _pos7.y, _pos7.z);
                        }
                    }
                    break;
            }
        }
    }, {
        key: "redraw",
        value: function redraw() {
            var step = arguments.length <= 0 || arguments[0] === undefined ? this.currentStep : arguments[0];

            this.currentStep = step;

            var _this = this;
            this.clearScene();
            this.createScene(this.currentStep);
            this.render(); // render new scene
        }
    }, {
        key: "onStep",
        value: function onStep(forward) {
            TWEEN.removeAll();
            var ret = _get(Object.getPrototypeOf(Visualization.prototype), "onStep", this).call(this, forward);
            return ret;
        }
    }]);

    return Visualization;
}(ISteppable);

// Tween.js
// https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md
//# sourceMappingURL=visualization-compiled.js.map

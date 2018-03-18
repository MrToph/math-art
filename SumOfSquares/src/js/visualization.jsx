class Visualization extends ISteppable{
    constructor(element) {
        super();

        this.squareSize = 100;

        this.colors = ["#ff3232", "#32CD32", "#3232ff", "#ffa500"];
        this.currentStep = 0;
        this.maxStep = 8;
        this.init(element);
    }

    init(element){
        this.scene = new THREE.Scene();
        // renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor( 0xffffff );
        this.renderer.setSize(window.innerWidth, window.innerHeight, false);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
        let pos = new THREE.Vector3(500, 750, 500);
        this.camera.position.set(pos.x, pos.y, pos.z);

        // init controls
        this.controls = new THREE.OrbitControls( this.camera, element );// new THREE.TrackballControls( this.camera );
        // this.controls.rotateSpeed = 8.0;
        // this.controls.zoomSpeed = 1.2;
        // this.controls.panSpeed = 0.8;  // not sure what this is for
        this.controls.enableZoom = true;
        this.controls.enablePan = true;  // right mouse => translates
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.3;
        this.controls.keys = [ 65, 83, 68 ]; // a, s, d
        this.controls.addEventListener( 'change', this.render.bind(this) );

        // document.body.insertBefore(this.renderer.domElement, $("#mathContainer").get(0).nextSibling);
        element.appendChild(this.renderer.domElement);

        this.cubeGeometry = new THREE.BoxGeometry(this.squareSize, this.squareSize, this.squareSize);
        this.materials = [];
        for(let i = 0; i < this.colors.length; i++){
            var material = new THREE.MeshBasicMaterial({color: this.colors[i], wireframe: false,
                polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 5.0});   // needed to make EdgesHelper look good when rotating (otherwise edges go inside mesh)
            this.materials.push(material);
        }

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

        this.animate();
        this.redraw(0);
    }

    clearScene(){
        while(this.scene.children.length > 0)
            this.scene.remove(this.scene.children[0]);
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight, false);
        // this.controls.handleResize();    // not needed for OrbitControls
        this.render();
    }

    animate(){
        requestAnimationFrame(this.animate.bind(this));
        TWEEN.update();
        this.controls.update();
        this.render();
    }

    render() {  // gets called from controls.change
        this.renderer.render(this.scene, this.camera);
    }

    createScene(step) {
        let blockSize = this.colors.length * this.squareSize;
        let margin = 100;
        let offset = new THREE.Vector3(-1, 0, -1).multiplyScalar((blockSize + margin)/2 );
        let layers = this.colors.length;
        switch(step){
            case 0:
            {
                let blockGeometry = new THREE.Geometry();
                let blockGeomInit = false;
                if(typeof this.blockGeometry === 'undefined'){
                    blockGeomInit = true;
                }
                for(let i = 0; i < layers; i++){
                    for(let j = 0; j < i + 1; j++){
                        for(let k = 0; k < i + 1; k++){
                            let cube = new THREE.Mesh(this.cubeGeometry, this.materials[i]);
                            let pos = new THREE.Vector3(j * this.squareSize, (layers - 1 - i) * this.squareSize, k * this.squareSize);
                            cube.position.set(pos.x, pos.y, pos.z );
                            this.scene.add(cube);
                            let edges = new THREE.EdgesHelper(cube, 0x000000);
                            this.scene.add(edges);
                            if(blockGeomInit){
                                cube.updateMatrix();
                                blockGeometry.merge(cube.geometry, cube.matrix);
                            }
                        }
                    }
                }
                if(blockGeomInit){
                    this.blockGeometry = blockGeometry;
                    this.blockGeometry.center();
                    this.blockGeometry.mergeVertices(); // removes duplicate vertices
                }
            }
            break;
            case 1:
            {
                let rotationTime = 3000, rotationDelay = 0;
                for(let i = 0; i < 3; i++){
                    let block = new THREE.Mesh(this.blockGeometry, this.materials[i]);
                    let pos;
                    if(i == 0){
                        pos = new THREE.Vector3(0, 0, 0);
                    }
                    else if(i == 1){
                        pos = new THREE.Vector3(blockSize + margin, 0, 0);
                        let tween = new TWEEN.Tween(block.rotation)
                            .to({ x: Math.PI/2, z: Math.PI/2}, rotationTime)
                            .delay(rotationDelay)
                            .start();
                    }
                    else{
                        pos = new THREE.Vector3(0, 0, blockSize + margin);
                        let tween = new TWEEN.Tween(block.rotation)
                            .to({ x: -Math.PI / 2, y: Math.PI/2}, rotationTime)
                            .delay(rotationDelay + rotationTime)
                            .onComplete(() => {stepper.onForward();})
                            .start();
                    }
                    pos.add(offset);
                    block.position.set(pos.x, pos.y, pos.z );
                    this.scene.add(block);
                    let edges = new THREE.EdgesHelper(block, 0x000000);
                    this.scene.add(edges);
                }
            }
            break;
            case 2:
            case 3:
            {
                let translationTime = 2000;
                for(let i = 0; i < 3; i++){
                    let block = new THREE.Mesh(this.blockGeometry, this.materials[i]);
                    let pos;
                    if(i == 0){
                        pos = new THREE.Vector3(0, 0, 0);
                    }
                    else if(i == 1){
                        pos = new THREE.Vector3(blockSize + margin, 0, 0);
                        block.rotation.x = Math.PI / 2;
                        block.rotation.z = Math.PI / 2;
                        if(step === 3){
                            let tween = new TWEEN.Tween(pos)
                                .to(new THREE.Vector3(this.squareSize, 0, 0), translationTime)
                                .onUpdate(() => {
                                    let p = pos.clone().add(offset);
                                    block.position.set(p.x, p.y, p.z);
                                })
                                .onComplete(() => {stepper.onForward();})
                                .start();
                        }
                    }
                    else{
                        pos = new THREE.Vector3(0, 0, blockSize + margin);
                        block.rotation.x = -Math.PI / 2;
                        block.rotation.y = Math.PI / 2;
                    }
                    pos.add(offset);
                    block.position.set(pos.x, pos.y, pos.z );
                    this.scene.add(block);
                    let edges = new THREE.EdgesHelper(block, 0x000000);
                    this.scene.add(edges);
                }
            }
            break;
            case 4:
            case 5:
            {
                let translationTime = 2000;
                for(let i = 0; i < 3; i++){
                    let block = new THREE.Mesh(this.blockGeometry, this.materials[i]);
                    let pos;
                    if(i == 0){
                        pos = new THREE.Vector3(0, 0, 0);
                    }
                    else if(i == 1){
                        pos = new THREE.Vector3(this.squareSize, 0, 0);
                        block.rotation.x = Math.PI / 2;
                        block.rotation.z = Math.PI / 2;
                    }
                    else{
                        pos = new THREE.Vector3(0, 0, blockSize + margin);
                        block.rotation.x = -Math.PI / 2;
                        block.rotation.y = Math.PI / 2;
                        if(step === 5){
                            let tweenA = new TWEEN.Tween(pos)
                                .to(new THREE.Vector3(0, this.squareSize, blockSize + margin), translationTime/2)
                                .onUpdate(() => {
                                    let p = pos.clone().add(offset);
                                    block.position.set(p.x, p.y, p.z);
                                })
                            let tweenB = new TWEEN.Tween(pos)
                                .to(new THREE.Vector3(0, this.squareSize, 0), translationTime)
                                .onUpdate(() => {
                                    let p = pos.clone().add(offset);
                                    block.position.set(p.x, p.y, p.z);
                                })
                                .onComplete(() => {stepper.onForward();});
                            tweenA.chain(tweenB);
                            tweenA.start();
                        }
                    }
                    pos.add(offset);
                    block.position.set(pos.x, pos.y, pos.z );
                    this.scene.add(block);
                    let edges = new THREE.EdgesHelper(block, 0x000000);
                    this.scene.add(edges);
                }
            }
            break;
            case 6:
            {
                for(let i = 0; i < 3; i++){
                    let block = new THREE.Mesh(this.blockGeometry, this.materials[i]);
                    let pos;
                    if(i == 0){
                        pos = new THREE.Vector3(0, 0, 0);
                    }
                    else if(i == 1){
                        pos = new THREE.Vector3(this.squareSize, 0, 0);
                        block.rotation.x = Math.PI / 2;
                        block.rotation.z = Math.PI / 2;
                    }
                    else{
                        pos = new THREE.Vector3(0, this.squareSize, 0);
                        block.rotation.x = -Math.PI / 2;
                        block.rotation.y = Math.PI / 2;
                    }
                    pos.add(offset);
                    block.position.set(pos.x, pos.y, pos.z );
                    this.scene.add(block);
                    let edges = new THREE.EdgesHelper(block, 0x000000);
                    this.scene.add(edges);
                }
            }
            break;
            case 7:
            case 8:
            {
                // build first two blocks
                for(let i = 0; i < 2; i++){
                    let block = new THREE.Mesh(this.blockGeometry, this.materials[i]);
                    let pos;
                    if(i == 0){
                        pos = new THREE.Vector3(0, 0, 0);
                    }
                    else if(i == 1){
                        pos = new THREE.Vector3(this.squareSize, 0, 0);
                        block.rotation.x = Math.PI / 2;
                        block.rotation.z = Math.PI / 2;
                    }
                    else{
                        pos = new THREE.Vector3(0, this.squareSize, 0);
                        block.rotation.x = -Math.PI / 2;
                        block.rotation.y = Math.PI / 2;
                    }
                    pos.add(offset);
                    block.position.set(pos.x, pos.y, pos.z );
                    this.scene.add(block);
                    let edges = new THREE.EdgesHelper(block, 0x000000);
                    this.scene.add(edges);
                }

                // build bottom layers of third block
                let offset2 = new THREE.Vector3(-layers * this.squareSize, -this.squareSize/2, -layers * this.squareSize);
                for(let i = 0; i < layers; i++){
                    for(let j = 0; j < i + 1; j++){
                        for(let k = 1; k < i + 1; k++){
                            let cube = new THREE.Mesh(this.cubeGeometry, this.materials[2]);
                            let pos = new THREE.Vector3(j * this.squareSize, (layers - 1 - k) * this.squareSize, i * this.squareSize);
                            pos.add(offset2);
                            cube.position.set(pos.x, pos.y, pos.z );
                            this.scene.add(cube);
                            let edges = new THREE.EdgesHelper(cube, 0x000000);
                            this.scene.add(edges);
                        }
                    }
                }

                // Split top row of third block into 2 half/size cubes
                if(typeof this.halfBlockGeometry === 'undefined'){
                    let halfCubeGeometry = new THREE.BoxGeometry(this.squareSize, this.squareSize/2, this.squareSize);
                    let halfBlockGeometry = new THREE.Geometry();
                    for(let i = 0; i < layers; i++){
                        for(let j = 0; j < i + 1; j++){
                                let cube = new THREE.Mesh(halfCubeGeometry, this.materials[2]);
                                let pos = new THREE.Vector3(j * this.squareSize, (layers - 1 - 0.25) * this.squareSize, i * this.squareSize);
                                cube.position.set(pos.x, pos.y, pos.z );
                                cube.updateMatrix();
                                halfBlockGeometry.merge(cube.geometry, cube.matrix);
                            }
                        }
                    this.halfBlockGeometry = halfBlockGeometry;
                    this.halfBlockGeometry.center();
                    this.halfBlockGeometry.mergeVertices(); // removes duplicate vertices
                }
                let upperSquares;

                for(let i = 0; i < 2; i++){
                    let pos = offset2.clone().add(new THREE.Vector3(1.5 * this.squareSize, (2.75 + i/2) * this.squareSize, 1.5 * this.squareSize));
                    let block = new THREE.Mesh(this.halfBlockGeometry, this.materials[2]);
                    block.position.set(pos.x, pos.y, pos.z );
                    this.scene.add(block);
                    let edges = new THREE.EdgesHelper(block, 0x000000);
                    this.scene.add(edges);
                    if(i === 1)
                        upperSquares = block;
                }
                if(step === 7){
                    let rotationTime = 2000, translationTime = 1000;
                    let tweenA = new TWEEN.Tween(upperSquares.rotation)
                                .to({ y: Math.PI}, rotationTime)
                    let tweenB = new TWEEN.Tween(upperSquares.position)
                                .to({ x: "+" + this.squareSize}, translationTime)
                    let tweenC = new TWEEN.Tween(upperSquares.position)
                                .to({ y: "-" + this.squareSize/2}, translationTime)
                                .onComplete(() => {stepper.onForward();});
                    tweenA.chain(tweenB);
                    tweenB.chain(tweenC);
                    tweenA.start();
                }
                else{
                    upperSquares.rotation.y = Math.PI;
                    let pos = upperSquares.position.clone().add(new THREE.Vector3(this.squareSize, -this.squareSize/2, 0));
                    upperSquares.position.set(pos.x, pos.y, pos.z);
                }

            }
            break;
        }
    }

    redraw(step = this.currentStep){
        this.currentStep = step;

        let _this = this;
        this.clearScene();
        this.createScene(this.currentStep);
        this.render();  // render new scene
    }

    onStep(forward){
        TWEEN.removeAll();
        let ret = super.onStep(forward);
        return ret;
    }
}

// Tween.js
// https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md
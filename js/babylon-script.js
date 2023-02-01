const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
canvas.addEventListener("wheel", evt => evt.preventDefault());

// LOADING SCREEN
var loadingScreenDiv = window.document.getElementById("loadingScreen");

function customLoadingScreen() {
    console.log("customLoadingScreen creation")
}
customLoadingScreen.prototype.displayLoadingUI = function () {
    console.log("customLoadingScreen loading")
    //loadingScreenDiv.innerHTML = "loading...";
};
customLoadingScreen.prototype.hideLoadingUI = function () {
    console.log("customLoadingScreen loaded")
    loadingScreenDiv.style.display = "none";
};
var loadingScreen = new customLoadingScreen();
engine.loadingScreen = loadingScreen;

engine.displayLoadingUI();

// 3D MODEL PATH
const rootUrl = "assets/models/";
const fileName = "TE_for_glb_06.glb";

const createScene = function () {
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    
    // Transparent background
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 0).toLinearSpace();

    // CAMERA
    var defaultCamera = new BABYLON.ArcRotateCamera("Default Camera", BABYLON.Tools.ToRadians(-135), BABYLON.Tools.ToRadians(85), 1.0, BABYLON.Vector3.Zero(), scene);
    var sceneCameras = [];
    sceneCameras.push(defaultCamera);

    // Camera limits
    defaultCamera.lowerBetaLimit = 0.05;
    defaultCamera.upperBetaLimit = (Math.PI / 2) * 0.95;
    defaultCamera.lowerRadiusLimit = 6;
    defaultCamera.upperRadiusLimit = 50;
    defaultCamera.minZ = 0.5;

    // Camera sensibility
    defaultCamera.inertia = 0.5;
    defaultCamera.inertialPanningX = 1;
    defaultCamera.inertialPanningY = 0.5;
    defaultCamera.angularSensibilityX = 500;
    defaultCamera.angularSensibilityY = 500;
    defaultCamera.panningInertia = 0.5; //standard 1.0

    // Camera behavior
    //defaultCamera.useAutoRotationBehavior = true;
    defaultCamera.useFramingBehavior = true;
    defaultCamera.framingBehavior.mode = BABYLON.FramingBehavior.IgnoreBoundsSizeMode;
    defaultCamera.framingBehavior.radiusScale = 0.55;

    // This attaches the camera to the canvas
    defaultCamera.attachControl(canvas, true);

     // ENVIRONMENT, SKYBOX
    //let envLighting = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
    //let envLighting = BABYLON.CubeTexture.CreateFromPrefilteredData("https://playground.babylonjs.com/textures/Studio_Softbox_2Umbrellas_cube_specular.env", scene);
    let envLighting = new BABYLON.CubeTexture("assets/environments/studio_small_08_1k.dds", scene);
    envLighting.name = "envLighting";
    envLighting.gammaSpace = true;
    scene.environmentTexture = envLighting;
    envLighting.rotationY = BABYLON.Tools.ToRadians(90);
    envLighting.level = .9;
    // Skybox - comment out to hide visually
    //scene.createDefaultSkybox(scene.environmentTexture, true, (scene.activeCamera.maxZ - scene.activeCamera.minZ)/2, 0.3, false);

    // LIGHT
    //scene.createDefaultLight();
    const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, -1), scene);
    //const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-0.1, -0.6, 0.3), scene);
    //light.position = new BABYLON.Vector3(60, 50, 60);
    light.diffuse = new BABYLON.Color3(1, 1, .95);
    light.groundColor = new BABYLON.Color3(0, 0, .1);
    light.intensity  = 0.25;
    
    BABYLON.SceneLoader.LoadAssetContainer(rootUrl, fileName, scene, function (container) {
        const meshes = container.meshes;
        const materials = container.materials;
        const cameras = container.cameras;
        for (var i=0; i<cameras.length; i++) {
            sceneCameras.push(cameras[i]);
        }

        container.addAllToScene();

        // Focus
        const boundingbox = scene.getMeshByName("_BoundingBox");
        if (boundingbox)
        {
            defaultCamera.setTarget(boundingbox);
            boundingbox.setEnabled(false);
        }
        else 
        {
            defaultCamera.setTarget(new BABYLON.Vector3.Zero());
        }

        // GUI
        // Create advance texture
        var advancedTexture = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", scene);
        advancedTexture.renderScale = 1;

        //advancedTexture.BILINEAR_SAMPLINGMODE = 32;
        advancedTexture.LINEAR_NEAREST = 12;

        // advancedTexture.idealWidth = 1600;
        // advancedTexture.renderAtIdealSize = true;
        // if( window.innerWidth < 1000 ) {
        //     hotspot.fontSize = 0;
        //     return scene;
        // }

        let images = [];
        var currentIndex = 0;
        // Create Hotspots in 3d scene
        var hs = scene.getTransformNodeByName("_Hotspots").getChildTransformNodes();
        hs.forEach(spot => {
            var hotspot = BABYLON.GUI.Button.CreateSimpleButton("button", spot.name);
            spot.setEnabled(false);
            hotspot.width = "38px";
            hotspot.height = "38px";
            hotspot.cornerRadius = 40;
            hotspot.background = "white";
            hotspot.color = "#888";
            hotspot.thickness = 0;
            hotspot.alpha= 0.75;
            hotspot.fontSize = 24;
            hotspot.fontFamily = "Roboto";
            
            // Make Hotspot buttons show image
            images.push("assets/images/step1/"+spot.name+".jpg");
            hotspot.onPointerUpObservable.add((evt) => {
                showImage(spot.name-1);
            });
            advancedTexture.addControl(hotspot);
            hotspot.linkWithMesh(spot);
        });

        
        var image = new BABYLON.GUI.Image("image", "");
        image.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
        image.height = 0.8;
        advancedTexture.addControl(image);
        image.isVisible = false;

        image.onPointerClickObservable.add((evt) => {
            closeImage();
        });

        function showImage(index) {
            image.source = images[index];
            image.shadowBlur = canvas.height/4;
            image.isVisible = true;
            image.scaleX = 1;
            image.scaleY = 1;
            image.zIndex = 5;
            image.leftInPixels = 0;
            image.topInPixels = 0;
        };

        function closeImage() {     
            image.isVisible = false;
            image.shadowBlur = 0;
        }

        // SCREENSHOT
        var screenshot = document.getElementById('screenShot');
        screenshot.addEventListener('click',function(){
            BABYLON.Tools.CreateScreenshot(engine, sceneCameras, {width: canvas.width, height: canvas.height});
        });

        console.log(sceneCameras);

        // CAMERA SELECTOR
        var select = document.getElementById("camerasList");
        for (var i=0; i < cameras.length; i++) {
            var newOption = document.createElement("option");
            // newOption.value = cameras[i].id;
            // newOption.id = cameras[i].id;
            newOption.text = cameras[i].id;
            newOption.disabled = false;
            select.appendChild(newOption);
        }
        select.addEventListener('change', () => {
            scene.activeCamera = sceneCameras[select.selectedIndex];
        });

        
        // POST PROCESSING
        // Motion blur
        var motionblur = new BABYLON.MotionBlurPostProcess(
            'motionblur', // The name of the effect.
            scene, // The scene containing the objects to blur according to their velocity.
            1.0, // The required width/height ratio to downsize to before computing the render pass.
            scene.activeCamera // The camera to apply the render pass to.
        );
        motionblur.motionStrength = 0.5; // amout of the blur effect
        motionblur.motionBlurSamples = 16;
        motionblur.isObjectBased = false; // Disable object-based mode in order to enable screen-based mode.
        scene.activeCamera.detachPostProcess(motionblur);

        var inputMB = document.getElementById('toggleMB');
        inputMB.addEventListener('change',function(){
            if(this.checked) {
                scene.activeCamera.attachPostProcess(motionblur)
            } else {
                scene.activeCamera.detachPostProcess(motionblur)
            }
        });

        // Create Default RenderPipeline
        var defaultPipeline = new BABYLON.DefaultRenderingPipeline("DefaultRenderingPipeline", false, scene, sceneCameras);
        if (defaultPipeline.isSupported) {
            defaultPipeline.bloomEnabled = false;
            defaultPipeline.fxaaEnabled = false;
            defaultPipeline.samples = 1;
            
            // MSAA
            // var inputMSAA = document.getElementById('toggleMsaa');
            // inputMSAA.addEventListener('change',function(){
            //     if(this.checked) {
            //         defaultPipeline.samples = 4;
            //     } else {
            //         defaultPipeline.samples = 1;
            //     }
            // });
            // FXAA
            var inputFXAA = document.getElementById('toggleFxaa');
            inputFXAA.addEventListener('change',function(){
                if(this.checked) {
                    defaultPipeline.fxaaEnabled = true;
                    defaultPipeline.fxaa.samples = 8;
                    defaultPipeline.fxaa.adaptScaleToCurrentViewport = true;
                } else {
                    defaultPipeline.fxaaEnabled = false;
                }
            });
            // Sharpening
            var inputSharp = document.getElementById('toggleSharpening');
            inputSharp.addEventListener('change',function(){
                if(this.checked) {
                    defaultPipeline.sharpenEnabled = true;
                } else {
                    defaultPipeline.sharpenEnabled = false;
                }
            });
            defaultPipeline.sharpen.edgeAmount = 0.2;
            defaultPipeline.sharpen.colorAmount = 1.0;
            // Bloom
            var inputBloom = document.getElementById('toggleBloom');
            inputBloom.addEventListener('change',function(){
                if(this.checked) {
                    defaultPipeline.bloomEnabled = true;
                } else {
                    defaultPipeline.bloomEnabled = false;
                }
            });
            defaultPipeline.bloomThreshold = 0.9;
            defaultPipeline.bloomWeight = 0.15;
            defaultPipeline.bloomKernel = 64;
            defaultPipeline.bloomScale = 0.5;
        }
    
    engine.hideLoadingUI();
    });
    //engine.setHardwareScalingLevel(.5);
    return scene;
};
const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});
const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true, null, false); // Generate the BABYLON 3D engine
renderCanvas.addEventListener("wheel", evt => evt.preventDefault());

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


// CREATE SCENE 
var delayCreateScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // Transparent background
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 0).toLinearSpace();

    // CAMERA
    var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(-92), BABYLON.Tools.ToRadians(65), 1.5, BABYLON.Vector3.Zero(), scene);
    
    // Camera limits
    camera.lowerBetaLimit = 0.05;
	camera.upperBetaLimit = (Math.PI / 2) * 0.95;
    camera.lowerRadiusLimit = 6;
    camera.upperRadiusLimit = 50;
    camera.minZ = 0.5;

    // Camera sensibility
    camera.inertia = 0.5;
    camera.inertialPanningX = 1;
    camera.inertialPanningY = 0.5;
    camera.angularSensibilityX = 500;
    camera.angularSensibilityY = 500;
    camera.panningInertia = 0.5; //standard 1.0

    // Camera behavior
    //camera.useAutoRotationBehavior = true;
    camera.useFramingBehavior = true;
    camera.framingBehavior.mode = BABYLON.FramingBehavior.IgnoreBoundsSizeMode;
    camera.framingBehavior.radiusScale = 0.55;

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // ENVIRONMENT, SKYBOX
    //let lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
    //let lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("https://playground.babylonjs.com/textures/Studio_Softbox_2Umbrellas_cube_specular.env", scene);
    let lighting = new BABYLON.CubeTexture("assets/environments/studio_small_08_1k.dds", scene);
    lighting.name = "envLighting";
    lighting.gammaSpace = true;
    scene.environmentTexture = lighting;
    lighting.rotationY = BABYLON.Tools.ToRadians(90);
    lighting.level = 1;
    // Skybox - comment out to hide visually
    //scene.createDefaultSkybox(scene.environmentTexture, true, (scene.activeCamera.maxZ - scene.activeCamera.minZ)/2, 0.3, false);

    // LIGHT
    //scene.createDefaultLight();
    const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, -1), scene);
    //const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-0.1, -0.6, 0.3), scene);
    //light.position = new BABYLON.Vector3(60, 50, 60);
    light.diffuse = new BABYLON.Color3(1, 1, .95);
    light.groundColor = new BABYLON.Color3(0, 0, .1);
    light.intensity  = 0.5;
    

    // LOAD 3D MODEL
    BABYLON.SceneLoader.ImportMesh("", "assets/models/", "TE_for_glb_03.glb", scene, async function(newMeshes){
    
        // Focus Camera on mesh "_BoundingBox" or scene origin
        const boundingbox = scene.getMeshByName("_BoundingBox");
        if (boundingbox)
        {
            camera.setTarget(boundingbox);
            boundingbox.setEnabled(false);
        }
        else 
        {
            camera.setTarget(new BABYLON.Vector3.Zero());
        }

        // GUI
        // Create advance texture
        var advancedTexture = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", scene);
        advancedTexture.BILINEAR_SAMPLINGMODE = 32;
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
            hotspot.width = "24px";
            hotspot.height = "24px";
            hotspot.cornerRadius = 40;
            hotspot.background = "white";
            hotspot.color = "#888";
            hotspot.thickness = 0;
            hotspot.alpha= 0.75;
            hotspot.fontSize = 20;
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
            image.shadowBlur = screen.width/2;
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

        // Shadows handling
        /*
        const shadowGenerator = new BABYLON.ShadowGenerator(2048, light);

        newMeshes.forEach(function(mesh)
        {
            shadowGenerator.addShadowCaster(mesh);
            mesh.receiveShadows = true;
        });
        shadowGenerator.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;
        shadowGenerator.blurScale = 0.5;
        shadowGenerator.blurBoxOffset = 1;
        light.shadowMinZ = 0.1;
        light.shadowMaxZ = 30;
        shadowGenerator.useBlurCloseExponentialShadowMap = true;
        shadowGenerator.forceBackFacesOnly = true;
        shadowGenerator.blurKernel = 8;
        shadowGenerator.useKernelBlur = true;
        */
        // Hide Loading Screen after finished loading model
        engine.hideLoadingUI();
    });

    // POST PROCESSING
    // Motion blur
    // var motionblur = new BABYLON.MotionBlurPostProcess(
    //     'motionblur', // The name of the effect.
    //     scene, // The scene containing the objects to blur according to their velocity.
    //     1.0, // The required width/height ratio to downsize to before computing the render pass.
    //     camera // The camera to apply the render pass to.
    //     );
    // motionblur.motionStrength = 0.1; // amout of the blur effect
    // motionblur.motionBlurSamples = 16;
    // motionblur.isObjectBased = false; // Disable object-based mode in order to enable screen-based mode.

    // // Create Default RenderPipeline
    // var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", false, scene, [camera]);
    // // MSAA
    // defaultPipeline.samples = 4;
    // // FXAA
    // defaultPipeline.fxaaEnabled = true;
    // // Sharpening
    // defaultPipeline.sharpenEnabled = false;
    // defaultPipeline.sharpen.edgeAmount = 0.1;
    // defaultPipeline.sharpen.colorAmount = 1.0;
    // // Bloom
    // defaultPipeline.bloomEnabled = false;
    // defaultPipeline.bloomThreshold = 100;
    // defaultPipeline.bloomWeight = 0.01;
    // defaultPipeline.bloomKernel = 128;
    // defaultPipeline.bloomScale = 0.9;
    // // Image processing effect
    // defaultPipeline.imageProcessingEnabled = false;

    return scene;
};
const scene = delayCreateScene(); //Call the createScene function

//engine.advancedTexture.renderScale = 1;

engine.adaptToDeviceRatio = false;

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});
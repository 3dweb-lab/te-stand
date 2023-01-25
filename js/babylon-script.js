const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
renderCanvas.addEventListener("wheel", evt => evt.preventDefault());

const rootUrl = "assets/models/";
const fileName = "TE_for_glb_05.glb";

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

const createScene = function () {
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    
    // Transparent background
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 0).toLinearSpace();

    // CAMERA
    var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(-135), BABYLON.Tools.ToRadians(85), 1.0, BABYLON.Vector3.Zero(), scene);

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
        //...
      
        // Adds all elements to the scene

        container.addAllToScene();

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

        console.log(cameras);

        for (var i=0; i < cameras.length; i++) {
            var select = document.getElementById("camerasList");
            var newOption = document.createElement("option");
            newOption.value = cameras[i].id;
            newOption.text = cameras[i].id;
            select.appendChild(newOption);
        }
        
        // select.addEventListener('change', () => {
        //     scene.activeCamera = select.option;
        // });

        
        //scene.activeCamera = select.value;
    });

    engine.hideLoadingUI();
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
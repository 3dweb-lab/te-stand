const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var createScene = function () {

// Adding labels
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

var target = new BABYLON.GUI.Ellipse();
target.width = "400px";
target.height = "400px";
target.color = "Orange";
target.thickness = 4;
target.background = "green";
advancedTexture.addControl(target);
target.linkWithMesh("-BoudingBox");


// GUI
var plane = BABYLON.Mesh.CreatePlane("plane", 2);
plane.parent = sphere;
plane.position.y = 2;

plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);

var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click Me");
button1.width = 1;
button1.height = 0.4;
button1.color = "white";
button1.fontSize = 50;
button1.background = "green";
button1.onPointerUpObservable.add(function() {
    alert("you did it!");
});
advancedTexture.addControl(button1);

return scene;
};
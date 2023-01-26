// related post: https://forum.babylonjs.com/t/serializing-mesh-in-es6-module-has-many-problems/2293
// all the js files require an external module "ts-lib", so they can't be imported directly in browsers in runtime
// the only way is using some packing software to make the project, like Webpack or Parcel

import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import '@babylonjs/core/Helpers/sceneHelpers'
import { SceneSerializer } from '@babylonjs/core/Misc/sceneSerializer';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'

// Comment this line to fire problem No.3
import '@babylonjs/core/Loading/Plugins/babylonFileLoader'

var canvas = document.getElementById("renderCanvas");

var engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

var scene = new Scene(engine);

scene.createDefaultCameraOrLight(true, true, true)

let mesh = Mesh.CreateBox('box', 1, scene)

// Comment these three lines to fire problem No.2
mesh.__proto__.getPhysicsImpostor = function () {
    return this.physicsImpostor;
};

let obj = SceneSerializer.SerializeMesh(mesh)

mesh.dispose()

// When we import mesh from stringfied data, we must not give the new mesh a name,
// we should always make the first argument `meshNames` as an empty string,
// otherwise, we'll get an empty array
SceneLoader.ImportMesh('', '', `data:${JSON.stringify(obj)}`, scene, (meshes) => {
    // This is the problem No.4, the meshes is an empty array
    console.log(meshes)
})


    
engine.runRenderLoop( () => {
    scene.render()
})


// Resize
window.addEventListener("resize", function () {
    engine.resize();
});
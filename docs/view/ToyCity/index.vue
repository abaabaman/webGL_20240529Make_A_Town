<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { render, onMounted } from "vue";
import modelMap from "./modelMap";

const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 400;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(10, 3, 10);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#ccc");

// const canvas = document.querySelector("#c");
// const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
// const controls = new OrbitControls(camera, canvas);
// controls.target.set(0, 2, 0);
// controls.update();

const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

// 正方形
modelMap.forEach(({ name, translate }) => {
  const geometry = new THREE.BoxGeometry(...translate.size);
  const material = new THREE.MeshBasicMaterial({ color: "red" });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(...translate.position);
  scene.add(cube);
});

// three禁止切换视角
// controls.enableRotate = false;
// three 鼠标拖拽为平移视角
// three 鼠标拖拽为平移视角
// controls.enablePan = true;

controls.mouseButtons = {
  LEFT: THREE.MOUSE.PAN,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.ROTATE,
};

controls.minDistance = 5;
controls.maxDistance = 100;
// controls.enablePan = false;
// controls.enableRotate = false;
// controls.enableZoom = false;

controls.target.set(0, 0, 0);
controls.update();

renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", onWindowResize);
onWindowResize();
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}
animate();

onMounted(() => {
  document.getElementById("three").appendChild(renderer.domElement);
});
</script>
<template>
  <div id="three" />
</template>
<style>
html,
body {
  height: 100%;
  margin: 0;
}
#c {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

<template>
  <canvas id="c"></canvas>
</template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { render, onMounted } from "vue";

onMounted(() => {
  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 400;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(10, 5, 10);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#ccc");

  // 正方形
  const geometry = new THREE.BoxGeometry(3, 0.02, 10);
  const material = new THREE.MeshBasicMaterial({ color: "red" });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 2, 0);
  controls.update();

  // three禁止切换视角
  // controls.enableRotate = false;
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
  renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);
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
});
</script>

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

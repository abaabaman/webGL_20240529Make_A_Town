<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { THREE_URL } from '../constant/url'

const color = 0xffffff
const intensity = 2.5
const outLight = new THREE.DirectionalLight(color, intensity)
outLight.position.set(0, 10, 0)
outLight.target.position.set(-5, 0, 0)

// 灯光
let x_light = 0, y_light = 10, z_light = 0;
let y_light_out = true, z_light_out = true;
const lightMove = setInterval(() => {
  // if(x_light > 0 || x_light < -15)xGo=!xGo;
  if (y_light > 50 || y_light < 10) y_light_out = !y_light_out;
  if (z_light > 0 || z_light < -15) z_light_out = !z_light_out;
  // if(xGo) {
  //     x_light ++
  // }else{
  //     x_light --;
  // };
  if (y_light_out) {
    y_light += 0.2
  } else {
    y_light -= 0.2;
  };
  if (z_light_out) {
    z_light += 0.2
  } else {
    z_light -= 0.2;
  };
  outLight.position.set(x_light, y_light, z_light);
}, 100)

// 摄像机
const fov = 45
const aspect = 2 // the canvas default
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(-2, 3, 19)

let x_camera = -2, y_camera = 3, z_camera = 19;
let x_camera_out = true, y_camera_out = true, z_camera_out = true;
const cameraMove = setInterval(() => {
  if (x_camera > 2.5 || x_camera < 1.5) x_camera_out = !x_camera_out;
  if (y_camera > 3 || y_camera < 2.5) y_camera_out = !y_camera_out;
  if (z_camera > 19 || z_camera < 18) z_camera_out = !z_camera_out;
  if (x_camera_out) {
    x_camera += 0.001;
  } else {
    x_camera -= 0.001;
  };
  if (y_camera_out) {
    y_camera += 0.005;
  } else {
    y_camera -= 0.005;
  };
  if (z_camera_out) {
    z_camera += 0.005;
  } else {
    z_camera -= 0.005;
  };
  camera.position.set(x_camera, y_camera, z_camera);
}, 50)


onBeforeUnmount(() => {
  clearInterval(lightMove);
  clearInterval(cameraMove);
})


onMounted(() => {
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true })

  const controls = new OrbitControls(camera, canvas)
  controls.enableZoom = false
  controls.enableRotate = false
  controls.enablePan = false
  controls.target.set(-2, 5, 0)

  controls.update()

  const scene = new THREE.Scene()

  // {

  //     const planeSize = 40;

  //     const loader = new THREE.TextureLoader();
  //     const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png');
  //     texture.colorSpace = THREE.SRGBColorSpace;
  //     texture.wrapS = THREE.RepeatWrapping;
  //     texture.wrapT = THREE.RepeatWrapping;
  //     texture.magFilter = THREE.NearestFilter;
  //     const repeats = planeSize / 2;
  //     texture.repeat.set(repeats, repeats);

  //     const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  //     const planeMat = new THREE.MeshPhongMaterial({
  //         map: texture,
  //         side: THREE.DoubleSide,
  //     });
  //     const mesh = new THREE.Mesh(planeGeo, planeMat);
  //     mesh.rotation.x = Math.PI * - .5;
  //     scene.add(mesh);

  // }

  {
    const skyColor = 0xb1e1ff // light blue
    const groundColor = 0xb97a20 // brownish orange
    const intensity = 2
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    scene.add(light)
  }

  {
    // const color = 0xffffff
    // const intensity = 2.5
    // const light = new THREE.DirectionalLight(color, intensity)
    // light.position.set(0, 10, 0)
    // light.target.position.set(-5, 0, 0)
    scene.add(outLight)
    scene.add(outLight.target)
  }

  {
    const mtlLoader = new MTLLoader()
    mtlLoader.load(`${THREE_URL}/Nature.mtl`, (mtl) => {
      mtl.preload()
      const objLoader = new OBJLoader()
      objLoader.setMaterials(mtl)
      objLoader.load(`${THREE_URL}/Nature.obj`, (root) => {
        root.rotation.set(-0.1, 0.7, -0.0)
        root.scale.set(1.5, 1.5, 1.5)
        root.position.set(-9.8, 0.2, -5)
        scene.add(root)
      })
    })
  }
  {
    const mtlLoader = new MTLLoader()
    mtlLoader.load(`${THREE_URL}/Nature.mtl`, (mtl) => {
      mtl.preload()
      const objLoader = new OBJLoader()
      objLoader.setMaterials(mtl)
      objLoader.load(`${THREE_URL}/Nature.obj`, (root) => {
        root.rotation.set(0, -2.4, 0)
        root.scale.set(1.2, 1.2, 1.2)
        root.position.set(2.0, -0.6, 13.3)
        scene.add(root)
      })
    })
  }
  {
    const mtlLoader = new MTLLoader()
    mtlLoader.load(`${THREE_URL}/WoodHouse.mtl`, (mtl) => {
      mtl.preload()
      const objLoader = new OBJLoader()
      objLoader.setMaterials(mtl)
      objLoader.load(`${THREE_URL}/WoodHouse.obj`, (root) => {
        root.scale.set(3, 3, 3)
        root.rotation.set(0, -0.5, 0.02)
        // root.scale.set(0.2, 0.2, 0.2)
        root.position.set(-8.6, 0.2, 3)
        scene.add(root)
      })
    })
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
})


</script>

<template>
  <canvas id="c"></canvas>
  <!-- <div class="btn">
    <button @mousedown="x1++">+</button>
    <span>x轴 {{x1}}</span>
    <button @mousedown="x1--">-</button>
  </div>
  <div class="btn">
    <button @mousedown="y1++">+</button>
    <span>y轴 {{y1}}</span>
    <button @mousedown="y1--">-</button>
  </div>
  <div class="btn">
    <button @mousedown="z1++">+</button>
    <span>z轴 {{z1}}</span>
    <button @mousedown="z1--">-</button>
  </div>
  <p>
      <el-slider @input='changeX' :model-value=10 class="slider" :max=20 :min=0 />
      <el-slider @input='changeY' :model-value=10 class="slider" :max=20 :min=0 />
      <el-slider @input='changeZ' :model-value=10 class="slider" :max=20 :min=0 />
    </p> -->
</template>

<style scoped>
#c {
  width: 100%;
  vertical-align: bottom;
  background-image: linear-gradient(2deg,
      #0e1606,
      #214932 15%,
      #449674 30%,
      #6cf 31%,
      #0000 55%);
  line-height: 0;
}

.flex {
  display: flex;
}

.btn {
  height: 30px;
  margin-left: 10px;
  display: inline-block;
  background-color: #fff;
  border: 2px solid #ccc;
  padding: 0 8px;

  span {
    padding: 0 8px;
  }
}

.slider {
  display: inline-block;
  margin-top: 8px;
  margin-left: 12px;
  width: 115px;
  height: 20px;
  padding-top: 7px;
  background-color: #fff;
  border: 2px solid #ccc;
}

.slider_row {
  display: flex;

  span {
    display: inline-block;
    width: 30px;
  }
}
</style>

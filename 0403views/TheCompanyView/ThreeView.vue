<script setup lang="ts">
import { ref, h, watch, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { ElNotification } from "element-plus";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { THREE_URL } from "../../constant/url";
import * as TWEEN from "@tweenjs/tween.js";
import modelDataMap from "./modelMap_mini.json";
import { cloneDeep } from "lodash";
// import modelDataMap from './modelMap.json'

const props = defineProps(["introduce"]);

let base;
let loading = ref(0);
let loadText = ref("");
const CanvasDom = ref(null);
const ControlsDom = ref(null);
const gltfLoader = new GLTFLoader();
let hover = "";
// let activeBody = '';
let active = ref<{ label: string; value: string }[]>([]);
let isLeft = true; // 是否逆时针围绕主体旋转
let isClick = false; // 是否是点击
let isDown = false; // 鼠标是否按下
let disabled = true; // 是否禁止互动(主体切换时)
let canvasMoveTime = 0;

// const bodyText = ref<Record<"title" | "sub" | "content", string>>({
//   title: "",
//   sub: "专注母猪产后护理80年",
//   content:
//     "拥有专业的技术拥有专业的技术拥有专业技术拥术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术拥有专业的技术",
// });
// let bodyTextAnimation = ref(false);
// 右上角介绍框
// const introduce = (name: string, cn_name?: string) => {
//   bodyText.value.title = "";
//   setTimeout(() => {
//     bodyText.value.title = cn_name;
//   }, 0);
//   bodyTextAnimation.value = true;
// };

type viewType = "top" | "left" | "front";
type bodyLevelType = {
  index: number[];
  floor: Record<string, string | boolean>;
  item: Record<string, Record<string, string | boolean>>;
};
const viewAct = ref<viewType | "">("");
const viewMap: Record<viewType, string> = {
  top: "俯视",
  left: "左侧",
  front: "正面",
  // animation: "漫游",
};

let bodyList = Object.keys(modelDataMap); // TODO: 后续用这个属性储存，modelList作为指针。
let floorList: string[] = []; // TODO: 后续用这个属性储存，modelList作为指针。
let itemList: string[] = [];
let detailList: string[] = [];
let actFloor: number = -1;

let modelList = Object.keys(modelDataMap);

// THREE对象实例
const cameraPosition = new THREE.Vector3(); // 摄像机位置
const box3 = new THREE.Box3(); // 模型尺寸, 使用时相关代码会重复一次

const reModelMaterialOption = {
  color: 0x004444,
  transparent: true,
  opacity: 0.5,
  depthWrite: false,
};

const reLineMaterialOption = {
  color: 0x00ffff,
  transparent: true,
};

// 摄像机移动
const tweenViewTiggle = (
  {
    position,
    at,
  }: { position: [number, number, number]; at: [number, number, number] },
  time?: number
) => {
  const initPosition = cameraPosition.setFromMatrixPosition(
    CanvasDom.value.matrixWorld
  );
  const distanceMap = {
    x: Math.abs(position[0] - initPosition.x),
    y: Math.abs(position[1] - initPosition.y),
    z: Math.abs(position[2] - initPosition.z),
  };
  const distance = Math.sqrt(
    distanceMap.x ** 2 + distanceMap.y ** 2 + distanceMap.z ** 2
  );

  disabled = true;
  canvasMoveTime = distance * 20;
  {
    const R = 100;
    const [x, y, z] = position;
    new TWEEN.Tween(CanvasDom.value.position)
      .to({ x, y, z }, time || distance * 20)
      .start()
      .easing(TWEEN.Easing.Quadratic.Out);
  }
  {
    const [x, y, z] = at;
    new TWEEN.Tween(ControlsDom.value.target)
      .to({ x, y, z }, time || distance * 20)
      .onUpdate(ControlsDom.value.update)
      .start()
      .easing(TWEEN.Easing.Quadratic.Out);
  }
  setTimeout(() => {
    disabled = false;
  }, time || distance * 20);

  return distance * 20;
};

const tweenTargetTiggle = (
  target: any,
  door: "left" | "bottom" | undefined,
  magnify: number = 1
) => {
  var { min, max } = box3.setFromObject(target); // 对象尺寸，使用会导致重复
  const x = (max.x + min.x) / 2;
  const y = (max.y + min.y) / 2;
  const z = (max.z + min.z) / 2;

  // 先拉远介绍，等加载完成楼层之后，再拉近
  const size = magnify;
  let elapsed;
  let toX = x + (isLeft ? 30 : -30) * size;
  let toY = y + 20 * size;
  let toZ = z + 60 * size;
  if (door === "left") {
    toX = x - 60 * size * size;
    toZ = z + (isLeft ? 30 : -30);
  }

  elapsed = tweenViewTiggle({
    position: [toX, toY, toZ],
    at: [x, y, z],
  });
  isLeft = !isLeft;
  return { elapsed, position: { x: toX, y: toY, z: toZ }, at: { x, y, z } };
};

// 添加建筑标签
function makeLabelCanvas(baseWidth, names) {
  const borderSize = 6;
  const ctx = document.createElement("canvas").getContext("2d");
  // measure how long the names will be
  const textWidth = ctx.measureText(names).width / names.length;

  const doubleBorderSize = borderSize * 8;
  const width = baseWidth + doubleBorderSize + 100;
  //   const width = baseWidth + doubleBorderSize
  const height = doubleBorderSize + 50;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.fillStyle = "#66ccff16";
  ctx.fillRect(0, 0, width, height);

  ctx.beginPath();
  ctx.strokeStyle = "#6cf";
  ctx.lineWidth = 1;
  ctx.moveTo(0, 1);
  ctx.rect(0, 0, width, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#9ef";
  ctx.rect(4, 4, 4, height);
  ctx.rect(width - 15, 4, 4, height / 3);
  ctx.rect(width - 30, 4, 4, height / 6);
  ctx.stroke();

  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.rect(width - 30, height - 10, 40, height / 2);
  ctx.stroke();

  // scale to fit but don't stretch
  const scaleFactor = Math.min(1, baseWidth / textWidth);
  ctx.translate(50, height / 2);
  ctx.scale(scaleFactor, 1);

  ctx.font = `30px bold sans-serif`;
  ctx.fillStyle = "#6cf";
  ctx.fillText(names[0], 0, -5);

  ctx.font = `20px bold sans-serif`;
  ctx.fillStyle = "#6cf9";
  ctx.fillText(names[1], 0, 25);
  //   name.forEach((t, i) => ctx.fillText(t, 0, -size / 2 + i * (size + 20)))

  return ctx.canvas;
}

// 特殊标签
// function makeLabelCanvas_light(){

// }

// 添加标签
function createLabel(type: "body" | "floor", list = modelList) {
  modelList.map((key) => {
    const obj = base.children.find((e) => e.name === key);
    // const data = modelDataMap[key]
    const { min, max } = box3.setFromObject(obj); // 对象尺寸，使用会导致重复
    let canvas;
    if (type === "body")
      canvas = makeLabelCanvas(obj.cn_name.length * 30, [
        obj.cn_name,
        obj.name,
      ]);
    if (type === "floor")
      canvas = makeLabelCanvas(obj.cn_name.length * 30, [
        obj.name.slice(-2),
        active.value[0].label,
      ]);
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });
    const label = new THREE.Sprite(labelMaterial);
    let magnification = 0.1 * (obj.size * 1.6 || 1);
    if (type === "floor") magnification *= 0.8;
    label.scale.x = canvas.width * magnification;
    label.scale.y = canvas.height * magnification;
    label.position.y = type === "floor" ? max.y : max.y + 5;
    label.position.x = min.x - 5;
    label.position.z = max.z + 5;
    //   label.position.y = 40
    label.isLabelModel = true;
    label.target = obj.name;
    label.name = obj.name;
    base.add(label);
  });
}

// 删除标签
function removeLabel() {
  base.children.forEach((e) =>
    setTimeout(() => {
      e.isLabelModel && base.remove(e);
    })
  );
}

// 添加模型
const addModel = ({
  scene,
  obj,
  parentName,
  isRender = false,
  isEmpty = false,
  type,
  level,
  name,
  cn_name,
  size = 1,
  url,
  floor,
  option,
  geometryOption,
}: {
  scene: any; // 场景实例
  obj: any; // 白模实例
  parentName?: string; // 主体标识
  isRender: boolean; // 是否加载材质
  isEmpty: boolean; // 是否地面(一般不加载)
  type: "glb" | "obj" | "cylinder";
  level: "body" | "floor" | "item"; // 结构级别
  name: string; // 标识
  cn_name: string; // 中文名
  size?: number; // 模型尺寸
  floor?: number; // 楼层(主体内部)
  url?: string; // 模型路径
  option: {
    // 变形
    scales?: number;
    scale?: { x?: number; y?: number; z?: number };
    rotation?: { x?: number; y?: number; z?: number };
    position?: { x?: number; y?: number; z?: number };
  };
  geometryOption?: {
    // 形状创建
    cylinder: {
      radius: number;
      height: number;
    };
  };
}) => {
  const shape = (target) => {
    if (option.scales)
      target.scale.set(option.scales, option.scales, option.scales);
    if (option.scale?.x) target.scale.x = Math.PI * option.scale.x;
    if (option.scale?.y) target.scale.y = Math.PI * option.scale.y;
    if (option.scale?.z) target.scale.z = Math.PI * option.scale.z;
    if (option.rotation?.x) target.rotation.x = Math.PI * option.rotation.x;
    if (option.rotation?.y) target.rotation.y = Math.PI * option.rotation.y;
    if (option.rotation?.z) target.rotation.z = Math.PI * option.rotation.z;
    if (option.position?.x) target.position.x = option.position.x;
    if (option.position?.y) target.position.y = option.position.y;
    if (option.position?.z) target.position.z = option.position.z;
  };

  // const name = isRender ? initName : initName
  return new Promise((resolve) => {
    if (type === "glb") {
      gltfLoader.load(`${THREE_URL}/${url}.glb`, (root) => {
        root.scene.traverse(function (obj) {
          if (obj.isMesh && isRender === false) {
            // 模型材质重新设置
            obj.material = new THREE.MeshLambertMaterial(reModelMaterialOption);
            // 模型边线设置
            const edges = new THREE.EdgesGeometry(obj.geometry);
            const edgesMaterial = new THREE.LineBasicMaterial(
              reLineMaterialOption
            );
            const line = new THREE.LineSegments(edges, edgesMaterial);
            // if (parentName) line.parentName = parentName;
            obj.add(line);
          }
        });

        shape(root.scene);
        resolve([name, root.scene]);
        root.scene.level = level;
        root.scene.name = name;
        root.scene.cn_name = cn_name;
        root.scene.size = size;
        root.scene.isRender = isRender;
        root.scene.isEmpty = isEmpty;
        if (floor) root.scene.floor = floor;
        if (parentName) root.scene.parentName = parentName;
        scene.add(root.scene);
        if (obj) obj.visible = false;
        // root.scene.visible = false;  // mark

        // {
        //   const canvas = makeLabelCanvas(120, ['发电机组', '阿达十多万'])
        //   const texture = new THREE.CanvasTexture(canvas)
        //   const labelMaterial = new THREE.SpriteMaterial({
        //     map: texture,
        //     transparent: true
        //   })
        //   const label = new THREE.Sprite(labelMaterial)
        //   scene.add(label)

        //   label.scale.x = canvas.width * 0.1
        //   label.scale.y = canvas.height * 0.1
        //   label.position.y = 30
        //   if (option.position?.x) label.position.x = option.position.x
        //   if (option.position?.z) label.position.z = option.position.z
        //   //   label.position.y = 40
        // }
      });
    }

    if (type === "cylinder") {
      const radiusTop = geometryOption && geometryOption.cylinder.radius;
      const radiusBottom = geometryOption && geometryOption.cylinder.radius;
      const height = geometryOption && geometryOption.cylinder.height;
      const radialSegments = 12;
      const geometry = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        radialSegments
      );
      const mesh = new THREE.Mesh(geometry);
      if (mesh.isMesh) {
        if (isRender === false) {
          // 模型材质重新设置
          mesh.material = new THREE.MeshLambertMaterial(reModelMaterialOption);
          // mesh.material = new THREE.MeshLambertMaterial({
          //     color: 0x004444,
          //     transparent: true,
          //     opacity: 0.5,
          // });

          // 模型边线设置
          const edges = new THREE.EdgesGeometry(mesh.geometry);
          const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
          });
          const line = new THREE.LineSegments(edges, edgesMaterial);
          mesh.add(line);
        }
      }
      shape(mesh);
      resolve([name, mesh]);
      mesh.level = level;
      mesh.name = name;
      mesh.cn_name = cn_name;
      mesh.size = size;
      mesh.isRender = isRender;
      mesh.isEmpty = isEmpty;
      if (floor) mesh.floor = floor;
      if (parentName) mesh.parentName = parentName;
      scene.add(mesh);
      if (obj) obj.visible = false; // mark
      // mesh.visible = false  // mark
    }
  });
};

const removeModel = (type: "body" | "floor" | "item") => {
  base.children.forEach((e) => {
    e.level === type &&
      setTimeout(() => {
        base.remove(e);
      });
  });
};

// 监听active改变(销毁的逻辑)
const watchAvtive = async (scene: any) => {
  //   const FloorData = {} // 楼层信息
  switch (active.value.length) {
    case 0: {
      floorList = [];
      itemList = [];
      actFloor = -1;
      modelList = bodyList;
      removeLabel();
      createLabel("body");
      removeModel("floor");
      removeModel("item");
      props.introduce(); // 销毁介绍

      tweenViewTiggle({ position: [0, 30, 100], at: [0, 5, 0] }, 1500);
      // TODO: 销毁楼层

      break;
    }
    case 1: {
      // 销毁或复原：
      itemList = [];
      actFloor = -1;
      modelList = floorList;
      removeLabel();
      removeModel("item");
      const targetName = active.value[0].value;
      const target = scene.children.find(({ name }) => name === targetName);
      const bodyData = modelDataMap[targetName]; // 主体信息
      itemList = [];
      actFloor = -1;

      // 修改介绍
      const { name, cn_name } = bodyData;
      props.introduce("base", { name, cn_name });

      // 摄像机目标切换
      tweenTargetTiggle(target, bodyData.door);

      // 创建floor楼层
      {
        const children = bodyData?.children || [];
        if (floorList.length) {
          modelList = floorList;
          createLabel("floor"); // 标签
          return;
        }
        if (children.length) {
          children.forEach((floorModel: any) => {
            const { index, floor: floorData } = floorModel;
            index.forEach((i) => {
              const option = cloneDeep(bodyData.option); // 获取主体位置信息
              option.position.y = (option.position.y || 0) + 4.3 * i; // 获取楼层间距
              Promise.all(
                [false, true].map((bool) =>
                  addModel({
                    scene,
                    ...floorData,
                    name: floorData.name + i,
                    cn_name: floorData.cn_name + i,
                    floor: i,
                    size: 0.2,
                    option,
                    isRender: bool,
                    parentName: bodyData.name,
                  })
                )
              ).then((e) => {
                const floor: string = e[0][0];
                floorList.push(floor);
                modelList = floorList;
                createLabel("floor"); // 标签
              });
            });
          });
        }
      }
      break;
    }
    case 2: {
      // 销毁
      removeLabel();
      // TODO: 显示模块化动画
      const floorName = active.value[1].value;
      const bodyName = active.value[0].value;
      const thisFloorObj = scene.children.find(
        ({ name }) => name === floorName
      );
      const bodyData = modelDataMap[thisFloorObj.parentName]; // 主体信息

      tweenTargetTiggle(thisFloorObj, bodyData.door, bodyData.size * 0.6);
      actFloor = +floorName.slice(-1);

      // 创建item模型
      const children = bodyData?.children || [];
      // if (floorList.length) {
      //     modelList = floorList;
      //     createLabel("floor"); // 标签
      //   return;
      // }

      if (children.length) {
        children.forEach((floorModel: any) => {
          const { item: itemMap } = floorModel;
          const option = cloneDeep(bodyData.option); // 获取主体位置信息
          option.position.y = (option.position.y || 0) + 4.3 * actFloor; // 获取楼层间距
          [false, true].forEach((bool, boolIndex) => {
            Promise.all(
              Object.keys(itemMap).map((item) =>
                addModel({
                  scene,
                  ...itemMap[item],
                  floor: actFloor,
                  size: 0.2,
                  option,
                  isRender: bool,
                  parentName: bodyData.name,
                })
              )
            ).then((list) => {
              if (boolIndex === 0) return;
              list.forEach((res: any) => {
                const [name, itemObj] = res;
                name !== "box" && itemList.push(name);

                // 标签
                itemObj.children.map((obj, i) => {
                  obj.index = i;
                  obj.name = name + "_inner";
                  const { min, max } = box3.setFromObject(obj); // 对象尺寸，使用会导致重复
                  let canvas = makeLabelCanvas(itemObj.cn_name.length * 30, [
                    itemObj.cn_name,
                    name,
                  ]);
                  const texture = new THREE.CanvasTexture(canvas);
                  const labelMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                  });
                  const label = new THREE.Sprite(labelMaterial);
                  label.scale.x = canvas.width * 0.01;
                  label.scale.y = canvas.height * 0.01;
                  label.position.y = max.y + 1;
                  label.position.x = (min.x + max.x) / 2;
                  label.position.z = (min.z + max.z) / 2;
                  //   label.position.y = 40
                  label.isLabelModel = true;
                  label.name = name;
                  label.cn_name = itemObj.cn_name;
                  // label.index = i;
                  scene.add(label);
                });
              });
            });
          });
          modelList = itemList;
        });
      }
    }
  }
};

watch(active, () => watchAvtive(base), { deep: true });

// 监听hover变化
const watchHover = (scene, hover) => {
  // 线透明度
  const findLine = (arr, opacity) => {
    arr.forEach((e) => {
      if (e.isLine) {
        e.material.opacity = opacity;
      } else if (e.children) {
        findLine(e.children, opacity);
      } else {
        console.log("这儿怕是没有");
      }
    });
  };

  // 模型透明度
  const findMaterial = (arr, opacity) => {
    arr.forEach((e) => {
      if (e.material) {
        e.material.transparent = true;
        e.material.opacity = opacity;
      } else if (e.children) {
        findMaterial(e.children, opacity);
      } else {
        console.log("这儿怕是没有");
      }
    });
  };

  // 透明度
  const opacityAll = (
    opacity: {
      level?: string;
      name?: string;
      isHideHigh?: boolean;
    },
    material: number | null = null,
    line?: number
  ) => {
    const target = scene.children.filter(({ level, name }) => {
      const hasName = name === opacity.name;
      const hasLevel = level === opacity.level;
      if (opacity.name && opacity.level) {
        return hasName && hasLevel;
      } else if (opacity.level) {
        return hasLevel;
      } else if (opacity.name) {
        return hasName;
      }
    });

    if (opacity.isHideHigh) {
      target.forEach((e) => {
        if (e.floor > active.value[1].value.slice(-1)) e.visible = false;
      });
    }
    if (material === null) {
      target.forEach((e) => {
        e.visible = false;
      });
      return;
    }
    if (line !== undefined) findLine(target, line);
    if (material) findMaterial(target, material);
  };

  // 切换显隐
  const showAll = (isReverse: boolean = true) => {
    scene.children
      .filter(({ isRender }) => isRender === false)
      .forEach((e) => (e.visible = isReverse ? false : true));
    scene.children
      .filter(({ isRender }) => isRender === true)
      .forEach((e) => (e.visible = isReverse ? true : false));
  };

  // 主体显隐
  const showTarget = (
    targetNameList: string[],
    actFloor?: number,
    isReverse: boolean = true
  ) => {
    const hoverArr = scene.children.filter(({ name, floor }) => {
      const hasName = targetNameList.includes(name);
      if (actFloor) return hasName && floor === actFloor;
      return hasName;
    });
    if (hoverArr.length) {
      hoverArr.forEach(
        (e) => (e.visible = isReverse ? !e.isRender : e.isRender)
      );
    }
  };

  switch (active.value.length) {
    case 0: {
      showAll();
      showTarget([hover]);
      opacityAll({ level: "body" }, 1, 1);
      break;
    }
    case 1: {
      const bodyName = active.value[0].value;
      showAll();
      showTarget([bodyName]);
      // showTarget([...modelList, targetName])
      //   opacityAll({ level: 'floor' }, 0.2, 0.3)

      // 如果有内部结构，则主体半透明
      if (floorList.length > 0) {
        opacityAll({ level: "body" }, 0.1, 0.1);
        opacityAll({ level: "item" });
        opacityAll({ name: hover }, 0.5, 1);
      }
      if (floorList.includes(hover)) showTarget([hover]); // 如果楼层被选中，则显影楼层
      break;
    }
    case 2: {
      // 主体隐藏，其他楼层淡化(先隐藏)
      const bodyName = active.value[0].value;
      const floorName = active.value[1].value; // 楼层名
      showTarget([...itemList, ...floorList]);
      opacityAll({ level: "body", name: bodyName }, 0.01);
      opacityAll({ level: "floor", isHideHigh: true }, 0.02, 0.2);
      opacityAll({ level: "item" });

      showTarget(itemList, actFloor, false);
      showTarget([hover], actFloor);
      // showTarget(itemList, false); // 如果楼层被选中，则显影楼层
      // 隐藏楼层的整体模型
      // let floor = 0;
      // scene.children
      //   .filter(({ name }) => name === floorName)
      //   .forEach((e) => {
      //     floor = e.floor;
      //     e.visible = false;
      //   });

      // // 显示楼层的具体细节模型
      // scene.children
      //   .filter(({ floor: F, level }) => F === actFloor && level === "item")
      //   .forEach((e) => {
      //     e.visible = true;
      //   });
      break;
    }
  }
};

onMounted(() => {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 400;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  CanvasDom.value = camera;
  // camera.position.set(0, 300, 0);
  camera.position.set(0, 50, 200);

  const controls = new OrbitControls(camera, canvas);
  ControlsDom.value = controls;
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  // scene.background = new THREE.Color('#000');

  base = scene;

  // const controls = new OrbitControls(camera, renderer.domElement)
  // controls.autoRotate = true

  {
    const radius = 20;
    const segments = 45;
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, segments));
    // const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    mesh.scale.set(10, 7, 5);
    mesh.position.set(0, 0, 25);
    // mesh.name = "box";

    mesh.material.color.set(0x808080);
    mesh.material.transparent = true;
    mesh.material.opacity = 0.95;
    scene.add(mesh);
  }

  // {
  //   let canvas = makeLabelCanvas(itemObj.cn_name.length * 30, [
  //                   itemObj.cn_name,
  //                   name,
  //                 ]);
  //                 const texture = new THREE.CanvasTexture(canvas);
  //                 const labelMaterial = new THREE.SpriteMaterial({
  //                   map: texture,
  //                   transparent: true,
  //                 });
  //                 const label = new THREE.Sprite(labelMaterial);
  //                 label.scale.x = canvas.width * 0.01;
  //                 label.scale.y = canvas.height * 0.01;
  //                 label.position.y = max.y + 1;
  //                 label.position.x = (min.x + max.x) / 2;
  //                 label.position.z = (min.z + max.z) / 2;
  //                 //   label.position.y = 40
  //                 label.isLabelModel = true;
  //                 label.name = name;
  //                 label.cn_name = itemObj.cn_name;
  //                 // label.index = i;
  //                 scene.add(label);
  // }

  {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 2;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xffffff;
    const intensity = 2.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
  }

  // 加载主体
  async function createBody() {
    const list = await Promise.all(
      Object.keys(modelDataMap).map((key) =>
        addModel({ scene, ...modelDataMap[key], level: "body" })
      )
    );
    loadText.value = "模型加载完成...";
    // ElNotification({
    //   title: "模型加载完成",
    //   duration: 2000,
    //   customClass: "tips_3d_inner",
    //   showClose: false,
    // });
    loading.value = 50;
    const map = Object.fromEntries(list as any);

    await Promise.all(
      Object.keys(modelDataMap).map((key) =>
        addModel({
          scene,
          obj: map[key],
          isRender: true,
          ...modelDataMap[key],
          level: "body",
        })
      )
    );
    createLabel("body");
    loadText.value = "贴图加载完成...";
    loading.value = 80;
    setTimeout(() => {
      loading.value = 100;
      disabled = false;
    }, 1000);
  }
  createBody();

  class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
    pick(normalizedPosition: { x: number; y: number }, scene, camera, time) {
      if (disabled) return;

      this.raycaster.setFromCamera(normalizedPosition, camera);
      const intersectedObjects = this.raycaster.intersectObjects(
        scene.children
      );
      if (intersectedObjects.length) {
        const obj = intersectedObjects[0].object;
        if (obj.name === "box") {
          hover = "";
          isClick = false;
          return;
        }

        let count = 0;
        const findParent: (obj: any) => any = (obj = {}) => {
          count++;
          if (count > 5) return null;
          if (obj === null) return null;
          const hasObj = [...modelList, "label"].includes(obj.name);
          // const hasObj = modelList.includes(obj.parentName || obj.name);
          if (!hasObj) {
            return findParent(obj.parent);
          } else {
            return obj;
          }
        };

        let hover_body: any;
        intersectedObjects.forEach(({ object }) => {
          if (hover_body) return;
          const res = findParent(object);
          if (res) hover_body = res;
          count = 0;
        });
        if (!hover_body) {
          isClick = false;
          return;
        }

        if (isClick) {
          console.log(hover_body.name);
        }

        if (
          active.value.at(-1)?.value !== hover_body.name &&
          active.value.length < 2 &&
          isClick
        ) {
          active.value.push({
            label: hover_body.cn_name,
            value: hover_body.name,
          });
          isClick = false;
        }

        if (isClick && active.value.length === 2) {
          const innerList = itemList.map((e) => e + "_inner");
          const res = intersectedObjects.find((e) => {
            return innerList.includes(e.object.name);
          });
          if (res?.object) tweenTargetTiggle(res.object, undefined, 0.2);
        }

        // hover
        if (hover !== hover_body.name && !isDown) {
          hover = hover_body.name;
          // console.log(hover_body);
          if (actFloor !== -1)
            props.introduce(hover_body.name, {
              name: hover_body.name,
              cn_name: hover_body.cn_name,
            });

          // TODO220
          // watchHover(scene, hover); // MARK: 存在异步，但推荐这里造钩子
        }

        // pick the first object. It's the closest one
        this.pickedObject = intersectedObjects;
      }
      isClick = false;
    }
  }

  const pickPosition = { x: 0, y: 0 };
  const pickHelper = new PickHelper();
  clearPickPosition();

  // 高清
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time: number) {
    time *= 0.001; // convert to seconds;
    // console.log(canvas.getBoundingClientRect());
    // console.log(scene.rotation);
    // scene.rotation.y += time * 0.0001

    // 高清
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // 计算此次调用距离上次调用间隔的时间
    // const detail = clock.getDelta();
    // console.log(detail);

    // // 更新摄像机的位置，为了保证平滑，我们必须传入精确的时间 detail
    // controls.update(detail)

    TWEEN.update();
    watchHover(scene, hover); // MARK: 模型及时刷新

    pickHelper.pick(pickPosition, scene, camera, time);

    // 监听active和hover

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function clearPickPosition() {
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width) * 2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1; // note we flip Y
  }

  window.addEventListener("mousedown", () => {
    isClick = true;
    isDown = true;
  });
  window.addEventListener("mouseup", () => (isDown = false));
  window.addEventListener("mousemove", setPickPosition);
  window.addEventListener("mouseout", clearPickPosition);
  window.addEventListener("mouseleave", clearPickPosition);
});

// function createCSS3DRenderer

const viewFnMap: Record<viewType, () => void> = {
  top: () => {
    viewAct.value = "top";
    tweenViewTiggle({ position: [0, 300, 0], at: [0, 5, 0] }, 1500);
  },
  left: () => {
    viewAct.value = "left";
    tweenViewTiggle({ position: [-150, 30, -10], at: [0, 5, -10] }, 1500);
  },
  front: () => {
    viewAct.value = "front";
    tweenViewTiggle({ position: [0, 50, 200], at: [0, 5, 0] }, 1500);
  },
};

onBeforeUnmount(() => {
  console.log("销毁了！");
});

const cleanActive = (to: "back" | "home") => {
  hover = "";
  if (to === "home") active.value = [];
  if (to === "back") active.value.pop();
};

const loadTime = setInterval(() => {
  loading.value += 3;
  if (loading.value > 95) clearInterval(loadTime);
}, 80);
</script>

<template>
  <main>
    <canvas id="c"></canvas>
    <div class="loading" v-if="loading < 100">
      <div class="textBox">
        <div class="title">进度载入中... {{ loading }}%</div>
        <div class="bar">
          <div class="inner" :style="{ width: loading + '%' }"></div>
          <div class="innerRight"></div>
          <p>{{ loadText }}</p>
        </div>
      </div>
    </div>
    <div class="btnl">
      <button @click="console.log(base.children)">children</button>
      <button @click="console.log(active)">active</button>
      <button @click="console.log(modelList)">modelList</button>
    </div>
    <header>
      <nav>
        <li @click="cleanActive('home')">正泰 楼宇设备联动系统</li>
        <li v-if="active[0]" @click="active[1] && cleanActive('back')">
          {{ active[0].label }}
        </li>
        <li v-if="active[1]">{{ active[1].label }}</li>
      </nav>
      <ul class="option" v-if="loading === 100">
        <li v-for="key in Object.keys(viewMap)" @click="viewFnMap[key]">
          {{ viewMap[key] }}
        </li>
      </ul>
    </header>
  </main>
</template>

<style scoped>
.btnl {
  position: absolute;
  left: 0;
  top: 50px;
  z-index: 50;
}

.loading {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #1c3a47;
  background-image: radial-gradient(
    ellipse at top,
    rgb(70, 114, 141),
    rgb(53, 84, 143),
    rgb(48, 25, 110)
  );

  .textBox {
    position: absolute;
    width: 500px;
    height: 100px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .title {
    color: rgb(76, 201, 250);
    font-weight: bold;
    font-size: 30px;
    text-align: center;
  }

  .bar {
    overflow: hidden;
    position: relative;
    margin-top: 20px;
    height: 20px;
    width: 100%;
    border-radius: 10px;
    outline: 1px solid #00ffff;
    border: 2px solid #1c3a47;
    border-top: #6cf;
  }

  p {
    position: absolute;
    top: 0;
    left: 12px;
    font-size: 12px;
    color: #fff6;
  }

  .inner {
    display: inline-block;
    height: 100%;
    width: 0%;
    background-color: rgb(0, 238, 255);
    background-image: linear-gradient(
      90deg,
      rgba(12, 16, 75, 0.473),
      rgba(12, 16, 75, 0.473)
    );
    transition: width 0.3s;
  }

  .innerRight {
    display: inline-block;
    height: 100%;
    width: 50px;
    background-color: rgb(0, 238, 255);
    background-image: linear-gradient(
      90deg,
      rgba(12, 16, 75, 0.473),
      rgba(21, 109, 82, 0.39)
    );
  }
}

#c {
  width: 100%;
  height: 100%;
  vertical-align: bottom;
  background-image: linear-gradient(
    rgb(20, 10, 61),
    rgb(10, 55, 61),
    rgb(30, 97, 80) 50%,
    rgba(27, 38, 56, 0.932) 70%,
    rgb(60, 31, 71)
  );
  line-height: 0;
}

#tag {
  width: 200px;
  height: 100px;
  color: #fff;
  font-weight: 800;
  padding: 0px 10px;
  background-color: #00ffff;
  border: #00ffff solid 1px;
  height: 40px;
  border-radius: 5px;
  width: 65px;
}

main {
  position: relative;
  /* background-color: #000; */
  height: 100%;
}

header {
  position: absolute;
  top: 0;
  left: 0;
  height: 45px;
  width: 50%;
  background-color: rgb(8, 44, 99);
  background-image: linear-gradient(
    180deg,
    rgba(0, 217, 255, 0.068),
    rgba(135, 158, 236, 0.178)
  );
  border-bottom: 2px solid rgba(8, 2, 85, 0.384);
  box-shadow: 0 3px 12px -2px rgba(102, 204, 255, 0.432);
  z-index: 10;

  &::after {
    display: block;
    content: "";
    position: absolute;
    right: -52px;
    top: -22px;
    height: 100%;
    width: 80px;
    background-color: rgb(8, 44, 99);
    background-image: linear-gradient(
      -167deg,
      rgba(0, 217, 255, 0.068),
      rgba(135, 158, 236, 0.178)
    );
    box-shadow: -30 0px 12px -2px rgba(102, 204, 255, 0.432);
    transform: rotateZ(-45deg);
    box-shadow: 1px 9px 9px -9px rgba(102, 255, 255, 0.877);
    z-index: 9;
  }
}

nav {
  position: absolute;
  top: 6px;
  left: 26px;
  display: flex;

  li {
    font-size: 20px;
    user-select: none;
    font-weight: bold;
    color: #3fe9;
    padding-left: 8px;
    cursor: pointer;

    &:hover {
      color: #3fe;
    }

    &::after {
      content: ">";
      padding-left: 8px;
    }

    &:last-child {
      cursor: default;
    }

    &:last-child::after {
      content: none;
    }

    &:last-child:hover {
      color: #3fe9;
    }
  }
}

ul.option {
  position: absolute;
  text-align: center;
  display: flex;
  justify-content: space-between;
  width: 200px;
  /* width: calc(25vw + 24px); */
  top: 60px;
  left: 20px;
  /* left: calc(100% + 50px); */

  li {
    user-select: none;
    cursor: pointer;
    width: 56px;
    height: 30px;
    line-height: 26px;
    font-size: 12px;
    border-radius: 20px;
    border-top-left-radius: 0px;
    border-bottom-right-radius: 0px;
    color: #6cf;
    background-color: rgb(8, 44, 99);
    border-bottom: 2px solid rgba(8, 2, 85, 0.384);
  }

  li.activeBody,
  li:hover {
    color: #3fe;
    background-color: #3fe6;
  }
}
</style>

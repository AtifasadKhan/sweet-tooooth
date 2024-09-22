import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const camera = new THREE.PerspectiveCamera(
  7,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 13;

const scene = new THREE.Scene();
let candy;
let mixer;

const loader = new GLTFLoader();
loader.load(
  '/mew.glb',

  function (gltf) {
    candy = gltf.scene;

    scene.add(candy);
    console.log(gltf.animations);
    mixer = new THREE.AnimationMixer(candy);
    mixer.clipAction(gltf.animations[1]).play();
    modelMove();
  },
  function (xhr) {},
  function (error) {}
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.01);
};
reRender3D();

let arrPositionModel = [
  {
    id: 'one',
    position: { x: 0.3, y: -1, z: 0.7 },
    rotation: { x: 0, y: 0.3, z: 0 },
  },
  {
    id: 'two',
    position: { x: -0.2, y: -1, z: -1.3 },
    rotation: { x: 0, y: -2, z: 0 },
  },
  {
    id: 'three',
    position: { x: 0, y: -0.7, z: -2 },
    rotation: { x: 0, y: 0.7, z: 0 },
  },
  {
    id: 'four',
    position: { x: -0.5, y: -0.8, z: -1 },
    rotation: { x: 0.2, y: -2, z: 0 },
  },
];

const modelMove = () => {
  const sections = document.querySelectorAll('.atif');
  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });
  let position_active = arrPositionModel.findIndex(
    (val) => val.id == currentSection
  );
  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];
    gsap.to(candy.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: 'power1.out',
    });
    gsap.to(candy.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 3,
      ease: 'power1.out',
    });
  }
};
window.addEventListener('scroll', () => {
  if (candy) {
    modelMove();
  }
});

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

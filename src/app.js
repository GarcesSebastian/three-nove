import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg-canvas'), antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const loader = new GLTFLoader();
let model;

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
progressBar.style.width = '0%';
progressText.innerText = '0%';

loader.load(
  '/src/supernova-2.glb',
  function (gltf) {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    scene.add(model);
    document.getElementById('loading-screen').style.display = 'none';
  },
  function (xhr) {
    const percentLoaded = (xhr.loaded / xhr.total * 100);
    progressBar.style.width = `${percentLoaded}%`;
    progressText.innerText = `${Math.round(percentLoaded)}%`;
    console.log(`${percentLoaded.toFixed(2)}% loaded`);
  },
  function (error) {
    console.log('An error occurred while loading the model');
  }
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = true; 

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    const randomRotation = Math.random() * 0.02;
    model.rotation.y += randomRotation;
    model.rotation.x += randomRotation;
    model.rotation.z += randomRotation;
  }
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
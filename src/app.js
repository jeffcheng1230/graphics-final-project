/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';

import { World, Body, Plane, Material } from 'cannon-es';

// =========================================

const world = new World();
world.gravity.set(0, -9.82, 0);
const frictionlessMaterial = new Material("frictionless");
frictionlessMaterial.friction = 0;
frictionlessMaterial.restitution = 0;
// const ground = new Body({
//   mass: 0, // mass = 0 makes it static
//   shape: new Plane(new Vector3(1, 0, 0), -50),
//   material: frictionlessMaterial
// });
// ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Match the Three.js plane rotation
// world.addBody(ground);

const geometry = new PlaneGeometry(5, 5); // Width, Height
const material = new MeshBasicMaterial({ color: 0x00ff00, side: DoubleSide }); // Green color
const plane = new Mesh(geometry, material);
// plane.position.copy(ground.position);
// plane.quaternion.copy(ground.quaternion);

// ==========================================

// Initialize core ThreeJS components
const scene = new SeedScene(world);
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// ====
scene.add(plane);
// ====

// Set up camera
camera.position.set(-40, 2, 0);
// camera.lookAt(new Vector3(0, 50, 0));
camera.lookAt(new Vector3(0, 0, 50));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = 4;
// controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

function handleImpactEvents(event) {
  if (event.target.tagName === "INPUT") {
    return;
  }

  // Person 1
  if (event.key == "ArrowUp") {
    scene.state.person1.upArrow = true;
  }
  else if (event.key == "ArrowLeft") {
    scene.state.person1.leftArrow = true;
  }
  else if (event.key == "ArrowRight") {
    scene.state.person1.rightArrow = true;
  }

  // Person 2
  if (event.key == "w") {
    scene.state.person2.wKey = true;
  }
  else if (event.key == "a") {
    scene.state.person2.aKey = true;
  }
  else if (event.key == "d") {
    scene.state.person2.dKey = true;
  }
}

function handleReleaseEvents(event) {
  if (event.target.tagName === "INPUT") {
    return;
  }

  // Person 1
  if (event.key == "ArrowUp") {
    scene.state.person1.upArrow = false;
  }
  else if (event.key == "ArrowLeft") {
    scene.state.person1.leftArrow = false;
  }
  else if (event.key == "ArrowRight") {
    scene.state.person1.rightArrow = false;
  }

  // Person 2
  if (event.key == "w") {
    scene.state.person2.wKey = false;
  }
  else if (event.key == "a") {
    scene.state.person2.aKey = false;
  }
  else if (event.key == "d") {
    scene.state.person2.dKey = false;
  }
}

window.addEventListener("keydown", (e) => handleImpactEvents(e), false);
window.addEventListener("keyup", (e) => handleReleaseEvents(e), false);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

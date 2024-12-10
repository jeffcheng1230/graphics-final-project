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

import { World, Body, Plane, Vec3, Quaternion } from 'cannon-es';

// =========================================

const world = new World();
world.gravity.set(0, -9.82, 0);
const ground = new Body({
  mass: 0, // mass = 0 makes it static
  shape: new Plane(),
});
ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Match the Three.js plane rotation
world.addBody(ground);

const geometry = new PlaneGeometry(5, 5); // Width, Height
const material = new MeshBasicMaterial({ color: 0x00ff00, side: DoubleSide }); // Green color
const plane = new Mesh(geometry, material);
plane.position.copy(ground.position);
plane.quaternion.copy(ground.quaternion);

// ==========================================

// Initialize core ThreeJS components
const scene = new SeedScene(world);
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// ====
scene.add(plane);
// ====

// Set up camera
camera.position.set(-30, 0, 0);
camera.lookAt(new Vector3(0, 50, 0));

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

const UP = 1, DOWN = 2, RIGHT = 3, LEFT = 4, NONE = 0;
let keyPressed = NONE;
function handleImpactEvents(event) {
  if (event.target.tagName === "INPUT") {
    return;
  }

  if (event.key == "ArrowUp") {
    scene.state.person.keyPress = UP;
  }
  else if (event.key == "ArrowDown") {
    scene.state.person.keyPress = DOWN;
  }
  else if (event.key == "ArrowLeft") {
    scene.state.person.keyPress = LEFT;
  }
  else if (event.key == "ArrowRight") {
    scene.state.person.keyPress = RIGHT;
  }
  
  // if (scene.state.person.cubeBody != null) {
  //   const cubeBody = scene.state.person.cubeBody;
  //   if (event.key == "ArrowUp") {
  //     cubeBody.position.y += 3;
  //   }
  //   else if (event.key == "ArrowRight") {
  //     const axis = new Vec3(-1, 0, 0); // Axis of rotation (e.g., y-axis)
  //     const angle = Math.PI / 2;
  //     cubeBody.quaternion.setFromAxisAngle(axis, angle);
  //     cubeBody.position.z += 0.1;
  //   }
  //   else if (event.key == "ArrowLeft") {
  //     let axis = new Vec3(0, 1, 0); // Axis of rotation (e.g., y-axis)
  //     let angle = Math.PI;
  //     let quaternion1 = new Quaternion(0, 0, 0, 0);
  //     quaternion1.setFromAxisAngle(axis, angle);
  //     axis = new Vec3(-1, 0, 0); // Axis of rotation (e.g., y-axis)
  //     angle = Math.PI / 2;
  //     let quaternion2 = new Quaternion(0, 0, 0, 0);
  //     quaternion2.setFromAxisAngle(axis, angle);
  //     cubeBody.quaternion = quaternion1.mult(quaternion2);
  //     cubeBody.position.z -= 0.1;
  //   }
  // }
}
window.addEventListener("keydown", (e) => handleImpactEvents(e), false);
window.addEventListener("keyup", (e) => { scene.state.person.keyPress = NONE; }, false);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

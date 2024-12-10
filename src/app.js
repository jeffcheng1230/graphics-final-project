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

import { World, Body, Plane } from 'cannon-es';

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
camera.position.set(30, 30, 0);
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

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

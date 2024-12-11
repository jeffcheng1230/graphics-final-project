import { Group, TextureLoader, MeshPhongMaterial, AnimationMixer, AnimationClip,
	Quaternion, Clock, BoxGeometry, MeshBasicMaterial, Mesh, Vector3
 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Body, Box, Vec3, Material } from 'cannon-es';

class Person extends Group {
	constructor(parent, world) {
		// Call parent Group() constructor
		super();

		// Init state
		this.state = {
				gui: parent.state.gui,
		};

		this.name = 'person';

		var model;

		// Load object
		const loader = new GLTFLoader();
		loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb', (gltf) => {
			model = gltf.scene;
			this.add(model);
			this.model = model;

			// Set the models initial scale, position, orientation
			model.scale.set(3, 3, 3);
			model.position.x = 0;
			model.position.y = 0;
			model.position.z = 0;
			// const angle = Math.PI;
			// const quaternion = new Quaternion(-1.0, 0.0, 0.0, angle); // quaternion (x, y, z, a) rotates the figure about the vector (x, y, z) by angle a
			// model.quaternion.copy(quaternion);

			// Load texture
			let stacy_txt = new TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg');
			stacy_txt.flipY = false; // we flip the texture so that its the right way up
			const stacy_mtl = new MeshPhongMaterial({
				map: stacy_txt,
				color: 0xffffff,
				skinning: true
			});
			model.traverse(o => {
				if (o.isMesh) {
					o.castShadow = true;
					o.receiveShadow = true;
					o.material = stacy_mtl; // Add this line
				}
			});

			// Animations
			this.mixer = new AnimationMixer(model);

			// Custom animation from Mixamo
			// Walking animation
			const fbxLoader = new FBXLoader();
			fbxLoader.load('./Walking.fbx', (animationObject) => {
				const animationClip = animationObject.animations[0]; // Assuming the animation file has one clip
				const action = this.mixer.clipAction(animationClip);
				this.walk = action;
			});

			// Jumping animation
			fbxLoader.load('./Jumping.fbx', (animationObject) => {
				const animationClip = animationObject.animations[0]; // Assuming the animation file has one clip
				const action = this.mixer.clipAction(animationClip);
				this.jump = action;
			});

			// Built-in animation
			// let fileAnimations = gltf.animations;
			// let idleAnim = AnimationClip.findByName(fileAnimations, 'jump');
			// const idle = this.mixer.clipAction(idleAnim);
			// idle.play();
		});

		// Three JS visual box
		const geometry = new BoxGeometry(2, 1, 2); // Width, Height, Depth
		const material = new MeshBasicMaterial({ color: 0x00ff00 }); // Green color
		const box = new Mesh(geometry, material);
		this.add(box);
		this.box = box;

		// Cannon JS physics box
		// const cubeShape = new Box(new Vec3(0.5, 0.5, 0.5)); // Half-extents
		const cubeShape = new Box(new Vec3(1, 0.5, 1));
		// const angle = Math.PI;
		// const quaternion = new Quaternion(-1.0, 0.0, 0.0, angle); // quaternion (x, y, z, a) rotates the figure about the vector (x, y, z) by angle a
		this.frictionlessMaterial = new Material("frictionless");
		this.frictionlessMaterial.friction = 0;
		this.frictionlessMaterial.restitution = 0;
		const cubeBody = new Body({
			mass: 100000,
			position: new Vec3(0, 2, 0),
			shape: cubeShape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
			// quaternion: quaternion
		});
		this.defaultMaterial = new Material("inelastic");
		this.defaultMaterial.restitution = 0;
		const axis = new Vec3(0, -1, 0); // Axis of rotation (e.g., y-axis)
		const angle = Math.PI / 2;
		cubeBody.quaternion.setFromAxisAngle(axis, angle);

		world.addBody(cubeBody);
		this.cubeBody = cubeBody;
		this.world = world;

		this.box.position.copy(this.cubeBody.position);
		this.box.quaternion.copy(this.cubeBody.quaternion);

		this.keyPress = 0;

		parent.addToUpdateList(this);
	}

	update(timeStamp) {
		// push built-in animation forward
		if (this.mixer) {
			// feed a timestep, maybe use clock
			this.mixer.update(0.01);
		}

		// push world physics forward
		if (this.clock == null) {
			this.clock = new Clock();
		}
		this.world.step(1 / 60, this.clock.getDelta(), 3);

		// have person move forward
		if (this.cubeBody != null) {
			// this.cubeBody.position.z += 0.1;
		}

		// lock person model to cube with physics
		if (this.model != null) {
			this.model.position.copy(this.cubeBody.position.clone().vadd(new Vec3(0.0, -0.4, 0.0)));
			// this.model.quaternion.copy(this.cubeBody.quaternion);
		}
		// lock visual box to cube with physics
		if (this.box != null) {
			this.box.position.copy(this.cubeBody.position);
			this.box.quaternion.copy(this.cubeBody.quaternion);
		}

		const NONE = 0, UP = 1, RIGHT = 2, LEFT = 3;
		if (this.keyPress != null && this.cubeBody != null && this.walk != null && this.jump != null) {		

			// Examples
			// this.jump.play();
			// this.walk.play();

			// let axis = new Vector3(1, 0, 0);
			// let angle = -Math.PI / 2;
			// let quaternion1 = new Quaternion(0, 1, 0, Math.PI);
			// quaternion1.setFromAxisAngle(axis, angle);
			// this.model.quaternion.copy(quaternion1);

			// axis = new Vector3(0, 0, -1);
			// angle = -Math.PI;
			// let quaternion2 = new Quaternion(0, 0, 0, Math.PI);
			// quaternion2.setFromAxisAngle(axis, angle);
			// quaternion1.multiply(quaternion2);
			// this.model.quaternion.copy(quaternion1);

			// Still, forward
			let axis = new Vector3(0, 1, 0);
			let angle = -Math.PI / 2;
			let quaternion1 = new Quaternion(0, 1, 0, Math.PI);
			quaternion1.setFromAxisAngle(axis, angle);
			this.model.quaternion.copy(quaternion1);

			if (this.up) {

				this.jump.play();

				// this.model.quaternion.copy(this.model.quaternion.multiply())

				// let axis = new Vector3(0, 1, 0); // Axis of rotation (e.g., y-axis)
				// let angle = Math.PI;
				// let quaternion1 = new Quaternion(0, 1, 0, Math.PI);
				// quaternion1.setFromAxisAngle(axis, angle);

				// axis = new Vector3(-1, 0, 0); // Axis of rotation (e.g., y-axis)
				// angle = Math.PI / 2;
				// let quaternion2 = new Quaternion(0, 0, 0, 0);
				// quaternion2.setFromAxisAngle(axis, angle);
				
				// quaternion1.multiply(quaternion2);
				// this.model.quaternion.copy(quaternion1);

				// this.jump.play();

			}
			
			if (this.keyPress == RIGHT) {
				// this.cubeBody.material = this.frictionlessMaterial;

				// if (this.cubeBody.position.y < 0.6) {
				// 	const axis = new Vector3(-1, 0, 0); // Axis of rotation (e.g., y-axis)
				// 	const angle = Math.PI / 2;
				// 	this.model.quaternion.setFromAxisAngle(axis, angle);
				// 	this.cubeBody.velocity.z = 10;

				// 	this.jump.stop();
				// 	this.jumping = false;

				// 	this.walk.play();
				// }
			}
			else if (this.keyPress == LEFT) {
				// this.cubeBody.material = this.frictionlessMaterial;

				// if (this.cubeBody.position.y < 0.6) {
				// 	let axis = new Vector3(0, 1, 0); // Axis of rotation (e.g., y-axis)
				// 	let angle = Math.PI;
				// 	let quaternion1 = new Quaternion(0, 1, 0, Math.PI);
				// 	quaternion1.setFromAxisAngle(axis, angle);

				// 	axis = new Vector3(-1, 0, 0); // Axis of rotation (e.g., y-axis)
				// 	angle = Math.PI / 2;
				// 	let quaternion2 = new Quaternion(0, 0, 0, 0);
				// 	quaternion2.setFromAxisAngle(axis, angle);
					
				// 	quaternion1.multiply(quaternion2);
				// 	this.model.quaternion.copy(quaternion1);
				// 	this.cubeBody.velocity.z = -10;

				// 	this.jump.stop();
				// 	this.jumping = false;

				// 	this.walk.play();
				// }
			}
			else if (this.keyPress == NONE) {
				// this.cubeBody.material = this.defaultMaterial;

				// this.walk.stop();
				// if (this.jump.getClip().duration - this.jump.time < 0.02) {
				// 	this.jump.stop();
				// 	this.jumping = false;
				// }
				
				// if (!this.walk.isRunning()) {
				// 	let axis = new Vector3(0, -1, 0); // Axis of rotation (e.g., y-axis)
				// 	let angle = Math.PI / 2;
				// 	this.model.quaternion.setFromAxisAngle(axis, angle);

				// 	if (this.jump.isRunning()) {
				// 		let axis = new Vector3(0, 0, -1); // Axis of rotation (e.g., y-axis)
				// 		let angle = Math.PI / 2;
				// 		let quaternion = new Quaternion(0, 0, 0, 0);
				// 		quaternion.setFromAxisAngle(axis, angle);
				// 		this.model.quaternion.multiply(quaternion);
				// 	}
				// }
			}
			
			// const EPS = 0.001;
			// if (!this.jumping && this.jump.time / this.jump.getClip().duration >= 0.25 + EPS) {
			// 	this.cubeBody.applyForce(new Vec3(0.0, 50000000.0, 0.0), new Vec3(0.0, 0.0, 0.0));
			// 	this.jumping = true;
			// }
		}
	}
}

export default Person;

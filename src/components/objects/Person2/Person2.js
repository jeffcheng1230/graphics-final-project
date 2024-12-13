import { Group, TextureLoader, MeshPhongMaterial, AnimationMixer, AnimationClip,
	Quaternion, Clock, BoxGeometry, MeshBasicMaterial, Mesh, Vector3
 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Body, Box, Vec3, Material } from 'cannon-es';

class Person2 extends Group {
	constructor(parent, world) {
		// Call parent Group() constructor
		super();

		// Init state
		this.state = {
				gui: parent.state.gui,
		};

		this.name = 'person2';

		var model;

		// Load object
		const loader = new GLTFLoader();
		loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb', (gltf) => {
			model = gltf.scene;
			this.add(model);
			this.model = model;

			// Set the models initial scale, position, orientation
			model.scale.set(2, 2, 2);
			model.position.x = 0;
			model.position.y = 0;
			model.position.z = 0;
			// quaternion (x, y, z, a) rotates the figure about the vector (x, y, z) by angle a
			// const quaternion = new Quaternion(-1.0, 0.0, 0.0, Math.PI);
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
			fbxLoader.load('https://raw.githubusercontent.com/jeffcheng1230/graphics-final-project/main/public/Walking.fbx', (animationObject) => {
				const animationClip = animationObject.animations[0]; // Assuming the animation file has one clip
				const action = this.mixer.clipAction(animationClip);
				this.walk = action;
			});

			// Jumping animation
			fbxLoader.load('https://raw.githubusercontent.com/jeffcheng1230/graphics-final-project/main/public/Jumping.fbx', (animationObject) => {
				const animationClip = animationObject.animations[0]; // Assuming the animation file has one clip
				const action = this.mixer.clipAction(animationClip);
				this.jump = action;
			});

		});

		// Three JS visual box
		const geometry = new BoxGeometry(2, 4, 2); // Width, Height, Depth
		// const material = new MeshBasicMaterial({ color: 0x00ff00 }); // Green color
		const material = new MeshBasicMaterial({ transparent: true, opacity: 0.2 }); // Green color
		const box = new Mesh(geometry, material);
		this.add(box);
		this.box = box;

		// Cannon JS physics box
		const cubeShape = new Box(new Vec3(1, 2, 1));	// Half-extents
		const cubeBody = new Body({
			mass: 100000,
			position: new Vec3(0, 2, 0),
			shape: cubeShape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
			// quaternion: quaternion
		});
		cubeBody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);

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

		// lock person model to cube with physics
		if (this.model != null) {
			if (this.jump != null && this.jump.time / this.jump.getClip().duration >= 0.3 && 
					this.jump != null && this.jump.time / this.jump.getClip().duration <= 0.6) {
				this.model.position.copy(this.cubeBody.position.clone().vadd(new Vec3(0.0, -3.5, 0.0)));
			}
			else {
				this.model.position.copy(this.cubeBody.position.clone().vadd(new Vec3(0.0, -2.0, 0.0)));
			}
			// this.model.quaternion.copy(this.cubeBody.quaternion);
		}
		// lock visual box to cube with physics
		if (this.box != null) {
			this.box.position.copy(this.cubeBody.position);
			this.box.quaternion.copy(this.cubeBody.quaternion);
		}

		const NONE = 0, UP = 1, RIGHT = 2, LEFT = 3;
		if (this.keyPress != null && this.cubeBody != null && this.walk != null && this.jump != null) {		

			// Still, forward
			let quaternion1 = new Quaternion(0, 1, 0, Math.PI);
			quaternion1.setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2);
			this.model.quaternion.copy(quaternion1);

			if (this.wKey) {
				this.jump.play();
			}
			
			if (this.dKey) {
				this.walk.play();

				// Jump and/or walk, right
				let quaternion1 = new Quaternion(0, 1, 0, Math.PI);
				quaternion1.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
				this.model.quaternion.copy(quaternion1);

				this.cubeBody.velocity.z = 5;
			}
			else if (!this.aKey) {
				this.walk.stop();
				this.cubeBody.velocity.z = 0;
			}

			if (this.aKey) {
				this.walk.play();

				// Jump and/or walk, left
				let quaternion1 = new Quaternion(0, 1, 0, Math.PI);
				quaternion1.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
				let quaternion2 = new Quaternion(0, 0, 0, Math.PI);
				quaternion2.setFromAxisAngle(new Vector3(0, 0, -1), -Math.PI);
				quaternion1.multiply(quaternion2);
				this.model.quaternion.copy(quaternion1);

				this.cubeBody.velocity.z = -5;
			}
			else if (!this.dKey) {
				this.walk.stop();
				this.cubeBody.velocity.z = 0;
			}

			// Jump, forward
			if (this.jump.isRunning() && !this.walk.isRunning() && !this.dKey && !this.aKey) {
				if (!this.rightArrow && !this.leftArrow) {
					let quaternion1 = new Quaternion(0, 1, 0, Math.PI);
					quaternion1.setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2);
					let quaternion2 = new Quaternion(0, 0, 0, Math.PI);
					quaternion2.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
					quaternion1.multiply(quaternion2);
					this.model.quaternion.copy(quaternion1);
				}
			}

			// Jump force
			if (!this.jumping && this.jump.time / this.jump.getClip().duration >= 0.25) {
				this.cubeBody.applyForce(new Vec3(0.0, 80000000.0, 0.0), new Vec3(0.0, 0.0, 0.0));
				this.jumping = true;
			}

			// Stop jump animation once Person2 hits the ground
			if (this.jump.time / this.jump.getClip().duration >= 0.98) {
				this.jump.stop();
				this.jumping = false;
			}	
		}
	}
}

export default Person2;

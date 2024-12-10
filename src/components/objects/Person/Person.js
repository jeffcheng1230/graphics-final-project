import { Group, TextureLoader, MeshPhongMaterial, AnimationMixer, AnimationClip,
	Quaternion, Clock, BoxGeometry, MeshBasicMaterial, Mesh, 
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
				model.scale.set(7, 7, 7);
				model.position.y = -11;
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
				const fbxLoader = new FBXLoader();
				fbxLoader.load('./Walking.fbx', (animationObject) => {
					const animationClip = animationObject.animations[0]; // Assuming the animation file has one clip
					const action = this.mixer.clipAction(animationClip);
					action.play();
				});

				// Built-in animation
				// let fileAnimations = gltf.animations;
				// let idleAnim = AnimationClip.findByName(fileAnimations, 'jump');
				// const idle = this.mixer.clipAction(idleAnim);
				// idle.play();
			});

			// Three JS visual box
			const geometry = new BoxGeometry(3, 3, 1); // Width, Height, Depth
			const material = new MeshBasicMaterial({ color: 0x00ff00 }); // Green color
			const box = new Mesh(geometry, material);
			this.add(box);
			this.box = box;

			// Cannon JS physics box
			const cubeShape = new Box(new Vec3(3.0, 3.0, 1.0)); // Half-extents
			const angle = Math.PI;
			// const quaternion = new Quaternion(-1.0, 0.0, 0.0, angle); // quaternion (x, y, z, a) rotates the figure about the vector (x, y, z) by angle a
			const cubeBody = new Body({
					mass: 1,
					position: new Vec3(0, 1, 0),
					shape: cubeShape,
					// quaternion: quaternion
			});
			world.addBody(cubeBody);
			this.cubeBody = cubeBody;
			this.world = world;

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
			this.cubeBody.position.z += 0.1;
		}

		// lock person model to cube with physics
		if (this.model != null) {
				this.model.position.copy(this.cubeBody.position);
				this.model.quaternion.copy(this.cubeBody.quaternion);
		}
		// lock visual box to cube with physics
		if (this.box != null) {
				this.box.position.copy(this.cubeBody.position);
				this.box.quaternion.copy(this.cubeBody.quaternion);
		}
	}
}

export default Person;

import { Group, TextureLoader, MeshPhongMaterial, AnimationMixer, AnimationClip,
	Quaternion, Clock, BoxGeometry, MeshBasicMaterial, Mesh, Vector3
 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Body, Box, Vec3, Material } from 'cannon-es';

class Environment extends Group {
	constructor(parent, world) {
		// Call parent Group() constructor
		super();

		// Init state
		this.state = {
			gui: parent.state.gui,
		};

		this.name = 'environment';

		var model;

		const loader = new GLTFLoader();
		loader.load('/Demo2/Demo.gltf', (gltf) => {
			model = gltf.scene;
			this.add(model);
			model.scale.set(10, 10, 10);
			model.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		});

		// Cannon JS physics box
		const cubeShape1 = new Box(new Vec3(3.52, 0.13, 2.5));	// Half-extents
		const cubeBody1 = new Body({
			mass: 0,
			position: new Vec3(0, 2.15, 5.28),
			shape: cubeShape1,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
			// quaternion: quaternion
		});
		cubeBody1.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(cubeBody1);
		this.world = world;

		const cubeShape2 = new Box(new Vec3(3.52, 0.13, 2.5));	// Half-extents
		const cubeBody2 = new Body({
			mass: 0,
			position: new Vec3(0, 2.15, -5),
			shape: cubeShape1,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
			// quaternion: quaternion
		});
		cubeBody2.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(cubeBody2);
		this.world = world;

		const cubeShape3 = new Box(new Vec3(0.25, 1, 2.5));	// Half-extents
		const cubeBody3 = new Body({
			mass: 0,
			position: new Vec3(0, 1, 2),
			shape: cubeShape1,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
			// quaternion: quaternion
		});
		cubeBody3.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(cubeBody3);
		this.world = world;

		const cubeShape4 = new Box(new Vec3(0.25, 1, 2.5));	// Half-extents
		const cubeBody4 = new Body({
			mass: 0,
			position: new Vec3(0, 1, -1.55),
			shape: cubeShape1,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
			// quaternion: quaternion
		});
		cubeBody4.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(cubeBody4);
		this.world = world;

		// // Three JS visual box
		const geometry = new BoxGeometry(0.5, 2, 5); // Width, Height, Depth
		const material = new MeshBasicMaterial({ color: 0x00ff00 }); // Green color
		// const material = new MeshBasicMaterial({ transparent: true, opacity: 0.2 });
		const box = new Mesh(geometry, material);
		this.add(box);
		this.box = box;

		const level1shape = new Box(new Vec3(3.52, 0.13, 2.5));	// Half-extents
		const level1body = new Body({
			mass: 0,
			position: new Vec3(0, 2.15, 5.28),
			shape: cubeShape1,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
			// quaternion: quaternion
		});
		level1body.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(level1body);
		this.world = world;

		this.box.position.copy(level1body.position);
		this.box.quaternion.copy(level1body.quaternion);
		
		parent.addToUpdateList(this);
	}

	update(timeStamp) {
		// push world physics forward
		if (this.clock == null) {
			this.clock = new Clock();
		}
		this.world.step(1 / 60, this.clock.getDelta(), 3);
	}
}

export default Environment;

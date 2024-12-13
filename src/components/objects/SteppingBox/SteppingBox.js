import { Group, TextureLoader, MeshPhongMaterial, AnimationMixer, AnimationClip,
	Quaternion, Clock, BoxGeometry, MeshBasicMaterial, Mesh, Vector3
 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Body, Box, Vec3, Material } from 'cannon-es';

class SteppingBox extends Group {
	constructor(parent, world, position) {
		// Call parent Group() constructor
		super();

		// Init state
		this.state = {
			gui: parent.state.gui,
		};

		this.name = 'stepping box';

		const geometry = new BoxGeometry(3, 3, 3); // Width, Height, Depth
		const material = new MeshBasicMaterial({ color: 0x00ffff }); // Green color
		const box = new Mesh(geometry, material);
		this.add(box);
		this.box = box;

		const boxBody = new Body({
			mass: 1000000,
			position: position,
			shape: new Box(new Vec3(1.5, 1.5, 1.5)),
			// quaternion: quaternion
		});
		boxBody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(boxBody);
		this.boxBody = boxBody;
		this.world = world;

		this.box.position.copy(this.boxBody.position);
		this.box.quaternion.copy(this.boxBody.quaternion);

		parent.addToUpdateList(this);
	}

	update(timeStamp) {
		this.box.position.copy(this.boxBody.position);
		this.box.quaternion.copy(this.boxBody.quaternion);

		// push world physics forward
		if (this.clock == null) {
			this.clock = new Clock();
		}
		this.world.step(1 / 60, this.clock.getDelta(), 3);
	}
}

export default SteppingBox;

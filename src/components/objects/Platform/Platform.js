import { Group, TextureLoader, MeshPhongMaterial, AnimationMixer, AnimationClip,
	Quaternion, Clock, BoxGeometry, MeshBasicMaterial, Mesh, Vector3
 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Body, Box, Vec3, Material } from 'cannon-es';

class Platform extends Group {
	constructor(position, parent, world) {
		// Call parent Group() constructor
		super();

		// Init state
		this.state = {
			gui: parent.state.gui,
		};

		this.name = 'ice cream';

		const geometry = new BoxGeometry(5, 0.5, 5); // Width, Height, Depth
		const material = new MeshBasicMaterial({ color: 0x00ff00 }); // Green color
		const platformBox = new Mesh(geometry, material);
		this.add(platformBox);
		this.platformBox = platformBox;

		const platformBody = new Body({
			mass: 0,
			// position: new Vec3(0, -17.5, 31),
			position: position,
			shape: new Box(new Vec3(2.5, 0.25, 2.5)),
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
			// quaternion: quaternion
		});
		platformBody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(platformBody);
		this.platformBody = platformBody;
		this.world = world;

		this.platformBox.position.copy(this.platformBody.position);
		this.platformBox.quaternion.copy(this.platformBody.quaternion);

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

export default Platform;

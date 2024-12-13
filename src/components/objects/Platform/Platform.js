import { Group, TextureLoader, MeshPhongMaterial, AnimationMixer, AnimationClip,
	Quaternion, Clock, BoxGeometry, MeshBasicMaterial, Mesh, Vector3
 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Body, Box, Vec3, Material } from 'cannon-es';

class Platform extends Group {
	constructor(parent, world) {
		// Call parent Group() constructor
		super();

		// Init state
		this.state = {
			gui: parent.state.gui,
		};

		this.name = 'platform';

		const geometry = new BoxGeometry(3, 0.5, 2.5); // Width, Height, Depth
		const material = new MeshBasicMaterial({ color: 0xffff00 }); // Green color
		const platformBox = new Mesh(geometry, material);
		this.add(platformBox);
		this.platformBox = platformBox;

		const platformBody = new Body({
			mass: 0,
			position: new Vec3(0, 5.0, 5.28),
			shape: new Box(new Vec3(1.5, 0.25, 1.25)),
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial,
			gravityScale: 0
			// quaternion: quaternion
		});
		platformBody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(platformBody);
		this.platformBody = platformBody;
		this.world = world;

		this.platformBox.position.copy(this.platformBody.position);
		this.platformBox.quaternion.copy(this.platformBody.quaternion);

		this.active = false;

		this.startPos = platformBody.position.clone();
		this.endPos = platformBody.position.clone();
		this.endPos.y += 4.0;

		parent.addToUpdateList(this);
	}

	update(timeStamp) {
		if (this.platformBox != null) {
			this.platformBox.position.copy(this.platformBody.position);
			this.platformBox.quaternion.copy(this.platformBody.quaternion);
		}

		// push world physics forward
		if (this.clock == null) {
			this.clock = new Clock();
		}
		this.world.step(1 / 60, this.clock.getDelta(), 3);

		let distSq = (p1, p2) => {
			return (p1.x - p2.x) * (p1.x - p2.x) +
							(p1.y - p2.y) * (p1.y - p2.y) +
							(p1.z - p2.z) * (p1.z - p2.z);
		}

		if (this.active && distSq(this.platformBody.position, this.endPos) > 0.5) {
			this.platformBody.position.y += 0.05;
		}
		else if (!this.active && distSq(this.platformBody.position, this.startPos) > 0.5) {
			this.platformBody.position.y -= 0.05;
		}
	}
}

export default Platform;

import { Group, TextureLoader, MeshPhongMaterial, AnimationMixer, AnimationClip,
	Quaternion, Clock, BoxGeometry, MeshBasicMaterial, Mesh, Vector3
 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Body, Box, Vec3, Material } from 'cannon-es';

class IceCream extends Group {
	constructor(parent, position) {
		// Call parent Group() constructor
		super();

		// Init state
		this.state = {
			gui: parent.state.gui,
		};

		this.name = 'ice cream';

		var model;
		const loader = new GLTFLoader();
		loader.load('https://raw.githubusercontent.com/jeffcheng1230/graphics-final-project/main/public/Demo/Demo.gltf', (gltf) => {
			model = gltf.scene;
			this.add(model);
			model.scale.set(10, 10, 10);
			model.position.copy(position);
		});

		parent.addToUpdateList(this);
	}

	update(timeStamp) {
	}
}

export default IceCream;

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

		let geometry = new BoxGeometry(80, 0.5, 5); // Width, Height, Depth
		const material = new MeshBasicMaterial({ color: 0x999999 }); // Gray color
		
		const box1 = new Mesh(geometry, material);
		this.add(box1);
		this.box1 = box1;

		const level1shape = new Box(new Vec3(40, 0.25, 2.5));
		const level1body = new Body({
			mass: 0,
			position: new Vec3(0, -18, 0),
			shape: level1shape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
		});
		level1body.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(level1body);
		this.world = world;
		this.box1.position.copy(level1body.position);
		this.box1.quaternion.copy(level1body.quaternion);

		geometry = new BoxGeometry(40, 0.5, 5); // Width, Height, Depth
		const box2a = new Mesh(geometry, material);
		this.add(box2a);
		this.box2a = box2a;
		const level2ashape = new Box(new Vec3(20, 0.25, 2.5));
		const level2abody = new Body({
			mass: 0,
			position: new Vec3(0, -8, -20),
			shape: level2ashape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
		});
		level2abody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(level2abody);
		this.world = world;
		this.box2a.position.copy(level2abody.position);
		this.box2a.quaternion.copy(level2abody.quaternion);

		geometry = new BoxGeometry(14, 0.5, 5); // Width, Height, Depth
		const box2b = new Mesh(geometry, material);
		this.add(box2b);
		this.box2b = box2b;
		const level2bshape = new Box(new Vec3(7, 0.25, 2.5));
		const level2bbody = new Body({
			mass: 0,
			position: new Vec3(0, -8, 22),
			shape: level2bshape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
		});
		level2bbody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(level2bbody);
		this.world = world;
		this.box2b.position.copy(level2bbody.position);
		this.box2b.quaternion.copy(level2bbody.quaternion);

		const box2c = new Mesh(geometry, material);
		this.add(box2c);
		this.box2c = box2c;
		const level2cshape = new Box(new Vec3(7, 0.25, 2.5));
		const level2cbody = new Body({
			mass: 0,
			position: new Vec3(0, -8, 40),
			shape: level2cshape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
		});
		level2cbody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(level2cbody);
		this.world = world;
		this.box2c.position.copy(level2cbody.position);
		this.box2c.quaternion.copy(level2cbody.quaternion);

		geometry = new BoxGeometry(80, 0.5, 5); // Width, Height, Depth
		
		const box3 = new Mesh(geometry, material);
		this.add(box3);
		this.box3 = box3;
		const level3shape = new Box(new Vec3(40, 0.25, 2.5));
		const level3body = new Body({
			mass: 0,
			position: new Vec3(0, 2, 18),
			shape: level3shape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
		});
		level3body.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(level3body);
		this.world = world;
		this.box3.position.copy(level3body.position);
		this.box3.quaternion.copy(level3body.quaternion);

		const box4 = new Mesh(geometry, material);
		this.add(box4);
		this.box4 = box4;
		const level4shape = new Box(new Vec3(40, 0.25, 2.5));
		const level4body = new Body({
			mass: 0,
			position: new Vec3(0, 12, 0),
			shape: level4shape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
		});
		level4body.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(level4body);
		this.world = world;
		this.box4.position.copy(level4body.position);
		this.box4.quaternion.copy(level4body.quaternion);

		let wallGeometry = new BoxGeometry(0.5, 80, 5); // Width, Height, Depth
		const wallMaterial = new MeshBasicMaterial({ transparent: true, opacity: 0.01 });
		
		const leftWall = new Mesh(wallGeometry, wallMaterial);
		this.add(leftWall);
		this.leftWall = leftWall;
		const leftWallShape = new Box(new Vec3(0.25, 40, 5));
		const leftWallBody = new Body({
			mass: 0,
			position: new Vec3(0, 12, -35),
			shape: leftWallShape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
		});
		leftWallBody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(leftWallBody);
		this.world = world;
		this.leftWall.position.copy(leftWallBody.position);
		this.leftWall.quaternion.copy(leftWallBody.quaternion);

		const rightWall = new Mesh(wallGeometry, wallMaterial);
		this.add(rightWall);
		this.rightWall = leftWall;
		const rightWallShape = new Box(new Vec3(0.25, 40, 5));
		const rightWallBody = new Body({
			mass: 0,
			position: new Vec3(0, 12, 34.9),
			shape: rightWallShape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
		});
		rightWallBody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(rightWallBody);
		this.world = world;
		this.rightWall.position.copy(rightWallBody.position);
		this.rightWall.quaternion.copy(rightWallBody.quaternion);

		wallGeometry = new BoxGeometry(80, 80, 0.5); // Width, Height, Depth

		const backWall = new Mesh(wallGeometry, wallMaterial);
		this.add(backWall);
		this.backWall = backWall;
		const backWallShape = new Box(new Vec3(40, 40, 0.5));
		const backWallBody = new Body({
			mass: 0,
			position: new Vec3(3, 0, 0),
			shape: backWallShape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
		});
		backWallBody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(backWallBody);
		this.world = world;
		this.backWall.position.copy(backWallBody.position);
		this.backWall.quaternion.copy(backWallBody.quaternion);

		const frontWall = new Mesh(wallGeometry, wallMaterial);
		this.add(frontWall);
		this.frontWall = frontWall;
		const frontWallShape = new Box(new Vec3(40, 40, 0.5));
		const frontWallBody = new Body({
			mass: 0,
			position: new Vec3(-3, 0, 0),
			shape: frontWallShape,
			angularFactor: new Vec3(0, 0, 0),
			material: this.frictionlessMaterial
		});
		frontWallBody.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		world.addBody(frontWallBody);
		this.world = world;
		this.frontWall.position.copy(frontWallBody.position);
		this.frontWall.quaternion.copy(frontWallBody.quaternion);

		var model;
		let loader = new GLTFLoader();
		loader.load('Demo2/Demo.gltf', (gltf) => {
			model = gltf.scene;
			this.add(model);
			model.scale.set(10, 10, 10);
			model.position.copy(new Vec3(0, -9.6, -33.5));
			model.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);
		});

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

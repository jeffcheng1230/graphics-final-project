import * as Dat from 'dat.gui';
import { Scene, Color, TextureLoader } from 'three';
import { Flower, Land, Person1, Person2, Environment, Platform, IceCream, SteppingBox, Door } from 'objects';
import { BasicLights } from 'lights';

import IMG from '/public/friend_outside.jpg';
import { Vec3, World } from 'cannon-es';

class SeedScene extends Scene {
    constructor(world) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
            person1: null,
            person2: null,
        };

        // ===========================================

        const loader = new TextureLoader();
        loader.load(IMG, (texture) => {
            this.background = texture; // Set the texture as the background
        }, undefined, (error) => {
            console.error('Error loading texture:', error);
            this.background = new Color(0x7ec0ee);
        });

        // ===========================================

        // Add meshes to scene
		this.doors = [[new Vec3(-0.5, 0.0, 13), new Vec3(0.5, 5.0, 17)],
		            [new Vec3(-0.5, 0.0, -17), new Vec3(0.5, 5.0, -13)]];

        let doors1Pos = this.doors[0][0];
        doors1Pos.x += 0.5;
        doors1Pos.z += 2;
        let doors2Pos = this.doors[1][0];
        doors2Pos.x += 0.5;
        doors2Pos.z += 2;
        const door1 = new Door(this, doors1Pos);
        const door2 = new Door(this, doors2Pos);

        const box = new SteppingBox(this, world, new Vec3(0.0, 5.0, -10.0));

        const platform = new Platform(this, world);
        this.platform = platform;

        const iceCream = new IceCream(this);
        iceCream.position.copy(new Vec3(0.0, 5.0, -3.0));
        this.iceCreams = [iceCream];

        const env = new Environment(this, world);

        const person1 = new Person1(this, world);
        person1.cubeBody.position.copy(new Vec3(0.0, 10.0, 5.0));
        this.person1 = person1;
        const person2 = new Person2(this, world);
        person2.cubeBody.position.copy(new Vec3(0.0, 10.0, -5.0));
        this.person2 = person2;

        const land = new Land();
        const flower = new Flower(this);
        const lights = new BasicLights();
        // this.add(person, land, flower, lights);
        this.add(door1, door2, box, platform, iceCream, env, person1, person2, lights);
        this.state.person1 = person1;
        this.state.person2 = person2;

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

		let inRegion = function (position, region) {
			if (position.x >= region[0].x && position.x <= region[1].x &&
				position.y >= region[0].y && position.y <= region[1].y &&
				position.z >= region[0].z && position.z <= region[1].z) {
				return true;
			}
			else {
				return false;
			}
		}

		let iceCreams = [[new Vec3(-4.0, -2.0, -6.0), new Vec3(4.0, 10.0, -3.0)]];
		for (let i = 0; i < iceCreams.length; i++) {
			if (inRegion(this.person1.cubeBody.position, iceCreams[i])) {
				console.log("remove ice cream");
                this.remove(this.iceCreams[i]);
			}
		}

		let lavaPits = [[new Vec3(-4.0, -2.0, -0.55), new Vec3(4.0, 10.0, 0.76)]];
		for (const pit of lavaPits) {
			if (inRegion(this.person1.cubeBody.position, pit)) {
				console.log("Dead");
			}
		}

		let buttons = [[new Vec3(-2.0, -2.0, -8.0), new Vec3(2.0, 10.0, -5.0)]];
		for (const button of buttons) {
			if (inRegion(this.person2.cubeBody.position, button)) {
                this.platform.active = true;
			}
            else {
                this.platform.active = false;
            }
		}

		let doors = [[new Vec3(-0.5, 0.0, 13), new Vec3(0.5, 5.0, 17)],
		            [new Vec3(-0.5, 0.0, -17), new Vec3(0.5, 5.0, -13)]];
        if (inRegion(this.person1.cubeBody.position, doors[0]) && 
            inRegion(this.person2.cubeBody.position, doors[1])) {
            console.log("win");
        }
    }
}

export default SeedScene;

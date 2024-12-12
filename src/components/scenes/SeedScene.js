import * as Dat from 'dat.gui';
import { Scene, Color, TextureLoader } from 'three';
import { Flower, Land, Person1, Person2, Environment, IceCream } from 'objects';
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
        this.add(iceCream, env, person1, person2, lights);
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
    }
}

export default SeedScene;

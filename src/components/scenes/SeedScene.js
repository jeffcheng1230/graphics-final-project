import * as Dat from 'dat.gui';
import { Scene, Color, TextureLoader } from 'three';
import { Flower, Land, Person1, Person2, Environment, Platform, IceCream, SteppingBox, Door } from 'objects';
import { BasicLights } from 'lights';

import IMG from '/public/friend_outside.jpg';
import { Vec3, World } from 'cannon-es';
import { Vector3 } from 'three'

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
		this.doors = [[new Vec3(-2, 2.25, 28), new Vec3(2, 7.25, 34)],
		            [new Vec3(-2, 2.25, 22), new Vec3(2, 7.25, 28)]];
        let doors1Pos = this.doors[0][0];
        doors1Pos.x += 0.5;
        doors1Pos.z += 4;
        let doors2Pos = this.doors[1][0];
        doors2Pos.x += 0.5;
        doors2Pos.z += 4;
        const door1 = new Door(this, doors1Pos);
        const door2 = new Door(this, doors2Pos);

        const box = new SteppingBox(this, world, new Vec3(0.0, -5.0, 20.0));

		this.buttons = [[new Vec3(-2.0, -22, 17), new Vec3(2.0, -15, 20)],
                        [new Vec3(-2.0, -12.0, -13.0), new Vec3(2.0, -5.0, -10.0)]];
		this.buttonsDup = [[],
                        [new Vec3(-2.0, -2.0, -13.0), new Vec3(2.0, 5.0, -10.0)]];
        this.platforms = []
        let buttonPos1 = this.buttons[0][0].clone();
        let buttonPos2 = null;
        buttonPos1.x += 2;
        buttonPos1.y += 5;
        buttonPos1.z += 1.5;
        if (this.buttonsDup[0].length > 0) {
            buttonPos2 = this.buttonsDup[0][0].clone();
            buttonPos2.x += 2;
            buttonPos2.y += 5;
            buttonPos2.z += 1.5;
        }
        const platform1 = new Platform(new Vec3(0, -17.7, 31), buttonPos1, buttonPos2, this, world, 10.0);
        this.platforms.push(platform1);
        buttonPos1 = this.buttons[1][0].clone();
        buttonPos2 = null;
        buttonPos1.x += 2;
        buttonPos1.y += 5;
        buttonPos1.z += 1.5;
        if (this.buttonsDup[1].length > 0) {
            buttonPos2 = this.buttonsDup[1][0].clone();
            buttonPos2.x += 2;
            buttonPos2.y += 5;
            buttonPos2.z += 1.5;
        }
        const platform2 = new Platform(new Vec3(0, -7.5, -30.2), buttonPos1, buttonPos2, this, world, 1.5);
        this.platforms.push(platform2);

		let iceCreamPos = [new Vec3(0.0, -3.0, 11.0)];
        this.iceCreams = [];
        this.iceCreamPos = [];
        for (const iceCream of iceCreamPos) {
            this.iceCreams.push(new IceCream(this, iceCream));
            let icPos1 = iceCream.clone();
            icPos1.x -= 0.5;
            icPos1.y -= 3;
            icPos1.z -= 1.5;
            let icPos2 = iceCream.clone();
            icPos2.x += 0.5;
            icPos2.y += 3;
            icPos2.z += 1.5;
            this.iceCreamPos.push([icPos1, icPos2]);
        }

        const env = new Environment(this, world);

        const person1 = new Person1(this, world);
        person1.cubeBody.position.copy(new Vec3(0, -15, -32));
        this.person1 = person1;
        const person2 = new Person2(this, world);
        person2.cubeBody.position.copy(new Vec3(0.0, -15.0, -28.0));
        this.person2 = person2;

        const land = new Land();
        const flower = new Flower(this);
        const lights = new BasicLights();
        // this.add(person, land, flower, lights);
        this.add(door1, door2, box, platform1, platform2, env, person1, person2, lights);
        for (let iceCream of this.iceCreams) {
            this.add(iceCream);
        }
        this.state.person1 = person1;
        this.state.person2 = person2;

        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
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
            if (region.length > 0) {
                if (position.x >= region[0].x && position.x <= region[1].x &&
                    position.y >= region[0].y && position.y <= region[1].y &&
                    position.z >= region[0].z && position.z <= region[1].z) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
		}

		for (let i = 0; i < this.iceCreamPos.length; i++) {
			if (inRegion(this.person1.cubeBody.position, this.iceCreamPos[i]) ||
                inRegion(this.person2.cubeBody.position, this.iceCreamPos[i])) {
                this.remove(this.iceCreams[i]);
			}
		}

		let lavaPits = [[new Vec3(-2.0, -10.0, -35), new Vec3(2.0, -5, -32.5)]];
		for (const pit of lavaPits) {
			if (inRegion(this.person1.cubeBody.position, pit) ||
                inRegion(this.person2.cubeBody.position, pit)) {
                this.window.alert("You have died! Press OK to Restart");
                this.person1.cubeBody.position.copy(new Vec3(0, -15, -32));
                this.person2.cubeBody.position.copy(new Vec3(0.0, -15.0, -28.0));
                this.window.location.reload();
			}
		}

		for (let i = 0; i < this.buttons.length; i++) {
			if (inRegion(this.person1.cubeBody.position, this.buttons[i]) || 
                inRegion(this.person2.cubeBody.position, this.buttons[i]) ||
			    inRegion(this.person1.cubeBody.position, this.buttonsDup[i]) || 
                inRegion(this.person2.cubeBody.position, this.buttonsDup[i])) {
                this.platforms[i].active = true;
			}
            else {
                this.platforms[i].active = false;
            }
		}

        if (inRegion(this.person1.cubeBody.position, this.doors[0]) && 
            inRegion(this.person2.cubeBody.position, this.doors[1])) {
            if (this.window != null) {
                this.window.alert("You have won the game! Press OK to Restart");
                this.person1.cubeBody.position.copy(new Vec3(0, -15, -32));
                this.person2.cubeBody.position.copy(new Vec3(0.0, -15.0, -28.0));
                this.window.location.reload();
            }
        }
    }
}

export default SeedScene;

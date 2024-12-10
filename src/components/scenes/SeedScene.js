import * as Dat from 'dat.gui';
import { Scene, Color, TextureLoader } from 'three';
import { Flower, Land, Person } from 'objects';
import { BasicLights } from 'lights';

import IMG from '/public/friend_outside.jpg';

class SeedScene extends Scene {
    constructor(world) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
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
        const person = new Person(this, world);
        const land = new Land();
        const flower = new Flower(this);
        const lights = new BasicLights();
        // this.add(person, land, flower, lights);
        this.add(person, lights);

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
    }
}

export default SeedScene;

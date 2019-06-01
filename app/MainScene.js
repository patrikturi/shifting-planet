
import Planet from './Planet';

export default class MainScene extends Phaser.Scene {

	constructor() {
		super();
	}

	preload() {
	}

	create() {
		this.gameOver = false;
		this.matter.world.setBounds();

		let { width } = this.sys.game.canvas;

		new Planet(this, (width-600)/2, 300);

		this.matter.add.rectangle(400, 250, 50, 50, {
			mass: 10, restitution: 0.1, frictionAir: 0.01, friction: 0.5, frictionStatic: 1
		});

		this.matter.add.mouseSpring();

		this.input.on('pointerdown', function (pointer) {

			this.matter.add.rectangle(pointer.x, pointer.y, 50, 50, {
				mass: 10, restitution: 0.1, frictionAir: 0.01, friction: 0.5, frictionStatic: 1, slop: 0.2
			});

		}, this);
	}


	update() {
    // TODO: use (time, delta)
		if(this.gameOver) {
			return;
		}

	}
}

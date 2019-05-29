/* eslint no-unused-vars: "warn" */

class MainScene extends Phaser.Scene {

	constructor() {
		super();
	}

	preload() {
	}

	create() {
		this.matter.world.setBounds();

		this.matter.add.rectangle(400, 500, 600, 50, { restitution: 0.9, isStatic: true });
		this.matter.add.rectangle(400, 400, 50, 50, { restitution: 0.9 });
	}

	update() {
		if(this.gameOver) {
			return;
		}

	}
}


const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: '#000000',
	physics: {
		default: 'matter',
		matter: {
				enableSleep: false,
				debug: true
		}
	},
	scene: MainScene
};

new Phaser.Game(config);

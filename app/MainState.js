
import Planet from './Planet';

export default class MainState extends Phaser.State {

	constructor() {
		super();
		this.gameOver = false;
		this.debug = false;
	}

	preload(game) {
		game.load.image('block', 'assets/block.png');
	}

	create(game) {
		this.game = game;

		game.time.advancedTiming = true;
		game.stage.backgroundColor = '#efefef';
		game.physics.startSystem(Phaser.Physics.BOX2D);
		game.physics.box2d.gravity.y = 1000;
		game.physics.box2d.setBoundsToWorld();

    let debugKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    debugKey.onDown.add(this.toggleDebug, this);

		this.createBlock(400, 200);

		new Planet(this, (game.width-600)/2, 300);

		game.input.onDown.add(this.onMouseDown, this);
	}

  createBlock(x, y) {
		let block = this.game.add.sprite(x, y, 'block');
		this.game.physics.box2d.enable(block);
		return block;
	}

	onMouseDown(pointer) {
		this.createBlock(pointer.x, pointer.y);
	}

	update() {
    // TODO: use (time, delta)
		if(this.gameOver) {
			return;
		}
	}

	render(game) {
		if(game.isDebug) {
			game.debug.text(game.time.fps, 2, 14, "#00ff00");
		}

		if(game.isDebug && this.debug) {
			game.debug.box2dWorld();
		}
	}

	toggleDebug() {
		this.debug = !this.debug;
	}
}

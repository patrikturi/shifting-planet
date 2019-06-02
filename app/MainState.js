
import Planet from './Planet';
import Builder from './Builder';

const BACKGROUND_COLOR = '#fafafa';

export default class MainState extends Phaser.State {

	constructor() {
		super();
		this.gameOver = false;
		this.debug = false;
	}

	preload(game) {
		game.load.image('sky', 'assets/sky.jpg');
		game.load.image('block', 'assets/block.png');
		game.load.image('stone', 'assets/stone.png');
	}

	create(game) {
		this.game = game;

		game.time.advancedTiming = true;
		game.stage.backgroundColor = BACKGROUND_COLOR;
		game.physics.startSystem(Phaser.Physics.BOX2D);
		game.physics.box2d.gravity.y = 1000;
		game.physics.box2d.setBoundsToWorld();
		game.physics.box2d.debugDraw.joints = true;
		// Do not show popup on right click
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

		let debugKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		debugKey.onDown.add(this.toggleDebug, this);

		// Set up handlers for mouse events
		game.input.onDown.add(this.onMouseDown, this);
		game.input.onDown.add(this.mouseDragStart, this);
		game.input.addMoveCallback(this.mouseDragMove, this);
		game.input.onUp.add(this.mouseDragEnd, this);

		this.game.add.sprite(0, 0, 'sky');

		this.planet = new Planet(this, (game.width-600)/2, 300);

		this.builder = new Builder(game);
		this.builder.createBlock(400, 200);
	}

	update() {
    // TODO: use (time, delta)
		if(this.gameOver) {
			return;
		}
		this.builder.update();
	}

	render(game) {
		if(game.debugBuild) {
			game.debug.text(game.time.fps, 2, 14, "#00ff00");
		}

		if(game.debugBuild && this.debug) {
			game.debug.box2dWorld();
		}
	}

	toggleDebug() {
		this.debug = !this.debug;
	}

	onMouseDown(pointer) {
		this.builder.onMouseDown(pointer);
	}

	mouseDragStart() {
		if(this.game.debugBuild) {
			this.game.physics.box2d.mouseDragStart(this.game.input.mousePointer);
		}
	}

	mouseDragMove() {
		if(this.game.debugBuild) {
			this.game.physics.box2d.mouseDragMove(this.game.input.mousePointer);
		}
	}

	mouseDragEnd() {
		if(this.game.debugBuild) {
			this.game.physics.box2d.mouseDragEnd();
		}
	}
}

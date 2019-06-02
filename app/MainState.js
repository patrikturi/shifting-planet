
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
		game.load.spritesheet('button', 'assets/button.png', 49, 45);
		game.load.image('stick_icon', 'assets/stick_icon.png');
		game.load.image('stone_icon', 'assets/stone_icon.png');
		game.load.image('remove_icon', 'assets/remove_icon.png');
	}

	create(game) {
		this.game = game;
		game.add.button();
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

    let itemKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    itemKey.onDown.add(this.nextBuildItem, this);

		this.game.add.sprite(0, 0, 'sky');

		this.planet = new Planet(this, (game.width-600)/2, 300);

		this.builder = new Builder(game);
		this.builder.createBlock(400, 200);

		const startX = 650;
		const startY = 25;
		const step = 60;
		this.stickButton = game.add.button(startX, startY, 'button', () => {this.buttonClicked('stick')}, this, 1, 0, 1);
		this.stoneButton = game.add.button(startX+step, startY, 'button', () => {this.buttonClicked('stone')}, this, 1, 0, 1);
		this.removeButton = game.add.button(startX+2*step, startY, 'button', () => {this.buttonClicked('remove')}, this, 1, 0, 1);
		this.actionToButton = {'stick': this.stickButton, 'stone': this.stoneButton, 'remove': this.removeButton};
		this.buttonOrder = ['stick', 'stone', 'remove'];
		this._resetButtons();

		this.activeButton = 'stick';
		this.stickButton.setFrames(1, 1, 1);

		game.add.sprite(startX, startY, 'stick_icon');
		game.add.sprite(startX+step, startY, 'stone_icon');
		game.add.sprite(startX+2*step, startY, 'remove_icon');
	}

	nextBuildItem() {
		let currentIndex = this.buttonOrder.indexOf(this.activeButton);
		currentIndex++;
		if(currentIndex >= this.buttonOrder.length) {
			currentIndex = 0;
		}
		let name = this.buttonOrder[currentIndex];
		this.buttonClicked(name);
	}

	buttonClicked(action) {
		let button = this.actionToButton[action];
		this._resetButtons();
		this.activeButton = action;
		button.setFrames(1, 1, 1);

		this.builder.selectItem(action);
	}

	_resetButtons() {
		for (let action in this.actionToButton) {
			let button = this.actionToButton[action];
			button.setFrames(1, 0, 1);
		}
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

		this.builder.render()
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

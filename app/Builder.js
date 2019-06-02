
const STICK_COLOR = '#825830';

const STICK_MAX_LENGTH = 64;
const STICK_HEIGHT = 8;
const STICK_MIN_LENGTH = STICK_HEIGHT;
const STICK_MASS = 5;
const STONE_SCALE = 0.33;

const PlaceableItems = ['stick', 'stone', 'remove'];

export default class Builder {
  constructor(game) {
    this.game = game;
    this.firstPoint = null;
    this.currentItemIndex = -1;
    this.currentItem = null;
    this.createdItems = [];

    this.previewStone = game.add.sprite(0, 0, 'stone');
    this.previewStone.scale.setTo(STONE_SCALE);
    this.previewStone.alpha = 0.7;
    this.previewStone.anchor.setTo(0.5, 0.5);
    this.previewStone.visible = false;

    let itemKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    itemKey.onDown.add(this.nextItem, this);

    this.nextItem();
  }

  nextItem() {
    this.currentItemIndex++;
    if(this.currentItemIndex >= PlaceableItems.length) {
      this.currentItemIndex = 0;
    }
    this.currentItem = PlaceableItems[this.currentItemIndex];

    if(this.currentItem === 'stone') {
      this.previewStone.visible = true;
    } else {
      this.previewStone.visible = false;
    }

    this.firstPoint = null;
  }

  onMouseDown(pointer) {
    if(pointer.rightButton.isDown) {
      this._onRightClick(pointer);
    }
    if(!pointer.leftButton.isDown) {
      return;
    }
    // Skip if clicked on something
    // TODO: will need the same for UI
    let bodiesUnderMouse = this.game.physics.box2d.getBodiesAtPoint(pointer.x, pointer.y);

    if(bodiesUnderMouse.length == 0) {
      if(this.currentItem === 'stick') {
        this.createStick(pointer.x, pointer.y);
      } else if(this.currentItem === 'stone') {
        this.createStone(pointer.x, pointer.y);
      }
    }
    if(this.currentItem === 'remove') {
      this._removeBodies(bodiesUnderMouse);
    }
  }

  _onRightClick(pointer) {
    // Cancel placing stick
    if(this.firstPoint) {
      this.firstPoint = null;
    }
  }

  _removeBodies(bodiesUnderMouse) {
    bodiesUnderMouse.forEach((body) => {
      for(const item of this.createdItems) {
        if(body === item.body) {
          item.destroy();
        }
      }
    });
  }

  update() {
    let x = this.game.input.mousePointer.x;
    let y = this.game.input.mousePointer.y;
    this.previewStone.position.x = x;
    this.previewStone.position.y = y;
  }
  createBlock(x, y) {
    let block = this.game.add.sprite(x, y, 'block');
    this.game.physics.box2d.enable(block);
    block.body.mass = 20;
    block.body.friction = 0.5;
    block.scale.setTo(1.05);
		return block;
  }

  createStick(x, y) {
    let newPoint = new Phaser.Point(x, y);
    if(!this.firstPoint) {
      this.firstPoint = newPoint;
    } else {
      // TODO: can't create with zero size
      let start = null;
      let end = null;
      if(newPoint.x < this.firstPoint.x) {
        start = newPoint;
        end = this.firstPoint;
      } else {
        start = this.firstPoint;
        end = newPoint;
      }
      let height = STICK_HEIGHT;
      let color = STICK_COLOR;

      let diff = Phaser.Point.subtract(end, start);
      let diffByTwo = new Phaser.Point(diff.x/2.0, diff.y/2.0);
      start.add(diffByTwo.x, diffByTwo.y);

      let length = Math.min(diff.getMagnitude(), STICK_MAX_LENGTH);
      // create a new bitmap data object
      if(length < STICK_MIN_LENGTH) {
        return;
      }
      var bmd = this.game.add.bitmapData(length, height);

      // draw to the canvas context like normal
      bmd.ctx.beginPath();
      bmd.ctx.rect(0,0, length, height);
      bmd.ctx.fillStyle = color;
      bmd.ctx.fill();

      // use the bitmap data as the texture for the sprite
      let angle = Phaser.Point.angle(start, end);
      let stick = this.game.add.sprite(start.x, start.y, bmd);
      this.game.physics.box2d.enable(stick);
      stick.body.mass = STICK_MASS;
      stick.body.rotation = angle;
      stick.body.friction = 0.8;
      stick.scale.setTo(1.05);
      this.createdItems.push(stick);

      this.firstPoint = null;
    }
  }

  createStone(x, y) {
    let scale = STONE_SCALE;
    let stone = this.game.add.sprite(x, y, 'stone');
    stone.scale.setTo(scale);
    this.game.physics.box2d.enable(stone);
    stone.body.mass = 100;
    stone.body.friction = 0.8;
    stone.scale.setTo(scale+0.05);
    this.createdItems.push(stone);
  }
}

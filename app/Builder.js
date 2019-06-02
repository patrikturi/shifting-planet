
const BLOCK_COLOR = '#825830';

export default class Builder {
  constructor(game) {
    this.game = game;
    game.input.onDown.add(this.onMouseDown, this);

    this.firstPoint = null;
  }

	onMouseDown(pointer) {
		this.createStick(pointer.x, pointer.y);
  }

  createBlock(x, y) {
    let block = this.game.add.sprite(x, y, 'block');
    this.game.physics.box2d.enable(block);
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

      let diff = Phaser.Point.subtract(end, start);
      let diffByTwo = new Phaser.Point(diff.x/2.0, diff.y/2.0);
      start.add(diffByTwo.x, diffByTwo.y);

      let length = diff.getMagnitude();
      // create a new bitmap data object
      // TODO: maxlength
      var bmd = this.game.add.bitmapData(length,8);

      // // draw to the canvas context like normal
      bmd.ctx.beginPath();
      bmd.ctx.rect(0,0,length,8);
      bmd.ctx.fillStyle = BLOCK_COLOR;
      bmd.ctx.fill();


      // // use the bitmap data as the texture for the sprite
      let angle = Phaser.Point.angle(start, end);
      let stick = this.game.add.sprite(start.x, start.y, bmd);
      this.game.physics.box2d.enable(stick);
      stick.body.rotation = angle;
      stick.scale.setTo(1.05);

      this.firstPoint = null;
    }
  }
}


const STICK_COLOR = '#825830';

export default class Builder {
  constructor(game) {
    this.game = game;
    this.firstPoint = null;

  onMouseDown(pointer) {
    // Skip if clicked on something
    // TODO: will need the same for UI
    let bodiesUnderMouse = this.game.physics.box2d.getBodiesAtPoint(pointer.x, pointer.y);

    if(bodiesUnderMouse.length == 0) {
      this.createStick(pointer.x, pointer.y);
    }
  }

  createBlock(x, y) {
    let block = this.game.add.sprite(x, y, 'block');
    this.game.physics.box2d.enable(block);
    block.body.mass = 100;
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

      let diff = Phaser.Point.subtract(end, start);
      let diffByTwo = new Phaser.Point(diff.x/2.0, diff.y/2.0);
      start.add(diffByTwo.x, diffByTwo.y);

      let length = diff.getMagnitude();
      // create a new bitmap data object
      // TODO: maxlength
      let height = 8;
      var bmd = this.game.add.bitmapData(length, height);

      // // draw to the canvas context like normal
      bmd.ctx.beginPath();
      bmd.ctx.rect(0,0,length,8);
      bmd.ctx.fillStyle = STICK_COLOR;
      bmd.ctx.fill();

      // // use the bitmap data as the texture for the sprite
      let angle = Phaser.Point.angle(start, end);
      let stick = this.game.add.sprite(start.x, start.y, bmd);
      this.game.physics.box2d.enable(stick);
      stick.body.mass = 10;
      stick.body.rotation = angle;
      stick.body.friction = 0.8;
      stick.scale.setTo(1.05);

      this.firstPoint = null;
    }
  }
}

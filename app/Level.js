
const Level = {
  game: null,
  blocks: [],
  scoreText: null,
  timeLeft: 90,
  init(game) {
    this.game = game;
  },
  initScene() {
    this.scoreText = this.game.add.bitmapText(210, 35, 'text_font', '');
    this.scoreText.tint = 0x000000;
    this.updateScore();
    this.game.time.events.loop(Phaser.Timer.SECOND, this.timerTick, this);
  },
  timerTick() {
    this.timeLeft -= 1;
    this.updateScore();
  },
  updateScore() {
    let min = Math.floor(this.timeLeft / 60);
    let sec = this.timeLeft % 60;
    this.scoreText.text = `Houses: ${this.blocks.length}   Time: ${min}:${sec}`;
  },
  addBlock(block) {
    this.blocks.push(block);
  },
  blockDestroyed(block) {
    if(!block.alive) {
      return; // Might be reported multiple times before the object is removed
    }
    block.alive = false;
    // TODO: a better way might be to wait for linear and angular speed to decrease
    this.game.time.events.add(Phaser.Timer.SECOND*0.4, () => this.createFire(block), this);
    this.game.time.events.add(Phaser.Timer.SECOND*1.4, () => this.blockDeath(block), this);
  },
  blockDeath(block) {
    this.blocks = this.blocks.filter(item => item !== block);
    block.destroy();
    // TODO: remove
  },
  createFire(block) {
    let fire = this.game.add.sprite(110, 110, 'fire');
    fire.anchor.setTo(0.5, 0.75);
    fire.scale.setTo(0.75);

    fire.animations.add('burn');
    fire.animations.play('burn', 20);
    fire.position = block.position;
  }
};

export default Level;

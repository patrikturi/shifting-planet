
const Level = {
  game: null,
  blocks: [],
  init(game) {
    this.game = game;
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

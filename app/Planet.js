import { randInt } from './Utils';

const PLANET_WIDTH = 600;
const PLANET_HEIGHT = 200;
const PLANET_SURFACE_POINTS = 10;
const PLANET_SURFACE_VERTICES = PLANET_SURFACE_POINTS*2;

export default class Planet {

  constructor(game, x, y) {
    this.game = game;
    // array of coordinates for vertices of the polygon
    this.coords = [];
    // points specified clockwise
		for(let i=0; i<PLANET_SURFACE_POINTS; i++) {
			const step = PLANET_WIDTH/PLANET_SURFACE_POINTS;
			this.coords.push(i*step, 150);
		}
		this.coords.push(PLANET_WIDTH, 0);
		this.coords.push(PLANET_WIDTH, PLANET_HEIGHT, 0, PLANET_HEIGHT);
    this.coords[1] = 50;

    this.polygon = new Phaser.Polygon();
    this.graphics = game.add.graphics(x, y);

    this.body = new Phaser.Physics.Box2D.Body(this.game, null, x, y, 0);
    this.body.static = true;

    this._applyShape(this.coords);

    game.time.events.loop(Phaser.Timer.SECOND / 2.0, this.updateShape, this);
  }

  _applyShape(coords) {
    this.polygon.setTo(coords);
    this.graphics.clear();
    this.graphics.beginFill(0xFF33ff);
    this.graphics.drawPolygon(this.polygon.points);
    this.graphics.endFill();

    this.body.setPolygon(coords);
}

  updateShape() {

		for(let i=2; i<PLANET_SURFACE_VERTICES-1; i+=2) {
			let inc = randInt(4);
			if(this.coords[i+1]-inc >= 0) {
				this.coords[i+1] -= inc;
			}
			// if(point.y+inc < PLANET_HEIGHT) {
			// 	point.y += inc;
			// }
		}

		this._applyShape(this.coords);
	}

}

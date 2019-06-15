import { randInt } from './Utils';

const PLANET_WIDTH = 600;
const PLANET_HEIGHT = 200;
const PLANET_SURFACE_POINTS = 10;
const PLANET_SURFACE_VERTICES = PLANET_SURFACE_POINTS*2;

const PLANET_COLOR = 0xd8ebe6;
const PLANET_OUTLINE_COLOR = 0x9F9F9F;

export default class Planet {

  constructor(game, x, y) {
    this.game = game;
    // array of coordinates for vertices of the polygon
    this.coords = [];
    // same array with points for easier handling
    this.points = [];
    // points specified clockwise
		for(let i=0; i<PLANET_SURFACE_POINTS; i++) {
      const step = PLANET_WIDTH/PLANET_SURFACE_POINTS;
      this.points.push({x: i*step, y: 150});
			this.coords.push(0,0);
    }

    this.points.push({x: PLANET_WIDTH, y: 0});
    this.coords.push(0, 0);
    this.points.push({x: PLANET_WIDTH, y: PLANET_HEIGHT}, {x: 0, y: PLANET_HEIGHT});
    this.coords.push(0, 0, 0, 0);
    this.points[0].y = 50;

    this.polygon = new Phaser.Polygon();
    this.graphics = game.add.graphics(x, y);

    this.body = new Phaser.Physics.Box2D.Body(this.game, null, x, y, 0);
    this.body.static = true;
    this.body.friction = 0.8;

    this._applyShape(this.points);

    let pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    pauseKey.onDown.add(this.togglePause, this);
    this.paused = false;

    game.time.events.loop(Phaser.Timer.SECOND / 2.0, this.updateShape, this);
  }

  _pointsToCoords(points) {
    let i=0;
    for(const point of points) {
      this.coords[i] = point.x;
      this.coords[i+1] = point.y;
      i+=2;
    }
    return this.coords;
  }

  _applyShape(points) {
    const coords = this._pointsToCoords(points);
    this.polygon.setTo(coords);
    this.graphics.clear();
    this.graphics.lineStyle(2, PLANET_OUTLINE_COLOR, 1.0);
    this.graphics.beginFill(PLANET_COLOR);
    this.graphics.drawPolygon(this.polygon.points);
    this.graphics.endFill();

    this.body.setPolygon(coords);
  }

  updateShape() {
    if(this.paused) {
      return;
    }

    for(let i=1; i<PLANET_SURFACE_POINTS; i++) {
      const point = this.points[i];
      let inc = randInt(4);
			if(point.y-inc >= 0) {
				point.y -= inc;
			}
    }

		this._applyShape(this.points);
	}

  // Pause/resume changing shape
  togglePause() {
    this.paused = !this.paused;
  }
}

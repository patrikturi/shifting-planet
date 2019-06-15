import { randInt } from './Utils';

const PLANET_WIDTH = 600;
const PLANET_HEIGHT = 200;
const PLANET_SURFACE_POINTS = 40;
const PLANET_SURFACE_VERTICES = PLANET_SURFACE_POINTS*2;

const PLANET_COLOR = 0xd8ebe6;
const PLANET_OUTLINE_COLOR = 0x9F9F9F;

const MIN_PLAT_H = 0;
const MAX_PLAT_H = 180;
const MIN_PLAT_H_DIFF = 50;
const MIN_PLAT_LEN = 2;
const MAX_PLAT_LEN = 4;
const MIN_SLOPE_LEN = 2;
const MAX_SLOPE_LEN = 6;

export default class Planet {

  constructor(game, x, y) {
    this.game = game;
    // array of coordinates for vertices of the polygon
    this._createPlanetShape()
    this._initPlanetShapeTarget()

    this.polygon = new Phaser.Polygon();
    this.graphics = game.add.graphics(x, y);

    this.body = new Phaser.Physics.Box2D.Body(this.game, null, x, y, 0);
    this.body.static = true;
    this.body.friction = 0.8;

    this._applyShape(this.points);

    let pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    pauseKey.onDown.add(this.togglePause, this);
    this.paused = false;

    game.time.events.loop(Phaser.Timer.SECOND / 1.0, this.updateShape, this);
  }

  _createPlanetShape() {
    this.coords = [];
    // same array with points for easier handling
    this.points = [];
    // points specified clockwise
		for(let i=0; i<PLANET_SURFACE_POINTS; i++) {
      const step = PLANET_WIDTH/PLANET_SURFACE_POINTS;
      this.points.push({x: i*step, y: 100});
			this.coords.push(0,0);
    }

    this.points.push({x: PLANET_WIDTH, y: 0});
    this.coords.push(0, 0);
    this.points.push({x: PLANET_WIDTH, y: PLANET_HEIGHT}, {x: 0, y: PLANET_HEIGHT});
    this.coords.push(0, 0, 0, 0);
    this.points[0].y = 50;
  }



  _genPlatH(prevH) {
    let h = 0;
    let diff = 0;
    while(diff < MIN_PLAT_H_DIFF || (diff > 75 && diff < 125)) {
      h = MIN_PLAT_H + randInt(MAX_PLAT_H);
      if(prevH == null) {
        return h;
      }
      diff = Math.abs(h - prevH);
    }
    return h;
  }

  _genPlatLen() {
    return MIN_PLAT_LEN + randInt(MAX_PLAT_LEN);
  }

  _genSlopeLen() {
    return MIN_SLOPE_LEN + randInt(MAX_SLOPE_LEN);
  }

  _initPlanetShapeTarget() {
    this.target = []
    for(let p of this.points) {
      this.target.push({x: p.x, y: p.y});
    }
    let curH = this._genPlatH(null);
    let nextH = this._genPlatH(curH);
    let platRem = this._genPlatLen();
    let slopeLen = this._genSlopeLen();
    let slopeRem = slopeLen;
    let slopeI = 1;
    for(let i=0; i<PLANET_SURFACE_POINTS; i++) {
      const p = this.target[i];
      if(platRem > 0) {
        // Make platform
        p.y = curH;
        platRem--;
        if(platRem == 0) {
          slopeLen = this._genSlopeLen();
          slopeRem = slopeLen;
          slopeI = 1;
        }
      } else if(slopeRem > 0) {
        // Make slope/ramp
        let diff = nextH - curH;
        // h = diff * curI / slopeLen
        // This "bug" makes the terrain more interesting
        p.y = diff * slopeI / slopeLen;
        //p.y = curH + diff * slopeI / slopeLen;
        slopeI++;
        slopeRem--;
        if(slopeRem == 0) {
          curH = nextH;
          platRem = this._genPlatLen();
          nextH = this._genPlatH(curH);
        }
      } else {
        throw Error('Shouldn not happen, but start over instead');
      }
    }
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
      const p = this.points[i];
      const targetP = this.target[i];
      let maxGrow = p.y - targetP.y;
      let growLimitAbs = Math.min(Math.abs(maxGrow), Math.abs(maxGrow/40.0));
      let inc = randInt(Math.sign(maxGrow) * growLimitAbs);

			if(p.y-inc >= 0) {
				p.y -= inc;
			}
    }

		this._applyShape(this.points);
	}

  // Pause/resume changing shape
  togglePause() {
    this.paused = !this.paused;
  }
}

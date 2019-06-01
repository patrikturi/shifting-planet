import { randInt } from './Utils';

const PLANET_WIDTH = 600;
const PLANET_HEIGHT = 200;
const PLANET_SURFACE_POINTS = 10;

export default class Planet {

  constructor(scene, x, y) {
    this.scene = scene;
    this.posX = x;
    this.posY = y;
    this.points = [];
      // points specified clockwise
		for(let i=0; i<PLANET_SURFACE_POINTS; i++) {
			const step = PLANET_WIDTH/PLANET_SURFACE_POINTS;
			this.points.push({x: i*step, y:150});
		}
		this.points.push({x: PLANET_WIDTH, y:0});
		this.points.push({x: PLANET_WIDTH, y: PLANET_HEIGHT}, {x: 0, y: PLANET_HEIGHT});
    this.points[0].y = 50;
    // NOTE: one of the top points must be y=0, it would be better to have the coordinates
    // in a different coordinate system and transform each point for the phaser polygon
    //this.points[PLANET_SURFACE_POINTS].y = 50;

    this.planet = this._recreatePlanet(null, this.points);

    scene.time.addEvent({ delay: 500, callback: this.updateShape, callbackScope: this, loop: true });
  }

  _recreatePlanet(prevPlanet, points) {

    if(prevPlanet) {
      prevPlanet.destroy();
    }

    // Original position doesn't matter, it will be adjusted based on assigned origin
    let planet = this.scene.add.polygon(0, 0, points, 0x0000ff, 0.2);

    this.scene.matter.add.gameObject(planet, {
      isStatic: true, restitution: 0.1, friction: 0.5, frictionStatic: 1, shape: {
        type: 'fromVerts', verts: points, flagInternal: true
      }
    });

    // Workaround: by default origin is the center, calling setOrigin would desync the
    // body and the graphics, so we have to calculate position for the origin by desired top left point
    planet.setPosition(this.posX+planet.displayOriginX, this.posY+planet.displayOriginY);

    return planet;
  }

  updateShape() {

		for(let i=1; i<PLANET_SURFACE_POINTS; i++) {
			let point = this.points[i];
			let inc = randInt(4);
			if(point.y-inc >= 0) {
				point.y -= inc;
			}
			// if(point.y+inc < PLANET_HEIGHT) {
			// 	point.y += inc;
			// }
		}

		this.planet = this._recreatePlanet(this.planet, this.points);
	}

}

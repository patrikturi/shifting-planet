/* eslint no-unused-vars: "warn" */

const PLANET_WIDTH = 600;
const PLANET_HEIGHT = 200;
const PLANET_SURFACE_POINTS = 10;

class MainScene extends Phaser.Scene {

	constructor() {
		super();
		this.planetPoints = [];
		this.planet = null;
	}

	preload() {
	}

	create() {
		this.matter.world.setBounds();

		// points specified clockwise
		for(let i=0; i<PLANET_SURFACE_POINTS; i++) {
			const step = PLANET_WIDTH/PLANET_SURFACE_POINTS;
			this.planetPoints.push({x: i*step, y:0});
		}
		this.planetPoints.push({x: PLANET_WIDTH, y:0});
		this.planetPoints.push({x: PLANET_WIDTH, y: PLANET_HEIGHT}, {x: 0, y: PLANET_HEIGHT});

		this.planet = createPlanet(this, null, this.planetPoints);

		this.matter.add.rectangle(400, 250, 50, 50, {
			mass: 10, restitution: 0.1, frictionAir: 0.01, friction: 0.5, frictionStatic: 1
		});

		this.matter.add.mouseSpring();

		this.time.addEvent({ delay: 500, callback: this.updatePlanet, callbackScope: this, loop: true });
	}

	updatePlanet() {

		for(let i=1; i<PLANET_SURFACE_POINTS; i++) {
			let point = this.planetPoints[i];
			let inc = randInt(4);
			if(point.y+inc < PLANET_HEIGHT) {
				point.y += inc;
			}
		}

		this.planet = createPlanet(this, this.planet, this.planetPoints);
	}

	update() {
		if(this.gameOver) {
			return;
		}

	}
}

function createPlanet(scene, prevPlanet, points) {

	if(prevPlanet) {
		prevPlanet.destroy();
	}

	// Original position doesn't matter, it will be adjusted based on assigned origin
	let planet = scene.add.polygon(400, 400, points, 0x0000ff, 0.2);

	scene.matter.add.gameObject(planet, {
		isStatic: true, restitution: 0.1, friction: 0.5, frictionStatic: 1, shape: {
			type: 'fromVerts', verts: points, flagInternal: true
		}
	});

	// Workaround: by default origin is the center, calling setOrigin would desync the
	// body and the graphics, so we have to calculate position for the origin by desired top left point
	planet.setPosition(100+planet.displayOriginX, 300+planet.displayOriginY);

	return planet;
}

function randInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game',
	backgroundColor: '#efefef',
	physics: {
		default: 'matter',
		matter: {
				enableSleep: false,
				debug: true,
				debugShowInternalEdges: true,
				debugShowConvexHulls: true
		}
	},
	scene: MainScene
};

new Phaser.Game(config);

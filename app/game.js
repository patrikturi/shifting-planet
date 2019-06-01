/* eslint no-unused-vars: "warn" */

import MainScene from './MainScene';

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

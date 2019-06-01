/* eslint no-unused-vars: "warn" */

import MainScene from './MainScene';

const config = {
	type: Phaser.AUTO,
	width: 1024,
	height: 600,
	parent: 'game',
	backgroundColor: '#efefef',
	physics: {
		default: 'matter',
		matter: {
				enableSleep: true,
				debug: true,
				debugShowInternalEdges: true,
				debugShowConvexHulls: true
		}
	},
	scene: MainScene
};

new Phaser.Game(config);

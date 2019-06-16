import MainState from './MainState';
import Level from './Level';
/* eslint no-unused-vars: "warn" */
const DEBUG_BUILD = true;

window.onload = function() {

	let game = new Phaser.Game(1024, 600, Phaser.AUTO, 'Shifting Planet');

	Level.init(game);
	game.debugBuild = DEBUG_BUILD;
	game.state.add('MainState', MainState);
	game.state.start('MainState');
};

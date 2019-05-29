module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true
    },
    "plugins": ["jest"],
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
		"no-console": ["error", {
			"allow": ["error", "warn", "log"]
		}]
    },
	"globals": {
		"Phaser": true
	},
	"settings": {
		"import/core-modules": ["phaser"]
	}
};

# Do a dummy local deployment for testing
#
# npm deploy
# copy files
# start server

import os
import subprocess
import shutil

DIST_DIR = 'dist'


def copy_index():
	# Copy index.html and replace lib with production version
	with open('dev/index.html', 'r') as file:
		contents = file.read().replace('phaser.js', 'phaser.min.js')
		out_file = open('{}/index.html'.format(DIST_DIR), 'w')
		out_file.write(contents)
		out_file.close()


if __name__ == '__main__':

	if not os.path.exists(DIST_DIR):
		os.mkdir(DIST_DIR)
	subprocess.check_output('node_modules\\.bin\\webpack.cmd --mode=production -o {}/bundle.js'.format(DIST_DIR))

	copy_index()

	os.chdir(DIST_DIR)
	subprocess.call('python -m http.server')

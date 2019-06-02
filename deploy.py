# Do a dummy local deployment for testing
#
# npm deploy
# copy files
# start server

import glob
import os
import subprocess
import shutil

DIST_DIR = 'dist'


def copy_index():
	# Copy index.html and replace lib with production version
	with open('dev/index.html', 'r') as file:
		contents = file.read().replace('phaser.js', 'phaser.min.js') \
			.replace('box2d-plugin-full.js', 'box2d-plugin-full.min.js')
		out_file = open(DIST_DIR + '/index.html', 'w')
		out_file.write(contents)
		out_file.close()


if __name__ == '__main__':

	if not os.path.exists(DIST_DIR):
		os.mkdir(DIST_DIR)
	subprocess.check_output('node_modules\\.bin\\webpack.cmd --mode=production -o {}/bundle.js'.format(DIST_DIR))

	copy_index()
	for filename in glob.glob(os.path.join(r'lib/*.js')):
		shutil.copy(filename, DIST_DIR)
	shutil.copyfile('dev/style.css', DIST_DIR + '/style.css')
	shutil.rmtree(DIST_DIR + '/assets')
	shutil.copytree('dev/assets', DIST_DIR + '/assets')

	os.chdir(DIST_DIR)
	subprocess.call('python -m http.server')

module.exports = (grunt) ->

	grunt.config.init

		coffee:

			compile:
				files:
					'penner.js': 'penner.coffee'

		uglify:

			options:
				mangle:
					toplevel: true
				compress:
					dead_code: true
					unused: true
					join_vars: true
				comments: false

			standard:
				files:
					'penner.min.js': [
						'penner.js'
					]


	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-uglify'

	grunt.registerTask 'default', ['coffee', 'uglify']
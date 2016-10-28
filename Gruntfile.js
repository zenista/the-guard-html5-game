module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          keepalive: true,
          port: 9001,
          base: 'www'
        }
      }
    },
    browserify: {
      all: {
        src: 'www/src/Game.js',
        dest: 'www/game.bundle.js'
      },
      spec: {
        src: 'www/spec/Spec.js',
        dest: 'www/spec.bundle.js'
      }
    },
    watch: {
      scripts: {
        files: 'www/src/*.js',
        tasks: ['browserify']
      },
      specs: {
        files: 'www/spec/*.js',
        tasks: ['browserify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('default', ['browserify']);

};
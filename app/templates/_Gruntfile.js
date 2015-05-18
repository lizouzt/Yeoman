'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    tempBase: 'temp',
    srcBase: 'src',
    buildBase: 'build',
    less: {
      compile: {
        files: [{
          expand: true,
          cwd: '<%= srcBase %>',
          src: ['p/**/*.less','!c/*.less','!c/**/*.less','!**/mod/*.less','!mod/**/*.less','!util/**/*.less'],
          dest: '<%= buildBase %>',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      combine: {
        expand: true,
        cwd: '<%= buildBase %>',
        src: ['**/*.css', '!**/*-min.css'],
        dest: '<%= buildBase %>',
        ext: '-min.css'
      }
    },
    jst:{
      complie:{
        options:{
          amd:true,
          prettify:true,
          namespace:false,
          templateSettings : {},
          processContent: function(src) {
            return src.replace(/\r\n/g, '\n');
          }
        },
        files:[{
          expand: true,
          cwd: '<%= srcBase %>',
          src: ['**/*.jst.html'],
          dest: '<%= tempBase %>',
          ext: '.jst.js'
        }]
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: '<%= srcBase %>',
        src: ['c/common/**/*.js'],
        dest: '<%= buildBase %>'
      }
    },
    transport: {
      options: {
        debug: false,
        paths:['src']
      },
      trans: {
        expand: true,
        cwd: '<%= srcBase %>',
        src: ['**/*.js', '!**/*-min.js', '!c/common/**/*.js'],
        dest: '<%= tempBase %>'
      }
    },
    concat: {
      page: {
        options: {
          include: 'all',
          paths: ['temp'],
          separator: ';',
        },
        files: [{
          expand: true,
          cwd: '<%= tempBase %>',
          src: ['**/*.js','!**/*.jst.js','!c/**/*.js'],
          dest: '<%= buildBase %>',
          ext: '.js'
        }]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n /**********************************************\n * Handcrafted by <%= pkg.author.name %>, <%= pkg.author.url %>\n * Work enjoy with scaffold! \n * Version: v<%= pkg.version%> \n **********************************************/\n'
      },
      build: {
        expand: true,
        cwd: '<%= buildBase %>',
        src: ['**/*.js','!**/*-min.js'],
        dest: '<%= buildBase %>',
        ext: '-min.js'
      }
    },
    clean:{
      temp:{
        src:'<%= tempBase %>'
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= srcBase %>/{,*/}*.js'
      ]
    },

    browserSync: {
      files: ['./build/**/*.css','./src/**/*.js'],
      options: {
        watchTask: true,
        server: {
          baseDir: "./",
          index: "./html/index.html"
        },
      }
    },

    watch:{
      options: {
        ignoreInitial: true,
        ignored: ['*.txt','*.json']
      },
      assets:{
        files: ['./src/**/*.less'],
        tasks: ['less']
      }
    },
  });

  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-cmd-concat');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', [
    // 'jshint',
    'copy', 
    'jst', 
    'transport', 
    'concat', 
    'less', 
    'cssmin', 
    'uglify',
    'clean'
  ]);

  grunt.registerTask('sync', ['browserSync','watch']);

  grunt.registerTask('js', [
    // 'jshint',
    'jst',
    'transport',
    'concat',
    'clean'
  ]);

  grunt.registerTask('css', [
    'less', 
    'cssmin',
    'clean'
  ]);
};
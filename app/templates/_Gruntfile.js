'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    tempBase: 'temp',
    srcBase: 'src',
    buildBase: 'build',
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
          src: ['**/*-udt.html'],
          dest: '<%= srcBase %>',
          ext: '.js'
        }]
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: '<%= srcBase %>',
        src: ['common/**/*.js','**/*.jpg','**/*.png', '**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff'],
        dest: '<%= buildBase %>'
      }
    },
    less: {
      compile: {
        files: [{
          expand: true,
          cwd: '<%= srcBase %>',
          src: ['**/*.less','!common/*.less','!common/**/*.less','!**/mod/*.less','!mod/**/*.less','!mod/*.less','!util/**/*.less'],
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
    transport: {
      options: {
        debug: false,
        paths:['src'],
        alias:{
          'underscore': 'common/underscore'
        }
      },
      trans: {
        expand: true,
        cwd: '<%= srcBase %>',
        src: ['**/*.js', '!**/*-min.js','!common/**/*.js'],
        dest: '<%= tempBase %>'
      }
    },
    concat: {
      page: {
        options: {
          include: 'relative'
        },
        files: [{
          expand: true,
          cwd: '<%= tempBase %>',
          src: ['**/*.js','!**/mod/*.js','!util/**/*.js', '!**/*-min.js'],
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
        cwd: '<%= srcBase %>',
        src: ['**/*.js', '!**/*-sc.js', '!**/*.combo.debug.js','!**/*-min.js'],
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

    watch:{
      options: {

      },
      assets:{
        files: ['**/index/mod/*-udt.html','**/index/index.js','**/index/index.less','**/yanghuo/mod/*-udt.html','**/yanghuo/yanghuo.js','**/yanghuo/yanghuo.less','**/src/**/*.less','**/src/**/*.js'],
        tasks: ['jshint', 'copy','jst', 'transport', 'concat', 'less', 'cssmin','clean','clean']
      }
    },
  });

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
    'jshint',
    'copy', 
    'jst', 
    'transport', 
    'concat', 
    'less', 
    'cssmin', 
    'uglify',
    'clean'
  ]);

  grunt.registerTask('js', [
    'jshint',
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
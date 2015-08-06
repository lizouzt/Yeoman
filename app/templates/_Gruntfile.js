'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    tempBase: 'temp',
    srcBase: 'src',
    buildBase: 'build',
    libBase: 'deps/lib/src/',
    version: "0.0.16",
    env: "dev",
    copy: {
      main: {
        expand: true,
        cwd: '<%= libBase %>',
        src: ['**/*.js','**/*.less','**/*.jst.html'],
        dest: '<%= srcBase %>',
      }
    },
    less: {
      compile: {
        files: [{
          expand: true,
          cwd: '<%= srcBase %>',
          src: ['p/**/*.less','!lib/**/*.less'],
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
          src: ['**/*.jst.html', '!deps'],
          dest: '<%= srcBase %>',
          ext: '.jst.js'
        }]
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
        src: ['**/*.js', '!**/*-min.js'],
        dest: '<%= tempBase %>'
      }
    },
    concat: {
      lib: {
        options: {
          include: 'all',
          paths: ['temp'],
          separator: ';',
        },
        files: [{
          expand: true,
          cwd: '<%= tempBase %>',
          src: ['lib/**/*.js','!lib/**/*.jst.js'],
          dest: '<%= tempBase %>',
          ext: '.js'
        }]
      },
      mod: {
        options: {
          include: 'all',
          paths: ['temp'],
          separator: ';',
        },
        files: [{
          expand: true,
          cwd: '<%= tempBase %>',
          src: ['c/**/*.js','!c/**/*.jst.js'],
          dest: '<%= tempBase %>',
          ext: '.js'
        }]
      },
      page: {
        options: {
          include: 'all',
          paths: ['temp'],
          separator: ';',
        },
        files: [{
          expand: true,
          cwd: '<%= tempBase %>',
          src: ['p/**/*.js','!p/**/*.jst.js'],
          dest: '<%= buildBase %>',
          ext: '.org.js'
        }]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n /**********************************************\n * Handcrafted by <%= pkg.author.name %>, <%= pkg.author.url %>\n **********************************************/\n'
      },
      build: {
        expand: true,
        cwd: '<%= buildBase %>',
        src: ['**/*.org.js','!**/*-min.js','!c/deps/**/*.js'],
        dest: '<%= buildBase %>',
        ext: '.js'
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
        '<%= build %>/{,*/}*.js'
      ]
    },

    browserSync: {
      files: ['./build/**/*.css','./src/**/*.js'],
      options: {
        watchTask: true,
        server: {
          baseDir: "./",
          index: "./html/inventory/order-deliver-confirm.html"
        },
      }
    },

    watch:{
      options: {
        ignoreInitial: true,
        ignored: ['*.txt','*.json']
      },
      assets:{
        files: ['**/*.less','src/**/*.jst.html'],
        tasks: ['less','jst']
      }
    },

    wooha_html: {
      dist: {
        cwd: './demo/',
        src: ['**/*.html', '!**/*.jst.html', "!ueditor/**/*.html"],
        dest: './html/',
        options: {
          version: '<%= version %>',
          env: '<%= env %>',//["dev", "pro"]
          build: "build",
          main: "index",
          minify: {
              preserveLineBreaks: true,
              minifyCSS: true, 
              minifyJS: true, 
              maxLineLength: 1024
          },
          beautify: false
        }
      }
    }
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
  grunt.loadNpmTasks('grunt-wooha-html');

  grunt.registerTask('default', [
    'jst', 
    'transport', 
    'concat', 
    'uglify',
    'less', 
    'cssmin', 
    'wooha_html',
    'clean'
  ]);

  grunt.registerTask('sync', ['browserSync','watch']);
  
  grunt.registerTask('uplib', ['copy']);
  
  grunt.registerTask('html', ['wooha_html']);

  grunt.registerTask('js', [
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
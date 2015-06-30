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
          src: ['p/**/*.less','!p/**/mod/*.less'],
          dest: '<%= buildBase %>',
          ext: '.org.css'
        }]
      }
    },
    cssmin: {
      combine: {
        expand: true,
        cwd: '<%= buildBase %>',
        src: ['**/*.org.css', '!**/*-min.css'],
        dest: '<%= buildBase %>',
        ext: '.css'
      }
    },
    copy: {
      deps: {
        expand: true,
        cwd: '<%= srcBase %>',
        src: ['c/common/**/*.*'],
        dest: '<%= buildBase %>',
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
        src: ['**/*.js', '!**/*-min.js', '!c/deps/**/*.js'],
        dest: '<%= tempBase %>'
      }
    },
    concat: {
      mod: {
        options: {
          include: 'all',
          paths: ['temp'],
          separator: ';',
        },
        files: [{
          expand: true,
          cwd: '<%= tempBase %>',
          src: ['c/**/*.js','!c/deps/*.js'],
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
          src: ['p/**/*.js','p/**/*.jst.js'],
          dest: '<%= buildBase %>',
          ext: '.org.js'
        }]
      }
    },
    copy: {
      mod: {
        expand: true,
        cwd: '<%= tempBase %>',
        src: ['c/**/*.js'],
        dest: '<%= buildBase %>',
        ext: '.org.js'
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

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= build %>/{,*/}*.js'
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
    'less', 
    'cssmin', 
    'copy',
    'jst', 
    'transport', 
    'concat',
    'copy',
    'uglify',
    'clean'
  ]);

  grunt.registerTask('sync', ['browserSync','watch']);

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
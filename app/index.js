'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var bower = require('bower');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  askProject: function(){
    var done = this.async();
    this.log(yosay(
      'Welcome to ' + chalk.red('Wooha') + ' generator!'
    ));

    var depPromts = [{
      type: 'checkbox',
      name: 'dependencyArray',
      message: 'project dependencies',
      choices: [{
        name: '1) lesshat',
        value: 'lesshat',
        checked: false
      },{
        name: '2) requireJS',
        value: 'requirejs',
        checked: false
      },{
        name: '3) underscore',
        value: 'underscore',
        checked: false
      },{
        name: '4) backbone',
        value: 'backbone',
        checked: false
      },{
        name: '5) bootStrap',
        value: 'bootStrap',
        checked: false
      },{
        name: '6) jQuery',
        value: 'jQuery',
        checked: false
      }]
    }];
    this.prompt(depPromts, function(props){
      this.dependencies = props.dependencyArray;
      done();
    }.bind(this));
  },

  askAuthor: function(){
    var done = this.async();
    var prompts = [{
      name: 'component',
      message: 'name of component:',
      default: this.appname
    },{
      name: 'author',
      message: 'author of component:',
      default: 'Wooha•Yeo'
    },{
      name: 'email',
      message: 'email of author:',
      default: 'Wooha•Yeo@gmail.com'
    },{
      name: 'gitPage',
      message: 'Git page of author:',
      default: 'https://github.com/lizouzt'
    }];

    this.prompt(prompts, function (props) {
        this.componentName = props.component;
        this.destinationRoot(this.componentName);

        this.author = props.author;
        this.email = props.email;
        this.url = props.gitPage;

        done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.mkdir('src');
      this.mkdir('src/c');
      this.mkdir('src/c/widget');
      this.mkdir('src/c/utils');
      this.mkdir('src/p');
      this.mkdir('src/p/index');
      this.mkdir('src/p/index/mod');
      this.mkdir('html');

      var packageFile = this.readFileAsString(this.templatePath('/_package.json'));
      packageFile = JSON.parse(packageFile);
      packageFile.name = this.componentName;
      packageFile.author = {
        name: this.author,
        email: this.email,
        url: this.gitPage
      };
      this.write(this.destinationPath('/package.json'), JSON.stringify(packageFile, null, 4));

      var bowerFile = this.readFileAsString(this.templatePath('/_bower.json'));
      bowerFile = JSON.parse(bowerFile);
      bowerFile.name = this.componentName;
      this.write(this.destinationPath('/bower.json'), JSON.stringify(bowerFile, null, 4));

      this.fs.copy(
        this.templatePath('_Gruntfile.js'),
        this.destinationPath('/Gruntfile.js')
      );

      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('/.bowerrc')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('/.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('/.jshintrc')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('/.gitignore')
      );
    },

    firstPage: function(){
      this.fs.copy(
        this.templatePath('inc/config.less'),
        this.destinationPath('/src/c/config.less')
      );
      this.fs.copy(
        this.templatePath('inc/index.less'),
        this.destinationPath('/src/p/index/index.less')
      );
      this.fs.copyTpl(
        this.templatePath('inc/index.html'),
        this.destinationPath('/html/index.html'),
        { title: 'Constructed' + this.componentName + ' with Yeoman' }
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });

    bower.commands.install(this.dependencies, {save: true}).on('end', function(installed){}.bind(this));
  }
});

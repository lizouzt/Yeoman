'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  askProject: function(){
    var done = this.async();
    this.log(yosay(
      'Welcome to ' + chalk.red('Wooha') + ' generator!'
    ));

    var prompt = [{
      name: 'component',
      message: 'name of component:',
      default: this.appname
    }];

    this.prompt(prompt, function(props, err){
      if (err) {
        return this.emit('error', err);
      }
      this.componentName = props.component;
      this.destinationRoot(this.componentName);

      done();
    }.bind(this));
  },

  askAuthor: function(){
    var done = this.async();
    var prompts = [{
        name: 'author',
        message: 'author of component:',
        default: 'Wooha•Yeo'
    },{
        name: 'email',
        message: 'email of author:',
        default: 'Wooha•Yeo@gmail.com'
    }];

    this.prompt(prompts, function (props, err) {
        if (err) {
            return this.emit('error', err);
        }

        this.author = props.author;
        this.email = props.email;
        done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.mkdir('src');
      this.mkdir('src/c');
      this.mkdir('src/c/widget');
      this.mkdir('src/p');
      this.mkdir('src/p/index');
      this.mkdir('src/p/index/mod');
      this.mkdir('src/p/index/tpl');
      this.mkdir('html');

      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('/package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath(path.join('', '/bower.json'))
      );
      this.fs.copy(
        this.templatePath('_Gruntfile.js'),
        this.destinationPath('/Gruntfile.js')
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
        this.destinationPath('/src/p/index.less')
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
  }
});

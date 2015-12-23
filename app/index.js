'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var foldername = path.basename(process.cwd());

var CppSuiteGenerator = module.exports = function CppSuiteGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CppSuiteGenerator, yeoman.generators.Base);

CppSuiteGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'packageName',
    message: 'What is the name of the package?',
    default: 'OpenMagento'
  }, {
    name: 'moduleName',
    message: 'What is the name of the module:',
    default: 'MyModule'
  }, {
    name: 'author',
    message: 'Who is the creator?',
    default: 'Someone'
  }];

  this.prompt(prompts, function (props) {
    this.packageName = props.packageName;
    this.moduleName = props.moduleName;
    this.author = props.author;
    cb();
  }.bind(this));
};

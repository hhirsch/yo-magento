'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var foldername = path.basename(process.cwd());

var MageModuleGenerator = module.exports = function MageModuleGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.baseDir = options.env.cwd;

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(MageModuleGenerator, yeoman.generators.Base);

MageModuleGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'namespace',
    message: 'What is the namespace you want to use?',
    default: 'OpenMagento'
  }, {
    name: 'moduleName',
    message: 'What is the name of the module:',
    default: 'MyModule'
  },
  {
    type: 'select',
    name: 'codePool',
    message: 'Which code pool do you want to use?',
    choices: [
      {name: "Local", value: "local"},
      {name: "Community", value: "community"}
    ],
    default: 'community'
  },
  {
    type: 'checkbox',
    name: 'elements',
    message: 'Which elements should be created?',
    choices: [
      {name: "Layout File", value: 'layout'},
      {name: "Front Controller",  value: 'frontController'}
    ],
      default: false
    },
  {
    name: 'author',
    message: 'Who is the creator?',
    default: 'Someone'
  }];

  this.prompt(prompts, function (props) {
    this.namespace = props.namespace;
    this.moduleName = props.moduleName;
    this.codePool = props.codePool;
    this.author = props.author;
    this.setup = false;
    this.adminhtml = false;
    this.elements = props.elements;
    this.fullModuleName = props.namespace + '_' + props.moduleName;
    this.moduleIdentifier = props.namespace.toLowerCase() + props.moduleName.toLowerCase();
    this.modulePath = 'app/code/' + this.codePool + '/' + this.namespace + '/' + this.moduleName + '/';
    this.controllers = this.baseDir + '/' + this.modulePath + 'controllers/';
    cb();
  }.bind(this));
};

MageModuleGenerator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/etc');
    this.mkdir('app/etc/modules');
    this.mkdir('app/code');
    this.mkdir('app/code/' + this.codePool);
    this.mkdir('app/code/' + this.codePool + '/' + this.namespace);
    this.mkdir('app/code/' + this.codePool + '/' + this.namespace + '/' + this.moduleName);

    this.mkdir(this.modulePath + 'Helper');
    this.template('helper.php', this.modulePath + 'Helper/Data.php');
    this.mkdir(this.modulePath + 'Model');
    this.template('model.php', this.modulePath + 'Model/' + this.moduleName + '.php');

    if (this.elements.length) {
        if (this.elements.indexOf('frontController') !== -1) {
          this.mkdir('controllers');
          this.template('front_controller.php', this.controllers + 'IndexController' + '.php');
        }

        if (this.elements.indexOf('layout') !== -1) {

        }
    }

    this.template('config.xml', this.modulePath + 'etc/config.xml')
    this.template('etc-modules.xml', 'app/etc/modules/' + this.namespace + '_' + this.moduleName + '.xml');

};

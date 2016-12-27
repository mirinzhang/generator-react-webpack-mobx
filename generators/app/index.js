const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
    constructor(args, opts){
        super(args, opts);

        this.projectName = args[0] || this.appname;
        this.projectDir = !!args[0] ? `${args[0]}/` : '';
    }

    prompting() {
        let done = this.async();

        this.log(yosay(`Welcome to use ${chalk.red('react-webpack-mobx')} generator!`));

        this.eslint = true;
        this.license = 'ISC';
        this.description = 'A react project';
        this.repo = '';
        this.author = '';

        const prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'name of app: ',
                default: this.projectName
            },
            {
                type: 'input',
                name: 'description',
                message: 'description: ',
                default: this.description
            },
            {
                type: 'confirm',
                name: 'eslint',
                message: 'use eslint: ',
                default: this.eslint
            },
            {
                type: 'input',
                name: 'repo',
                message: 'git repository: ',
                default: this.repo
            },
            {
                type: 'list',
                name: 'license',
                message: 'choice license: ',
                choices: [
                    {
                        name: 'ISC',
                        value: 'ISC'
                    },
                    {
                        name: 'MIT',
                        value: 'MIT'
                    }
                ],
                default: this.license
            },
            {
                type: 'input',
                name: 'author',
                message: 'author: ',
                default: this.author
            }
        ];

        this.prompt(prompts).then((props) => {
            this.props = props;
            done();
        });
    }

    writing() {
        // get template path
        const templatePath = this.sourceRoot();

        // set default config
        this.props.repo = this.props.repo || 'https://github.com/ybing/react-webpack-mobx.git';
        this.props.author = this.props.author || 'MiRinZhang <noodles@yabing.me>';

        // static config
        let dirList = [ 'src', '.babelrc', '.editorconfig','README.md'];

        // custom config
        let customConfig = [
            {
                template: 'index.html',
                destination: 'index.html',
                params: {title: 'React App'}
            },
            {
                template: `${templatePath}/webpack.config.js`,
                destination: 'webpack.config.js',
                params: {enableEslint: this.props.eslint}
            },
            {
                template: `${templatePath}/package.json`,
                destination: 'package.json',
                params: {params: this.props}
            }
        ];

        // use or not eslint
        if(this.props.eslint) {
            dirList = dirList.concat(['.eslintrc']);
        }

        // copy .npmignore to .gitignore
        this.fs.copy(`${templatePath}/.npmignore`, `${this.projectDir}/.gitignore`);

        // copy static config
        dirList.forEach((name) => {
            this.fs.copy(`${templatePath}/${name}`, this.projectDir + name);
        });

        // copy custom config
        customConfig.forEach((config) => {
            this.fs.copyTpl(
                this.templatePath(config.template),
                this.destinationPath(this.projectDir + config.destination),
                config.params
            );
        });
    }

    install() {
        this.log(chalk.blue('\nInstalling packages\n'));
        this.runTipText = `Run\n ${chalk.cyan('npm run dev')} or ${chalk.cyan('yarn dev')} \nto start the project`;

        if(this.projectDir){
            const subDir = process.cwd() + '/' + this.projectDir;
            process.chdir(subDir);
            this.runTipText = `Run\n ${chalk.cyan('cd ' + this.projectDir + ' && npm run dev')} or ${chalk.cyan('cd ' + this.projectDir + ' && yarn dev')} \nto start the project`;
        }

        let done = this.async();
        this.spawnCommand('npm', ['install'])
            .on('exit', (code) => {
                if (code) {
                    done(new Error(`code ${code}`));
                } else {
                    done();
                }
            })
            .on('error', done);
    }

    end() {
        this.log(yosay(
            `${chalk.yellow('Successfully!')}\nEnjoy it!'`
        ));
        this.log(this.runTipText);
    }
};
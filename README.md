# ExpressDemo
for tutorial purpose
## 1.NPM

install
npm i -g npm@5.5.1 //-g for global / @5.5.1 for specific version of Npm…use sudo if required.

check version
npm -v

PACKAGE.json
before you add any Node package to your application, you need to create a file called package.json.
this includes basic information, metadata about your application.

create package.json
npm init	//this will ask a bunch of question
npm init —yes //faster way create with default value

So before adding any node package to your node application you need to added package.json file

Installing node package //npmjs.com find package here

npm install underscore //or  npm i underscore — for utility

npm i mongoose //for mongoldb

- in package.json we define all the dependencies and their version

npm i   //— to restore packages

semantic versioning

"dependencies": {
    "mongoose": "^5.8.4", //major.minor.patch
    "underscore": "^1.9.1"
  }

//to list down all the dependencies and their exact version,
 as version may differ from what is defined inside package.json after restoring using (npm i)
because of semantic versioning.
npm list	//to see all the app dependency and its nested dependencies

npm list —depth=0 //see only the app dependencies without  its nested dependencies


npm view mongoose //to see mongoose detail package.json
npm view mongoose dependencies
nom view mongoose version 


to find which version of dependency are out dated
npm outdated

# 2. DEV dependency

many dependency are not to be part of app, like one for unit test, static analyser. etc

eg: jshint //static analyser for JS..looks for static

such dependency	are installed using following common

npm install joshing —save-dev

in package.json
"devDependencies": {
    "jshint": "^2.11.0-rc1"
  }


unistalling packages
npm uninstall mongoose //un in place of uninstall 

Working with Global Packages 
npm is global package//express
//these are global package

npm install -g npm

all outdate global packages
npm -g outdated

to uninstall global packages
npm un -g packageName

## EXPRESS ADVANCED

middleware
Configuration
debugging
Templating

middleware:  or middleware function

app.use(express.json());  
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));  //to serve static files from a given folder..'public' is the name of the folder,

//Third party middle ware ..these require- install and require
//like:- npm install helmet --save/&/const helmet = require('helmet') 
//Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet()) 
app.use(morgan('tiny')) //to log http request.

# CONFIGURATION
How to store configuration setting for your application.
- diff config for diff state (dev, staging, production.)

- npm i config //install
- create a config folder
- create a default config file called default.json
- create config for development env, development.json
- create config for production env, production.json
- Remember to define the env by using “export NODE_ENV=development or export NODE_ENV=production”
- NOTE:- this env name should match the config json file name, else will through error.

usage:-
sample json in config file
{
    "name" : "my-express-app-dev",
    "mail" : {
        "host" : "dev-mail-server"
    }
}

— in index.js
const config = require(‘config’)

console.log('Application name = ' + config.get('name')) //name of the config property
console.log('mail server = ' + config.get('mail.host'))

VNOTE:- don’t store password like mail server password in the config file as this will be visible to all the people 
who will have access to the source control repository.

TO deal with such scenario, we store such secrets in the environment variables.
in development env, export app_password=1234

in production environment:-
we should have a configuration panel for storing our environment variables. so we store all these pass and secrets in env variable and read them using config module.
 way to do this 
create a file
- custom-environment-variables.json.  //name is very important, should be same.
- //remember we exported the env variable=> export app_password=1234 in terminal
{
    "mail" : {
        "password" : "app_password" 
    }
}
- console.log('mail server = ' + config.get('mail.password’))

DEBUGGING.. using debug package
console.log(‘some debug message’)
better way to log debug message

- console.log will be replace by a debug function.
- these calls can be enabled or disabled using env variables //   export DEBUG=app:startup —this will enable only the debugger with this namespace.

sample:-
const startupDebugger = require('debug')('app:startup')    //app:startup is defining of a namesapce
const dbDebugger = require('debug')('app:db')   //returns a debugger function

// console.log("morgan enabled")
    startupDebugger("morgan enabled")

dbDebugger('connected to databse')

in the Terminal sett the env variable to enable a specific debugger.
export DEBUG=app:startup

//for multiple namespace debugger
export DEBUG=app:startup,app:db	//namespaces as defined earlier during require

export DEBUG=app:*		//wildcard, to see all the debug message from all the namespaces

to start the application with explicit defining the env variable,
DEBUG=app:db nodemon index.js

Note:- to reset a env variable
export DEBUG=

# TEMPLATING ENGINE
we generally return json response, some time html is need to be returned.
this is where template engine is used to create dynamic html and returning it to client.

package install:-  npm i pug

int he  index.js
//we need to set the view engine of the app.
app.set('view engine','pug')  //app.set(‘nameOfTheProperty’, ’templating engine THAT IS PUG ’), so when we set this, express will load this..no need to require
app.set(‘views’, ‘./views’)	//default..meaning all the html template will be in this folder..no need to set ncless if you want to change the location.
					//create a folder named views to store all the templates
create index.pug in this folder
html
    head
        title= titleVar
    body
        h1= messageVar
here titleVar and messageVar can be set dynamically




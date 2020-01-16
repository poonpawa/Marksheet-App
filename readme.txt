
Download node.js and npm
- follow below link for more information
https://www.tutorialspoint.com/nodejs/nodejs_environment_setup.htm


Check if they are installed by typing below commands
- npm --version
- node --version

To create a package.json run below command in your project folder

> npm init
u will be asked couple of questions like below
 = name : project name
 = version : 1.0.0
 = description : ur own detail
 = main : app.js
 = test command :leave blank
 = git repo : blank
 = keywords : blank
 = author : ur name
 
__________installing Electron_________
 
npm install --save-dev electron

edit ur package.json by addingbelow lines


"scripts": {
      "start": "electron ."
   }
__________installing other packages_________

npm install <package_name> --save

replace package_name with following names and run the command
- jquery
- handlebars
- password-hash
- quick-otp
- requirejs

________running electron______________
go inside project folder and run:

> node start

To Start the application 
> electron app.js
> electron .

______________deploying the app______________
- With electron-packager - install electron-packager
- electron-packager C:\Users\poonpawa\Desktop\ElectronApp marksheetApp --electron-version=1.8.8 --all

  
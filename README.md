# 9mng

An offline financial manager, found [here](https://mmihira.github.io/9mng).
Made it to learn some javascript,html,css and frontend frameworks.

Made using AngularJS, HTML5, D3, PapaParse, and Bootstrap.

## Usage

- Setup a new database in the app, by adding at least one account.
- Download your financial data in .csv format.
- Upload the data into the app in the update tab.
- View the finacial dashboard in the dasboard tab.
- Categorise the data as required.
- Finally, save your account. The resulting
  text file can be opened again using the app.

## How to Build

1 - Clone this repo ( pull only the master branch to reduce the file size if you want).<br>
2 - Install nodejs, npm, bower, and grunt.<br>
3 - cd into the clone directory and type in the following :<br>
4 - npm install <br>
4 - bower install<br>
6 - grunt build --force<br>

A folder called dist should be made with the project.
Open up dist/index.html

Note : For now, minification has been disabled as uglify.js doesn't support
some of the newer ES6 syntax.



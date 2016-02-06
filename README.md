# 9mng

An open source, single page, offline financial manager, found [here](https://mmihira.github.io/9mng). 

Made using AngularJS, HTML5, D3, PapaParse, and Bootstrap.

## Usage

- To view a demo using an example database click on Example.<br>

- To setup a new database add at least one account in the start page<br>
  and then click the create button.<br>
- Download your financial data in .csv format.<br>
- Upload the data into the app in the update tab.<br>
- View the finacial dashboard in the dashboard tab.<br>
- Categorise the data as required in the categories tab.<br>
- Finally, save your account. The resulting<br>
  text file can be opened again using the app.<br>

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



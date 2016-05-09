[![Build Status](https://travis-ci.org/andela-kndungu/document-ms.svg?branch=master)](https://travis-ci.org/andela-kndungu/document-ms)
[![Coverage Status](https://coveralls.io/repos/github/andela-kndungu/document-ms/badge.svg?branch=master)](https://coveralls.io/github/andela-kndungu/document-ms?branch=master)

# Document Management System

![Quiz app icon](https://cloud.githubusercontent.com/assets/17295379/15103681/de0b7cb8-15b6-11e6-8d3e-1ae4500763c9.png)

Andela's Javascript curriculum third checkpoint.

## Accessing the API the easy way
Navigate to `http://ennovate.xyz` on your browser

## Accessing the API the hard way

##Prerequisites

####Installing `git`
Follow the instructions at `https://git-scm.com/book/en/v2/Getting-Started-Installing-Git` to install `git` which is required to clone the repository.

####Installing `node`
1. Visit `https://nodejs.org/` and follow the instructions provided to install `node`.
2. Follow the instructions at `https://docs.npmjs.com/getting-started/fixing-npm-permissions` to be able to install `npm` packages globally without providing the root password.

#### Installing Mongo
Visit `https://www.mongodb.com/download-center?jmp=nav#community` and follow the instructions provided to install mongodb.

## Downloading the project and installing dependencies
From a terminal run the following commands:

```bash
cd ~/desktop

git clone https://github.com/andela-kndungu/document-ms.git

cd document-ms

npm install
```

## Defining environment variables
From a terminal do the following

```bash
cd ~/desktop/document-ms

vim .env

# Press i to enter insert mode

# Paste the following
PORT=3000
DATABASE_URI='mongodb://localhost/document-ms'
SECRET_KEY='thisIsMySecret' # Can be any string

# Press the escape key to get out of insert mode
# Type ':wq' and then press enter to save and exit

```

## Starting the server

From a terminal run the following command:
```bash
sudo mongod # Provide your password when prompted then press enter
```
On a different terminal run the following commands

```bash
cd ~/desktop/document-ms

node app.js
```
Now navigate to `http://localhost:3000/` on your browser

## Running the tests
From a terminal run the following commands:

```bash
# Press CTRL + C on your keyboard to stop node if it is running

cd ~/desktop/document-ms # Just to be sure

npm test
```

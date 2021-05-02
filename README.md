# APIMarvel

* [About APIMarvel](#about-apimarvel)
* [Key Features](#key-Features)
* [Installation](#installation)

## About APIMarvel

This code allows you to create a branch asking for the name and address of other comics that will be available in this new branch, as well list the comics and by clicking on the image a modal with information (Title, Volume, Launch date, number of pages, description, in which branch is available, characters).

## Key Features

1. API Marvel
2. PHP Native
3. JavaScript
4. JQuery
5. MySQL

## Installation

In js/app.js the first constant, goes the path where the php file is located, where information is consulted

```sh
/* This is used to avoid writing the full path in each ajax request */
 /* If your localhost occupies port just write it in this line */
     const urlReq = `http://localhost/apiMarvel/php/`
```

In js / app.js in the second constant you must write your apikey and hash obtained from the marvel page

```sh
const apiKeys = `ts=1&apikey=aquiTuAPIKey&hash=aquiTuHash`;
```

Enter the baseDatos folder and import the file to your MySQL

```sh
baseDatos/prueba.sql
```
> If you don't have apikey go to the [Marvel](https://developer.marvel.com/) page

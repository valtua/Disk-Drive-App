# Disk Drive App

## Introduction

The Disk Drive App allows users to upload, download and delete files from a personal space reserved for them. It consists of a React frontend environment that makes calls to a Node API for the backend.

## Features

-   Create a user
-   Login and receive an identification token
-   Upload files to a personal disk drive
-   Download a file
-   Create folders to organize files
-   Download folders in a compressed format (.zip)
-   See all of the files and folders inside the personal disk
-   Delete files and folders
-   Update profile information

## Technologies

Disk Drive App uses a number of open source technologies to work properly:

-   [React JS](https://reactjs.org/)
-   [Node JS](https://nodejs.org/en/)
-   [Express](http://expressjs.com/)
-   [MySQL](https://www.mysql.com/)

## Libraries

To make the App function the following packages are implemented:

-   [react-router-dom](https://www.npmjs.com/package/react-router-dom)
-   [Minimal UI](https://mui.com/)
-   [express-fileupload](https://www.npmjs.com/package/express-fileupload)
-   [express-static](https://www.npmjs.com/package/express-static)
-   [mysql2](https://www.npmjs.com/package/mysql2)
-   [dotenv](https://www.npmjs.com/package/dotenv)
-   [cors](https://www.npmjs.com/package/dotenv)
-   [bcrypt](https://www.npmjs.com/package/bcrypt)
-   [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
-   [zip-a-folder](https://www.npmjs.com/package/zip-a-folder)
-   [sharp](https://www.npmjs.com/package/sharp)

## Development

Disk Drive App uses a number of technologies to make the development easier:

-   [ESLint](https://eslint.org/)
-   [Morgan](https://github.com/expressjs/morgan)
-   [Nodemon](https://nodemon.io/)
-   [Prettier](https://prettier.io/)

## Installation

The App requires [Node JS](https://nodejs.org/) v10+ and [React JS](https://reactjs.org/) v12+ to run.

Install the dependencies (also devDepencies if desired) and start the server:

```sh
cd Disk-Drive-App
npm i
```

Create a database on MySQL:

```sql
CREATE DATABASE <database_name>;
```

Change the file name "_.env.example_" to "_.env_" and introduce the variable values.

-   PORT - A port number for the react frontend
-   BACKEND_PORT - A port number for the backend server to listen
-   MYSQL_HOST - A valid host from MySQL
-   MYSQL_USER - A valid user from MySQL
-   MYSQL_PASS - A valid password associated with the MySQL user
-   MYSQL_DB - A valid database name
-   SECRET - A random alphanumeric string of characters

Initialize the database:

```sh
npm run initdb
```

## Launch

Finally start the backend server:

```sh
npm run server
```

Or start the server in development mode:

```sh
npm run dev
```

Open another terminal to start the react frontend:

```sh
npm start
```

## Credits

Disk Drive App was made by:

-   [Adrían González Filgueira](https://github.com/AdrianGonzalezFilgueira)
-   [David Gómez Frieiro](https://github.com/davidgomezfrieiro)

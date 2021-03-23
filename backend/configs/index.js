'use strict';

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.resolve(__basedir, ".env")
})


let config = {
    hostname: 'localhost',
    port: 5000,
    viewDir: './app/views',

    db_host: process.env.MYSQL_HOST,
    db_username: process.env.MYSQL_USER,
    db_password: process.env.MYSQL_PASS,
    db_port: process.env.MYSQL_PORT,
    db_database: process.env.MYSQL_DB,
    db_dialect: "mysql",

    jwt_expiration: '24h',
    jwt_secret: 'MIGqAgEAAiEAnbTicpEPpd5sIJ2k61PB0KJYfim3FH6s3tt6RwpNnsECAwEAAQIg',

    redis_port: 6379,
    redis_host: 'locahost',
    redis_pass: '',

    cloudinary_cloud_name:"blossomanalytics",
    cloudinary_api_key:875684348465699,
    cloudinary_api_secret:"ldUYiIZR4SJ4xVOX99K7AGE1xUc",

    dropbox_secret: "1Ii1d44qwvAAAAAAAAAAxbDYwJa6DZKJ1UBZT_qz8khyOoIJvyHRMaJ_xL6pZ0jU"
};

module.exports = config;
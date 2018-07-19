"use strict";
const convert = require('koa-convert');

/**
 * Body parser , вже просто Body
 */
module.exports = function bodyparser(app) {
    var requestbody = require('koa-body'); // взята інша бібліотека з метою заборобони партити вхідні дані в запиті
    app.use(convert(requestbody()));
};

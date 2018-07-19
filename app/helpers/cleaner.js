"use strict";

var  cleanerFunc = function cleaner(str){
    return str.replace(/['"]/g,"");
};

module.exports = cleanerFunc;
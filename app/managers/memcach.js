"use strict";
/*
curl -XPOST   "127.0.0.1:8081/goods" -d 'Hello' -H 'Content-Type: text/plain'
curl -XPOST   "127.0.0.1:8081/goods" -d '{"id":3,"name":"Test123"}' -H 'Content-Type: application/json'
curl -XGET    "127.0.0.1:8081/goods/Hello"
curl -XDELETE "127.0.0.1:8081/goods/Hello"

curl -XPOST   "127.0.0.1:8081/goods" -d 'Hello, my friends!' -H 'Content-Type: text/plain'
curl -XGET    "127.0.0.1:8081/goods/Hello, my friends!"
curl -XDELETE "127.0.0.1:8081/goods/Hello, my friends!"

 */


const config = require('config'),
      Memcached = require('memcached');

      Memcached.config.poolSize = 10;

let countKeys =  '';
let md5Func = require('../helpers/jsmd5');
const lifeTime = 300;

const memcached = new Memcached(config.memcached.server,':',config.memcached.port);

module.exports = {

    getMemcached: function getIdFromMC(id) {
        return new Promise(function (resolve, reject) {
            id = md5Func(id);
            console.log('get', id);
            memcached.get(id, function (err, data) {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    },

    setMemcached: function setNewIdToMC(inputData) {
        return new Promise(function (resolve, reject) {
            //         memcached.set(countKeys++,inputData,lifeTime,function (err, data) {
            /*        memcached.stats(function(err,data){
                          countKeys = data[0].curr_items;
                      });*/

            countKeys = md5Func(inputData);
            console.log('post', countKeys); // problem with keys! there are delete in real time
            memcached.set(countKeys, inputData, lifeTime, function (err, data) {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    },

    delMemcached: function removeIdInMC(id) {
        return new Promise(function (resolve, reject) {
            id = md5Func(id);
            console.log('delete', id);
            memcached.delete(id, function (err) {
                if (!err) {
                    resolve('true');
                } else {
                    reject(err);
                }
            });
        });
    }

};
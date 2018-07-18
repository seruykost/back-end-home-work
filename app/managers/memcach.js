"use strict";
/*
curl -XPOST   "127.0.0.1:8081/goods" -d '{"id":3,"name":"Test"}' -H 'Content-Type: application/json'
curl -XGET    "127.0.0.1:8081/goods/3"
curl -XDELETE "127.0.0.1:8081/goods/3"
 */


const config = require('config'),
      Memcached = require('memcached');

      Memcached.config.poolSize = 10;

let countKeys =  0;
const lifeTime = 300;

const memcached = new Memcached(config.memcached.server);

module.exports = {

    getMemcached: function getIdFromMC(id) {
        return new Promise(function(resolve, reject) {
            memcached.get(parseInt(id), function (err, data) {
                if(!err){
                    resolve(data);
                }else{
                    reject(err);
                }
            });
        });
    },

    setMemcached: function setNewIdToMC(inputData) {
        return new Promise(function(resolve, reject) {
 //         memcached.set(countKeys++,inputData,lifeTime,function (err, data) {

            memcached.stats(function(err,data){
                countKeys = data[0].curr_items;
            });
            console.log(countKeys); // problem with keys! there are delete in real time
            memcached.set(countKeys++,inputData,lifeTime,function (err, data) {
                if(!err){
                    resolve(data);
                }else{
                    reject(err);
                }
            });
        });
    },

    delMemcached: function removeIdInMC(id) {
        return new Promise((resolve, reject) => {
            return new Promise(function (resolve, reject) {
                memcached.delete(parseInt(id), function (err, data) {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        });
     }

};
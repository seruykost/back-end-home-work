"use strict";
/*
curl -XPOST   "127.0.0.1:8081/goods" -d 'Hello' -H 'Content-Type: text/plain'
curl -XGET    "127.0.0.1:8081/goods/Hello"
curl -XDELETE "127.0.0.1:8081/goods/Hello"

curl -XPOST   "127.0.0.1:8081/goods" -d 'Hello,@%!' -H 'Content-Type: text/plain'
curl -XGET    "127.0.0.1:8081/goods/Hello,@%!"
curl -XDELETE "127.0.0.1:8081/goods/Hello,@%!"
*/

const config = require('config'),// підключаемо конфіг з параметрами  memcached
      Memcached = require('memcached'); // підключаемо бібліотеку memcached

      Memcached.config.poolSize = 10; // максимальне кліькість підключень  memcached

let countKeys =  ''; // змінна для збередення ключа запису в базу
let md5Func = require('../helpers/jsmd5'); //підключаемо модуль шифрування
const lifeTime = 300; // час життязапису в базі memcached

const memcached = new Memcached(config.memcached.server,':',config.memcached.port); // підключення memcached

module.exports = {

    getMemcached: function getIdFromMC(id) { // оголошуємо функцію  для реалізації запиту get, вхідний паметер - ключ
        return new Promise(function (resolve, reject) { // повертаємо проміс
            id = md5Func(id); // отриманий з запиту ключ шифруємо хеш-фукнцією md5 (бібліотека скачена звідси https://javascript.ru/php/md5
            memcached.get(id, function (err, data) { // отримуємо значення з бази за зашифрованим ключем
                if (!err) { // якщо помилок немає
                    resolve(data); // якщо все добре - вертаємо data - результат виконання фукнції get об"єкта бази memcached
                } else {
                    reject(err); // інакше помилка
                }
            });
        });
    },

    setMemcached: function setNewIdToMC(inputData) {// оголошуємо функцію  для реалізації запиту post, вхідний паметер - дані
        return new Promise(function (resolve, reject) {
            //         memcached.set(countKeys++,inputData,lifeTime,function (err, data) {
            /*        memcached.stats(function(err,data){      // була іедя реалізації ключа для запису в базу на основі
                          countKeys = data[0].curr_items;      // автоінкременту значення кількості записаних ключів в базі
                      });*/                                    // data[0].curr_items - кількість записів в базі Memcached, але від цієї ідеї відмовився

            countKeys = md5Func(inputData); // шифруємо дані, отримані в тілі запросу. даний шифр буде ключем
            memcached.set(countKeys, inputData, lifeTime, function (err, data) {// записуємо значення в базу згідно згенерованого ключа
                if (!err) {
                    resolve('');
                } else {
                    reject(err);
                }
            });
        });
    },

    delMemcached: function removeIdInMC(id) { // оголошуємо функцію  для реалізації запиту delete, вхідний паметер - дані
        return new Promise(function (resolve, reject) {
            id = md5Func(id); // отриманий з запиту ключ шифруємо хеш-фукнцією md5
            memcached.delete(id, function (err) { // видаляємо значення з бази за згідно ключа
                if (!err) {
                    resolve('true'); //повертаємо істину, якщо дія успішна
                } else {
                    reject(err);
                }
            });
        });
    }

};
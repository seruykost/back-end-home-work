const memcached = require('../managers/memcachedManager'); // підключення менеджера

/**
 * @example curl -XGET "http://localhost:8081/users/1"
 */
async function getId (ctx, next) {  // для запиту get
    ctx.body = await memcached.getMemcached(ctx.params.id); //асинхронний виклик модуля роботи з memcached з параметром запиту і отримання резалуьтатів його виконання
    ctx.status = (ctx.body !== undefined) ? 200 : 404; // якщо в тілі контексту збережено не  undefined то статус 200 інакше 404
    await next();
}

/**
 * @example curl -XPOST "http://localhost:8081/users" -d '{"name":"New record 1"}' -H 'Content-Type: application/json'
 */
async function createId (ctx, next) {
    ctx.body = await memcached.setMemcached(ctx.request.body); // для запиту типу post в функцію set memcached передаем тіло запиту.
    ctx.status = (ctx.body !== false) ? 201 : 400; // отримана відповідь якщо не false, то статус 201 інакше - 400
    await next();
}

/**
 * @example curl -XDELETE "http://localhost:8081/users/3"
 */
async function deleteId (ctx, next) {
    await memcached.delMemcached(ctx.params.id); // для запиту типу delete в функцію del memcached передаем параметр з запиту.
    ctx.status = (ctx.body !== false) ? 204 : 400;
    await next();
}


module.exports = {getId, createId, deleteId}; // робимо функції модуля відкритими


const memcached = require('../managers/memcach');

/**
 * @example curl -XGET "http://localhost:8081/users/1"
 */
async function getId (ctx, next) {
    ctx.body = await memcached.getMemcached(ctx.params.id);
    ctx.status = 200;
    await next();
}

/**
 * @example curl -XPOST "http://localhost:8081/users" -d '{"name":"New record 1"}' -H 'Content-Type: application/json'
 */
async function createId (ctx, next) {
    ctx.body = await memcached.setMemcached(ctx.request.body);
    ctx.status = 201;
    await next();
}

/**
 * @example curl -XDELETE "http://localhost:8081/users/3"
 */
async function deleteId (ctx, next) {
    await memcached.delMemcached(ctx.params.id);
    ctx.status = 204;
    await next();
}


module.exports = {getId, createId, deleteId};
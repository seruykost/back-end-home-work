

const memcached = require('../managers/memcach');
let cleanerFunc  = require('../helpers/cleaner');

/**
 * @example curl -XGET "http://localhost:8081/users/1"
 */
async function getId (ctx, next) {
    console.log('1',ctx.params.id);
    ctx.body = await memcached.getMemcached(cleanerFunc(ctx.params.id));
    ctx.status = (ctx.body !== undefined) ? 200 : 404;
    await next();
}

/**
 * @example curl -XPOST "http://localhost:8081/users" -d '{"name":"New record 1"}' -H 'Content-Type: application/json'
 */
async function createId (ctx, next) {
    console.log('2',ctx.request.body);
    ctx.body = await memcached.setMemcached(cleanerFunc(ctx.request.body));
    ctx.status = (ctx.body !== false) ? 201 : 400;
    await next();
}

/**
 * @example curl -XDELETE "http://localhost:8081/users/3"
 */
async function deleteId (ctx, next) {
    console.log('3',ctx.params.id);
    await memcached.delMemcached(cleanerFunc(ctx.params.id));
    ctx.status = (ctx.body !== false) ? 204 : 400;
    await next();
}


module.exports = {getId, createId, deleteId};
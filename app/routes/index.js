/**
 * Main route rules
 * @param {koa} app - Koa appliacation
 * @param {helpers/passport} passport - Adapted passport module
 * @module routes
 */
module.exports = function routes(app, passport) {
    "use strict";

    const
        co   = require('co'),
        Router = require('koa-router'),
        authed = require('../helpers/authedMiddleware'),
        
        
    // Controllers
        indexController  = require('../controllers/indexController'),
        goodsController  = require('../controllers/goodsController'), // підключення контролера
        loginController  = require('../controllers/loginController'),
        secureController = require('../controllers/secureController');

    var router = new Router();

    router
        .get('/',          indexController.index)
        .get('/users',     indexController.list)
        .get('/users/:id', indexController.getId)

        .get('/goods/:id', goodsController.getId) //реалізація маршруту по типу запиту get
        .post('/goods/',   goodsController.createId) //реалізація маршруту по типу запиту post
        .del('/goods/:id', goodsController.deleteId) //реалізація маршруту по типу запиту delete

        .get('/login',     loginController.login)
        .post('/login',
            passport.authenticate('local', {
                successRedirect: '/secure',
                failureRedirect: '/login'
            })
        )
        .get('/logout', co.wrap(function*(ctx) {
            ctx.logout();
            ctx.redirect('/login')
        }))
        .get('/secure', authed, secureController.index);

    app.use(router.routes());
    app.use(router.allowedMethods({
        throw: true,
        notImplemented: () => new Boom.notImplemented(),
        methodNotAllowed: () => new Boom.methodNotAllowed()
    }));
};
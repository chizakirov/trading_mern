/* eslint-disable */
const path = require('path');
const controller = require('./controller.js');
const userController = require('./UserController');
const checkToken = require('./jwtMiddleware');

module.exports = function (app) {
  app
    .post('/api/user/login', userController.Login)
    .post('/api/user/signup', userController.Signup)
    .put('/api/user/account', checkToken, userController.updateBalance)
    .get('/api/user/orders', checkToken, userController.getOrders)

    .get('/api/stock/:symbol', controller.getQuote)
    .get('/api/position/:symbol', controller.getPosition)
    .get('/api/position', controller.allPositions)

    // .get('api/stock/orders', controller.allOrders)
    .get('/api/order/', checkToken, controller.oneOrder)
    .post('/api/order/', checkToken, controller.placeOrder)
    .get('/api/account', checkToken, controller.currentBalance)
    .all('*', (req, res, next) => {
      res.sendFile(path.resolve('./public/index.html'));
    });
};

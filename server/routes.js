/* eslint-disable */
const path = require('path');
const controller = require('./controller.js');
const userController = require('./UserController');
const checkToken = require('./jwtMiddleware');

module.exports = function (app) {
  app
    .post('/api/user/login', userController.Login)
    .post('/api/user/signup', userController.Signup)
    .put('/api/user/account', userController.updateBalance)
    .get('/api/user/orders', userController.getOrders)
    // .get('/api/user/returns', checkToken, userController.getReturns)

    .get('/api/stock/:symbol', controller.getQuote)
    .get('/api/position/:symbol', controller.getPosition)
    .get('/api/position', controller.allPositions)

    // .get('api/stock/orders', controller.allOrders)
    .get('/api/order/', controller.oneOrder)
    .post('/api/order/', controller.placeOrder)
    .get('/api/account', controller.currentBalance)
    .all('*', (req, res, next) => {
      res.sendFile(path.resolve('./public/index.html'));
    });
};

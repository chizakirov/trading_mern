const {Order, Position, User} = require('./model.js');

module.exports = {

  getQuote: (req, res) => {
    request.get(`https://api.iextrading.com/1.0/stock/${req.params.symbol}/batch?types=quote,news,chart&range=1m&last=10`, (error, response, body) => {
      res.json(body);
    });
  },

  placeOrder: async(req, res) => {
    const { id } = req.decoded;
    const {
      price, quantity, type, total, symbol
    } = req.body;
    try{
      const order = await Order.create({
        symbol,
        price,
        quantity,
        type,
        total,
        userId: id
      });
      const user = await User.findById(id);
      user.orders.push(order);
      user.currentBalance = order.type === "buy" ? 
      Math.round((user.currentBalance - order.price*order.quantity)*100)/100 : 
      Math.round((user.currentBalance + order.price*order.quantity)*100)/100;
      user.save();
    }catch(err){
      res.json(err);
    }
  },

      //   model.Position.findOne({ symbol: order.symbol })
      //     .then((data) => {
      //       if (data == null) {
      //         model.Position.create({ symbol: order.symbol, quantity: order.quantity, total: order.total })
      //           .then((result) => {
      //             res.json(order);
      //           })
      //           .catch(err => res.json(err));
      //       } else if (order.type === 'buy') {
      //         const order_quantity = order.quantity;
      //         data.quantity += order_quantity;
      //         data.total += order.total;
      //         data.save();
      //         res.json(order);
      //       } else if (order.type == 'sell') {
      //         const order_quantity = order.quantity;
      //         data.quantity -= order_quantity;
      //         data.total += order.total;
      //         data.save();
      //         res.json(order);
      //       }
      //     })
      //     .catch(err => res.json(err));
      // })
      // .catch(err => res.json(err));

  oneOrder: (req, res) => {
    model.Order.find({})
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          res.json(data[data.length - 1]);
        }
      })
      .catch(err => res.json(err));
  },

  getPosition: (req, res) => {
    model.Position.find({ symbol: req.params.symbol })
      .then(data => res.json(data))
      .catch(err => res.json(err));
  },

  allPositions: (req, res) => {
    model.Position.find()
      .then((data) => {
        res.json(data);
      })
      .catch(err => res.json(err));
  },

  currentBalance: (req, res) => {
    model.Position.aggregate({ $group: { _id: null, total: { $sum: $total } } })
      .then((data) => {
        res.json(data);
      })
      .catch(err => res.json(err));
  }
};

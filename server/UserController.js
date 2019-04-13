const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('./model.js');

module.exports = {
  Signup: async (req, res) => {
    try {
      console.log('req.body', req.body);
      // find if there's existing user in db
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        const newUser = await User.create(req.body);
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, 'somethingsomething');
        console.log("token signup ", token);
        // Take the secret (private key), take the user info and encrypt it with that private key.

        res.json(token);
      } else {
        const message = 'Email already exists';
        res.json(message);
      }
    } catch (err) {
      console.log(err);
    }
  },

  Login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email }).populate('orders');
      console.log('Does my user have orders?', user);
      if (!user) {
        const message = 'Invalid email/password';
        res.json(message);
      }
      // console.log('user?', user);

      const match = await bcrypt.compare(req.body.password, user.password);
      // res == true
      // console.log('match?', true);
      if (match) {
        const token = jwt.sign({ id: user._id, email: user.email }, 'somethingsomething');
        console.log("token login ", token);
        // Take the secret (private key), take the user info and encrypt it with that private key.

        res.json(token);
      } else {
        const message = 'Invalid email/password';
        res.json(message);
      }
    } catch (err) {
      console.log(err);
    }
  },

  updateBalance: async(req, res) => {
    try{
      const user = await User.findOne({ email: req.decoded.email})
      if(!user){
        const message = "Login to deposit";
        res.json(message);
      }else {
        user.balance += +req.body.deposit;
        user.currentBalance += +req.body.deposit;
        user.save();
        res.json({ balance: user.balance, currentBalance: user.currentBalance });
      }
    }catch (err){
      console.log(err);
    }
  },

  getOrders: async(req, res) => {
    try{
      const user = await User.findOne({ email: req.decoded.email}).populate('orders')
      if(!user){
        const message = "Login to deposit";
        res.json(message);
      }else {
        res.json({orders: user.orders, balance: user.balance});
      }
    }catch(err){
      console.log(err);
    }
  },

  // getReturns: async(req, res) => {
  //   try{
      
  //   }catch {
  //     console.log(err);
  //   }
  // }
  
  // getInfo: async (req, res) => {
  //   try {
  //     const user = await User.findById(req.body);
  //     res.json({email: user.email, name: ''})
  //   } catch (err) {
  //     console.log('err', err)
  //   }
  // }

};

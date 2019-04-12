/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://chizakirov:1MERNengineer@ds137596.mlab.com:37596/heroku_d3bknxtc', { useNewUrlParser: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  balance: {type: Number, default: 0},
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

UserSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    // console.log("salt ", salt);
    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});


// Define an instance method that we can use to compare their password with the hashed password

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  // Compare password user used to login with and the password in the database (this.password)
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const OrderSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required']
  },
  type: {
    type: String,
    required: [true, 'Trade type is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  total: { type: Number },
  date: {
    type: Date,
    default: Date.now
  },
  status: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const PositionSchema = new mongoose.Schema({
  symbol: { type: String },
  quantity: { type: Number },
  total: { type: Number }
});

const Order = mongoose.model('Order', OrderSchema);
const Position = mongoose.model('Position', PositionSchema);
const User = mongoose.model('User', UserSchema);
module.exports = {
  Order,
  Position,
  User
};

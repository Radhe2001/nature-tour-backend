const mongoose = require("mongoose");

const contactSchema =  mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  queryDetail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("contact", contactSchema);

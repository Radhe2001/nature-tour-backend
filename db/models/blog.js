const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const blogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    country: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    blogTitle: {
      type: String,
      required: true,
    },
    blogDescription: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);


blogSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("blog", blogSchema);

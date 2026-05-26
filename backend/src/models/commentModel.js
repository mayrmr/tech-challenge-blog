const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    texto: {
      type: String,
      required: true,
      trim: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    autor: {
      type: String,
      required: true,
    },

    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: {
    type: [String],
    default: [],
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
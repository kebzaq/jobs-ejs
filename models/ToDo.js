const mongoose = require("mongoose");

const ToDoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the ToDo"],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a description for the ToDo"],
      maxlength: 300,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user ID who created the ToDo"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ToDo", ToDoSchema);

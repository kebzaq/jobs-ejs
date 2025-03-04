const Todo = require("../models/ToDo");
const parseVErr = require("../utils/parseValidationErrs");

const getAllTodos = async (req, res) => {
  const todos = await Todo.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  console.log(todos);
  // res.status(StatusCodes.OK).json({ todos, count: todos.length });
    res.render("todos", {todos});
  };
const addTodo = (req, res) => {
  res.render("add todo");
};
const editTodo = (req, res) => {
    res.render("edit todo");
  };
  const deleteTodo = (req, res) => {
    res.render("delete todo");
  };

// const registerDo = async (req, res, next) => {
//   if (req.body.password != req.body.password1) {
//     req.flash("error", "The passwords entered do not match.");
//     return res.render("register", { errors: req.flash("error") });
//   }
//   try {
//     await User.create(req.body);
//   } catch (e) {
//     if (e.constructor.name === "ValidationError") {
//       parseVErr(e, req);
//     } else if (e.name === "MongoServerError" && e.code === 11000) {
//       req.flash("error", "That email address is already registered.");
//     } else {
//       return next(e);
//     }
//     return res.render("register", { errors: req.flash("error") });
//   }
//   res.redirect("/");
// };



module.exports = {
    getAllTodos,
  addTodo,
  editTodo,
  deleteTodo
};

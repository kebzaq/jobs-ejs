const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
    getAllTodos,
    addTodo,
    editTodo, 
    deleteTodo
  } = require("../controllers/todos");

router.route("/todos").get(getAllTodos).post(addTodo);
router.route("/todos/:id").patch(editTodo).delete(deleteTodo);
// router
//   .route("/logon")
//   .get(logonShow)
//   .post(
//     passport.authenticate("local", {
//       successRedirect: "/",
//       failureRedirect: "/sessions/logon",
//       failureFlash: true,
//     })
//     // (req, res) => {
//     //   res.send("Not yet implemented.");
//     // }
//   );
// router.route("/logoff").post(logoff);

module.exports = router;

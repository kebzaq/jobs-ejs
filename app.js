const express = require("express");
require("express-async-errors");
const app = express();
require("dotenv").config(); // to load the .env file into the process.env object
const session = require("express-session");
const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");

const MongoDBStore = require("connect-mongodb-session")(session);

const passport = require("passport");
const passportInit = require("./passport/passportInit");
const secretWordRouter = require("./routes/secretWord");
const todosRouter = require("./routes/todos");
const auth = require("./middleware/auth");

// const url = process.env.MONGO_URI;
let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV == "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(require("body-parser").urlencoded({ extended: true }));

const store = new MongoDBStore({
  // may throw an error, which won't be caught
  uri: mongoURL,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));

// Passport - relies on session
passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use(require("connect-flash")());
// app.use(require("./middleware/storeLocals"));

// CSRF protection
app.use(express.urlencoded({ extended: false }));
let csrf_development_mode = true;
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1);
}
const csrf_options = {
  protected_operations: ["PATCH"],
  protected_content_types: ["application/json"],
  development_mode: csrf_development_mode,
};
const csrf_middleware = csrf(csrf_options); //initialise and return middlware
app.use(csrf_middleware);

app.use(require("./middleware/storeLocals"));
// routes
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));

app.use("/todos", auth, todosRouter);
// secret word handling
app.use("/secretWord", auth, secretWordRouter);

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});
// api endpoints
app.get("/multiply", (req, res) => {
  const result = req.query.first * req.query.second;
  if (result.isNaN) {
    result = "NaN";
  } else if (result == null) {
    result = "null";
  }
  res.json({ result: result });
});

app.use((req, res, next) => {
  if (req.path == "/multiply") {
    res.set("Content-Type", "application/json");
  } else {
    res.set("Content-Type", "text/html");
  }
  next();
});

const start = () => {
  try {
    require("./db/connect")(mongoURL);
    return app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

// const start = async () => {
//   try {
//     await require("./db/connect")(process.env.MONGO_URI);
//     app.listen(port, () =>
//       console.log(`Server is listening on port ${port}...`)
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

start();
module.exports = { app };

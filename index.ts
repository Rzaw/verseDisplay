import express = require("express");
import fs = require("fs");
import bodyParser = require("body-parser");
const app = express();
const jsonLocation: string = "./storage/verses.json";

//set the template engine ejs
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/sendMessage", (req, res) => {
  fs.readFile(jsonLocation, "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file");
    }
    try {
      var verses: any = JSON.parse(jsonString);
      res.render("sendMessage", { data: verses });
    } catch (error) {
      res.render("sendMessage", { data: error });
    }
  });
});

app.post("/sendMessage", (req, res, next) => {
  var verses: any = FetchJSON(verses);
  if (req.body.inputGroupSelect01 === "host") {
    verses.host[0].push({
      id: "",
      scripture: req.body.scripture,
      verse: req.body.verse
    });
  } else if (req.body.inputGroupSelect01 === "guest") {
    verses.guest[0].push({
      id: "",
      scripture: req.body.scripture,
      verse: req.body.verse
    });
  }

  fs.writeFile("./storage/verses.json", verses, err => {
    if (err) console.log("Error writing file:", err);
  });
  res.redirect("/sendMessage");
});

function FetchJSON(verses: any) {
  fs.readFile("./storage/verses.json", "utf8", async (err, jsonString) => {
    if (err) {
      console.log("Error reading file");
    }
    try {
      verses = await JSON.parse(jsonString);
      return verses;
    } catch (error) {
      verses = error;
      return verses;
    }
  });
}

//Listen on port 3000
var server = app.listen(8080);

//socket.io instantiation
const io = require("socket.io")(server);

//listen on every connection
io.on("connection", (socket: any) => {
  // console.log("New user connected");

  //default username
  socket.username = "Anonymous";

  //listen on change_username
  socket.on("change_username", (data: any) => {
    socket.username = data.username;
  });

  //listen on new_message
  socket.on("new_message", (data: any) => {
    //broadcast the new message
    io.sockets.emit("new_message", {
      message: data.message,
      username: socket.username
    });
  });

  //listen on typing
  socket.on("typing", (data: any) => {
    socket.broadcast.emit("typing", { username: socket.username });
  });
});

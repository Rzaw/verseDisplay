"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const jsonLocation = "./storage/verses.json";
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
app.get("/sendMessage", (req, res, next) => {
    try {
        let jsonString = FetchJSONFile();
        let verses = JSON.parse(jsonString);
        res.render("sendMessage", { data: verses });
    }
    catch (error) {
        next(error);
    }
});
app.post("/sendMessage", (req, res, next) => {
    var jsonString = FetchJSONFile();
    var verses = JSON.parse(jsonString);
    // verses = PushToJSONObject(
    //   req.body.inputGroupSelect01,
    //   verses,
    //   req.body.scripture,
    //   req.body.verse
    // );
    try {
        fs.writeFileSync(jsonLocation, JSON.stringify(verses), "utf8");
    }
    catch (error) {
        next(error);
    }
    res.redirect("/sendMessage");
});
//Listen on port 3000
var server = app.listen(8080, "0.0.0.0");
//socket.io instantiation
const io = require("socket.io")(server);
//listen on every connection
io.on("connection", (socket) => {
    console.log("New user connected");
    //default username
    socket.username = "Anonymous";
    //listen on change_username
    socket.on("change_username", (data) => {
        socket.username = data.username;
    });
    //listen on new_message
    socket.on("new_message", (data) => {
        //broadcast the new message
        io.sockets.emit("new_message", {
            message: data.message,
            username: socket.username
        });
    });
    //listen on typing
    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", { username: socket.username });
    });
});
// Functions
function FetchJSONFile() {
    const jsonString = fs.readFileSync(jsonLocation, "utf8");
    return jsonString;
}
function PushToJSONObject(role, jsonFile, scripture, verse) {
    switch (role) {
        case "host":
            jsonFile.host.push({
                id: "",
                scripture: scripture,
                verse: verse
            });
            break;
        case "guest":
            jsonFile.guest.push({
                id: "",
                scripture: scripture,
                verse: verse
            });
            break;
        default:
            break;
    }
    return jsonFile;
}
//# sourceMappingURL=index.js.map
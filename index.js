"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
app.get("/sendMessage", (req, res) => {
    fs.readFile(jsonLocation, "utf8", (err, jsonString) => {
        if (err) {
            console.log("Error reading file");
        }
        try {
            var verses = JSON.parse(jsonString);
            res.render("sendMessage", { data: verses });
        }
        catch (error) {
            res.render("sendMessage", { data: error });
        }
    });
});
app.post("/sendMessage", (req, res, next) => {
    var verses = FetchJSON(verses);
    if (req.body.inputGroupSelect01 === "host") {
        verses.host[0].push({
            id: "",
            scripture: req.body.scripture,
            verse: req.body.verse
        });
    }
    else if (req.body.inputGroupSelect01 === "guest") {
        verses.guest[0].push({
            id: "",
            scripture: req.body.scripture,
            verse: req.body.verse
        });
    }
    fs.writeFile("./storage/verses.json", verses, err => {
        if (err)
            console.log("Error writing file:", err);
    });
    res.redirect("/sendMessage");
});
function FetchJSON(verses) {
    fs.readFile("./storage/verses.json", "utf8", (err, jsonString) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            console.log("Error reading file");
        }
        try {
            verses = yield JSON.parse(jsonString);
            return verses;
        }
        catch (error) {
            verses = error;
            return verses;
        }
    }));
}
//Listen on port 3000
var server = app.listen(8080);
//socket.io instantiation
const io = require("socket.io")(server);
//listen on every connection
io.on("connection", (socket) => {
    // console.log("New user connected");
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
//# sourceMappingURL=index.js.map
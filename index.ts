import express = require("express");
import fs = require("fs");
import bodyParser = require("body-parser");
import idGen = require("uniqid");
const app = express();
const verseStorage: string = "./storage/verses.json";
const currentVerse: string = "./storage/currentVerse.json"

//set the template engine ejs
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.get("/", (req, res) => {
  var obj = GetCurrentVerse();
  res.render("index", {obj: obj});
});

app.get("/sendMessage", (req, res, next) => {
  
  try {
    let jsonString = FetchJSONFile(true);
    let jsonData = JSON.parse(jsonString);
    // let versesArray = verses.verse.split(/([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])/g);
    res.render("sendMessage", { data: jsonData });
  } catch (error) {
    next(error);
  }
});

app.post("/sendMessage", (req, res, next) => {
  var jsonString: any = FetchJSONFile(true);
  var verses: any = JSON.parse(jsonString);
  verses = PushToJSONObject(
    req.body.inputGroupSelect01,
    verses,
    req.body.scripture,
    req.body.verse
  );

  try {
    WriteJSONFile(verses, true);
  } catch (error) {
    next(error);
  }
  res.redirect("/sendMessage");
});

app.param(['role', 'id'], function (req, res, next, value) {
  next()

})


app.get("/sendMessage/:role/:id", (req, res, next) => {
  var jsonString: any = FetchJSONFile(true);
  var verses = JSON.parse(jsonString);
  
  var params = req.path.split('/');
  params = arrayRemove(params, "sendMessage")
  params = arrayRemove(params, "");

  switch (params[0]) {
    case 'host':
      delete verses.host[params[1]];
      break;
    case 'guest':
      delete verses.guest[params[1]];
      break;
  }

  WriteJSONFile(verses, true);

  res.redirect("/sendMessage");
});

//Listen on port 3000
var server = app.listen(8080, "0.0.0.0");

//socket.io instantiation
const io = require("socket.io")(server);

//listen on every connection
io.on("connection", (socket: any) => {
  console.log("New user connected");

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
    WriteJSONFile({scripture: socket.username, verse: data.message}, false);
    console.log("Message sent");
  });

  //listen on typing
  // socket.on("typing", (data: any) => {
  //   socket.broadcast.emit("typing", { username: socket.username });
  // });
});

// Functions

function FetchJSONFile(storage: boolean) {
  var readFrom: string;
  if (storage){
    readFrom = verseStorage;
  } else {
    readFrom = currentVerse;
  }
  const jsonString = fs.readFileSync(readFrom, "utf8");
  return jsonString;
}

function WriteJSONFile(obj:any, storage: boolean){
  var readFrom: string;
  if (storage){
    readFrom = verseStorage;
  } else {
    readFrom = currentVerse;
  }
  var jsString:string = JSON.stringify(obj)
  if (jsString.search("/,null") === -1) {
    jsString = jsString.replace(",null", "");
  }
  if (jsString.search("/[null]") === -1){
    jsString = jsString.replace("[null]", "[]");
  }
  if (jsString.search("/null,") === -1){
    jsString = jsString.replace("null,", "");
  }
  if (jsString.search("/,null,") === -1){
    jsString = jsString.replace(",null,", ",");
  }
  fs.writeFileSync(readFrom, jsString, "utf8");
}

function PushToJSONObject(
  role: string,
  jsonFile: any,
  scripture: string,
  verse: string
): void {

  switch (role) {
    case "host":
      jsonFile.host.push({
        id: idGen(),
        scripture: scripture,
        verse: verse
      });
      break;

    case "guest":
      jsonFile.guest.push({
        id: idGen(),
        scripture: scripture,
        verse: verse
      });
      break;

    default:
      break;
  }
  return jsonFile;
}

function arrayRemove(arr:string[], value:string) {
  return arr.filter(function(ele){
      return ele != value;
  });
}

function GetCurrentVerse(){
  var json = FetchJSONFile(false);
  return JSON.parse(json);
}

function WriteToCurrentVerse(){
}
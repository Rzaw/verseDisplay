$(function() {
  //make connection
  var socket = io.connect(window.location.host);

  //buttons and inputs
  var message = $("#message");
  var username = $("#username");
  var send_message = $("#send_message");
  var send_username = $("#send_username");
  var chatroom = $("#chatroom");
  var feedback = $("#feedback");

  //Emit message
  send_message.click(function() {
    socket.emit("new_message", { message: message.val() });
  });

  //Listen on new_message
  socket.on("new_message", data => {
    feedback.html("");
    message.val("");
    chatroom.html("");
    chatroom.append(
      "<blockquote class='blockquote text-center'><p class='mb-0' style='font-size: x-large;'>" +
        data.message +
        "</p><footer class='blockquote-footer'>" +
        data.username +
        "</footer></blockquote>"
    );
  });

  //Emit a username
  send_username.click(function() {
    socket.emit("change_username", { username: username.val() });
  });

  //Emit typing
  //   message.bind("keypress", () => {
  //     socket.emit("typing");
  //   });

  //   //Listen on typing
  //   socket.on("typing", data => {
  //     feedback.html(
  //       "<p><i>" + data.username + " is typing a message..." + "</i></p>"
  //     );
  //   });
});

function sendToDisplay(sc, vr) {
  var username = $("#username");
  var message = $("#message");
  var send_message = $("#send_message");
  var send_username = $("#send_username");
  username.val(sc);
  message.val(vr);

  if (username != null || username != undefined) {
    send_username.click();
  }
  if (message != null || message != undefined) {
    send_message.click();
  }
}

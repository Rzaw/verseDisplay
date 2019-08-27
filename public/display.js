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
    chatroom.html(
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

function sendToDisplay(uniqueID) {
  var username = $("#username");
  var message = $("#message");
  var send_message = $("#send_message");
  var send_username = $("#send_username");

  let scripture = $("#js-"+uniqueID+"-scripture")[0].innerText.trim().substring(0, $("#js-"+uniqueID+"-scripture")[0].innerText.trim().length-2);
  let verse = $("#js-"+uniqueID+"-verse")[0].innerText.trim();

  username.val(scripture);
  message.val(verse);

  if (username != null || username != undefined) {
    send_username.click();
  }
  if (message != null || message != undefined) {
    send_message.click();
  }
}

function deleteVerseFromJSON(id, role){
  $.ajax({
    url: '/sendMessage/'+role+'/'+id+'',
    type: 'GET',
    success: function() {
      location.reload();
    }
});
}
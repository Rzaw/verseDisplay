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
});

// Priekš pogām
$(".verse-button").click(function() {
  $(this).toggleClass("active");
  // Ja kādam no pantiem ir 'active' klase, tad tiek noņemts atribūts 'disabled',
  // bet ja nav atrasts tad atribūts tiek uzlikts atpakaļ.
  if (
    $(this)
      .parent()
      .children()
      .hasClass("active")
  ) {
    $(this)
      .parent()
      .parent()
      .children()[5]
      .removeAttribute("disabled");
  } else {
    $(this)
      .parent()
      .parent()
      .children()[5]
      .setAttribute("disabled", "disabled");
  }
});

function sendToDisplay(uniqueID) {
  var username = $("#username");
  var message = $("#message");
  var send_message = $("#send_message");
  var send_username = $("#send_username");

  let scripture = $("#js-" + uniqueID + "-scripture")[0]
    .innerText.trim()
    .substring(
      0,
      $("#js-" + uniqueID + "-scripture")[0].innerText.trim().length - 2
    );
  let verse = $("#js-" + uniqueID + "-verse")[0].innerText.trim();

  username.val(scripture);
  message.val(verse);

  if (username != null || username != undefined) {
    send_username.click();
  }
  if (message != null || message != undefined) {
    send_message.click();
  }
}

function deleteVerseFromJSON(id, role) {
  $.ajax({
    url: "/sendMessage/" + role + "/" + id + "",
    type: "GET",
    success: function() {
      location.reload();
    }
  });
}

function SendToDisplaySelected(uniqueID) {
  var username = $("#username");
  var message = $("#message");
  var send_message = $("#send_message");
  var send_username = $("#send_username");

  // Ievāc informāciju no bloka un atlasa atzīmētos.
  let scripture = $("#js-scripture-" + uniqueID)[0]
    .innerText.trim()
    .substring(
      0,
      $("#js-scripture-" + uniqueID)[0].innerText.trim().length - 2
    );
  // Pānem visus aktīvos pantus.
  let activeVerses = $("#js-verse-" + uniqueID)
    .children()
    .filter(".active");

  let verse = activeVerses.text();

  activeVerses.removeClass("active");

  username.val(scripture);
  message.val(verse);

  if (username != null || username != undefined) {
    send_username.click();
  }
  if (message != null || message != undefined) {
    send_message.click();
  }
}

function SendToDisplayAll(uniqueID) {
  var username = $("#username");
  var message = $("#message");
  var send_message = $("#send_message");
  var send_username = $("#send_username");

  // Ievāc informāciju no bloka un atlasa atzīmētos.
  let scripture = $("#js-scripture-" + uniqueID)[0]
    .innerText.trim()
    .substring(
      0,
      $("#js-scripture-" + uniqueID)[0].innerText.trim().length - 2
    );
  let verse = $("#js-verse-" + uniqueID)
    .children()
    .text();

  username.val(scripture);
  message.val(verse);

  if (username != null || username != undefined) {
    send_username.click();
  }
  if (message != null || message != undefined) {
    send_message.click();
  }
}

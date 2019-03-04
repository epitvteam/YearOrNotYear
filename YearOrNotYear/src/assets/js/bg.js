$(document).ready(function() {
  if(window.location.pathname == "/home") {
    $("#back").addClass("linear");
  } else if(window.location.pathname == "linear") {
    $("#back").addClass("white");
  }
});

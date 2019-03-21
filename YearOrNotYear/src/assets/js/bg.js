$(document).ready(function() {
  if(window.location.pathname == "/home") {
    $("#back").addClass("linear");
  } else if(window.location.pathname == "/dasboard") {
    $("#back").addClass("white");
  }
});

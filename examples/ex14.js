$(document).ready(function () {
  // $("#mySelect");
  $("#mySelect").select2({
    width: "100%",
  });
  $(".select2-selection").css({ border: "2px solid blue" });
  $("#multipleSelect").select2({
    width: "100%",
  });
  $(".select2-selection").css({ border: "2px solid blue" });

  $("#opendropdown").click(function () {
    $("#mySelect").select2("open");
  });
  $("#closedropdown").click(function () {
    $("#mySelect").select2("close");
  });

  $("#appenddata").on("click", function () {
    var valuesToSelect = ["AL", "WY"];
    $("#multipleSelect").val(valuesToSelect).trigger("change");
  });

  $("#clear").on("click", function () {
    $("#multipleSelect").val(null).trigger("change");
  });
});

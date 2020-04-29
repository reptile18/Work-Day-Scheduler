$(document).ready(function() {
  var currentDate = moment();
  var dateString = currentDate.format("MMMM Do YYYY");
  var schedule;
  var activeDataHour;
  
  function updateDate() {
    dateString = currentDate.format("MMMM Do YYYY")
    $("#currentDay").text(dateString);
  }
  updateDate();

  function load() {
    schedule = localStorage.getItem("work-day-schedule");
    if (schedule == null) {
      schedule = {};
      schedule[dateString] = {};
    }
    else {
      schedule = JSON.parse(schedule);
    }
  }
  load();

  function save() {
    let scheduleString = JSON.stringify(schedule);
    localStorage.setItem("work-day-schedule",scheduleString);
  }
  
  function update() {
    for (var t = 9; t < 18; t++)
    {
      let item;
      if (typeof schedule[dateString] !== "undefined") {
        item = schedule[dateString]["t" + t];
        item = item==null?"":item;
      }
      addRow(t,item);
    }
  }
  function addRow(time,item) {
    var divRow = $("<div>").addClass("row");
    var hour = $("<div>").text(time>12?time-12+"PM":time+"AM").addClass("hour col-sm-1");
    var description = $("<div>").addClass("description").text(item);
    var timeBlock = $("<div>").addClass("time-block col-sm-10 d-flex justify-content-center align-items-center").append(description).attr("id","item"+time).attr("data-hour",time);
    var saveButton = $("<i>").addClass("fas fa-save");
    var saveButtonDiv = $("<div>").addClass("saveBtn col-sm-1 d-flex justify-content-center align-items-center").append(saveButton).attr("data-hour",time);

    // highlighting
    // old behavior
    /*if (time < currentDate.hour()) {
      timeBlock.addClass("past");
    }
    else if (time == currentDate.hour()) {
      timeBlock.addClass("present");
    }
    else {
      timeBlock.addClass("future");
    }*/
    // bonus behavior
    if (currentDate.dayOfYear() < moment().dayOfYear()) {
      timeBlock.addClass("past");
    }
    else if (currentDate.dayOfYear() > moment().dayOfYear()) {
      timeBlock.addClass("future");
    }
    else {
      if (time < currentDate.hour()) {
        timeBlock.addClass("past");
      }
      else if (time == currentDate.hour()) {
        timeBlock.addClass("present");
      }
      else {
        timeBlock.addClass("future");
      }
    }

    divRow.append(hour).append(timeBlock).append(saveButtonDiv);
    $(".container").append(divRow);
  }
  update();

  function onOutsideTextAreaClick(event) {
    if (!$("#edit"+activeDataHour).is(event.target) && $("#edit"+activeDataHour).has(event.target).length === 0) {
      $("#item"+activeDataHour).addClass("d-flex").removeClass("d-none");
      $("#edit"+activeDataHour).remove();
      $(document).off("click");
    }
  }
  function onTimeBlockClick(event) {
    console.log("time_click");
    event.stopPropagation();
    activeDataHour = $(this).attr("data-hour");
    var itemInput = $("<textarea>").addClass("time-block col-sm-10 d-flex justify-content-center align-items-center").attr("id","edit"+activeDataHour).val($(this).text());
    
    // hide if click outside
    $(document).click(onOutsideTextAreaClick);
    $(this).before(itemInput);
    $(this).addClass("d-none").removeClass("d-flex");
    itemInput.focus();
  }
  function onSaveBtnClick() {
    let datahour = $(this).attr("data-hour");
    $("#item"+datahour).addClass("d-flex").removeClass("d-none").text($("#edit"+datahour).val());
    $(document).off("click");
    //save
    schedule[dateString]["t"+datahour] = $("#item"+datahour).text();
    save();
    $("#edit"+datahour).remove();
  }

  function offEvents() {
    $(".time-block").off("click","**");
    $(".saveBtn").off("click","**");
  }

  function onEvents() {
    $(".time-block").click(onTimeBlockClick);
    $(".saveBtn").click(onSaveBtnClick);
  }

  function newDay() {
    offEvents();
    $(".container").empty();
    updateDate();
    update();
    onEvents();
    if (typeof schedule[dateString] === "undefined") {
      schedule[dateString] = {};
    }
  }

  // Events
  onEvents();

  // Bonus
  
  $("#prevDayIcon").click(function(event) {
    currentDate.subtract(1,"d");
    newDay();
  });

  $("#nextDayIcon").click(function(event) {
    currentDate.add(1,"d");
    newDay();
  }); 
  


});
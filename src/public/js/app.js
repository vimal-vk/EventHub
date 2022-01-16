var count = 2
function newContest() {
  containerData = {
    container1Data: [
      ["contestName", "Name of the Contest", "text"],
      ["contestVenue", "Venue", "text"],
      ["contestStartDate", "Contest Start Date & Time", "datetime-local"],
      ["contestLink", "Contest Registration Link", "url"],
      ["contestMailId", "Contest Organiser Mail Id", "email"]
    ],
    container2Data: [
      ["contestMode", "Mode Online/Offline", "text"],
      ["contestFee", "Contest Fee", "number"],
      ["contestEndDate", "Contest End Date & Time", "datetime-local"],
      ["contestPhoneNo", "Event Organiser Contact Number", "number"]
    ]
  }
  var div = document.getElementById('additional-event')
  var newElement = document.createElement('h2')
  var answer = document.createTextNode("Contest - " + count + " Details")
  newElement.appendChild(answer)
  newElement.setAttribute("class","event-header")
  div.appendChild(newElement)
  var formdiv = document.createElement('div')
  formdiv.setAttribute("class", "register-section")
  var container1 = document.createElement('div')
  var container2 = document.createElement('div')
  container1.setAttribute("class", "form-container")
  container2.setAttribute("class", "form-container")
  for (var i = 0; i < 5; i++) {
    var label = document.createElement('label')
    label.setAttribute('class', 'event-label')
    label.setAttribute('for',containerData.container1Data[i][0]+count)
    answer = document.createTextNode(containerData.container1Data[i][1])
    label.appendChild(answer)
    container1.appendChild(label)
    var input = document.createElement('input')
    input.setAttribute('class', 'event-box')
    input.setAttribute('type',containerData.container1Data[i][2])
    input.setAttribute('name', containerData.container1Data[i][0]+count)
    container1.appendChild(input)
  }
  for (var i = 0; i < 4; i++) {
    var label = document.createElement('label')
    label.setAttribute('class', 'event-label')
    label.setAttribute('for',containerData.container2Data[i][0]+count)
    answer = document.createTextNode(containerData.container2Data[i][1])
    label.appendChild(answer)
    container2.appendChild(label)
    var input = document.createElement('input')
    input.setAttribute('class', 'event-box')
    input.setAttribute('type',containerData.container2Data[i][2])
    input.setAttribute('name', containerData.container2Data[i][0]+count)
    container2.appendChild(input)
  }
  var label = document.createElement('label')
  label.setAttribute('class', 'event-label')
  label.setAttribute('for','contestDesc'+count)
  answer = document.createTextNode("Tell about this Contest (about 100 words)")
  label.appendChild(answer)
  container2.appendChild(label)
  var input = document.createElement('textarea')
  input.setAttribute('class', 'event-box')
  input.setAttribute('name', "contestDesc" + count)
  input.setAttribute('rows', 2)
  input.setAttribute('cols', 10)
  container2.appendChild(input)
  formdiv.appendChild(container1)
  formdiv.appendChild(container2)
  div.appendChild(formdiv)
  count += 1
}

$(document).ready(function () {
  $('#submit').attr("disabled", true);
});

(function () {
  $('.form-container > input').keyup(function() {
    var empty = false;
    $('.form-container > input').each(function () {
      if (($(this).attr('type') != 'file') && ($(this).val() == '')) {
        console.log($(this).attr('name'))
        empty = true;
      }
    });

    if (empty) {
      $('#submit').attr('disabled', 'disabled'); 
    } else {
      $('#submit').removeAttr('disabled');
    }
  });
})()

function expandButton(button) {
  var button1 = document.getElementById(button.id)
  var button2 = document.getElementById(JSON.stringify(Number(button.id) + 1))
  var div = document.getElementById(JSON.stringify(Number(button.id) + 2))
  div.classList.remove("hide")
  div.classList.add("container-display")
  button1.classList.remove("button-display")
  button1.classList.add("hide")
  button2.classList.remove("hide")
  button2.classList.add("button-display")
}

function compressButton(button){
  var button1 = document.getElementById(button.id)
  var button2 = document.getElementById(JSON.stringify(Number(button.id) - 1))
  var div = document.getElementById(JSON.stringify(Number(button.id) + 1))
  div.classList.remove("container-display")
  div.classList.add("hide")
  button1.classList.remove("button-display")
  button1.classList.add("hide")
  button2.classList.remove("hide")
  button2.classList.add("button-display")
}